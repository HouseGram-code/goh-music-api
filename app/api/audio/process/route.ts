import { NextRequest, NextResponse } from 'next/server';
import ffmpeg from 'fluent-ffmpeg';
import { getUserByApiKey, deductBalance } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

// Effects configuration
const EFFECTS = {
  slowed: (command: ffmpeg.FfmpegCommand) => {
    // Slow down (0.8x) + Reverb (simulated with aecho)
    return command.audioFilters([
      'atempo=0.8',
      'aecho=0.8:0.88:60:0.4'
    ]);
  },
  nightcore: (command: ffmpeg.FfmpegCommand) => {
    // Speed up (1.25x) + Pitch up
    return command.audioFilters([
      'asetrate=44100*1.25',
      'aresample=44100',
      'atempo=1.0'
    ]);
  },
  bassboost: (command: ffmpeg.FfmpegCommand) => {
    // Bass boost
    return command.audioFilters([
      'equalizer=f=60:width_type=h:width=50:g=10'
    ]);
  },
  '8d': (command: ffmpeg.FfmpegCommand) => {
    // 8D Audio (Auto-panning)
    return command.audioFilters([
      'apulsator=hz=0.125'
    ]);
  },
  lofi: (command: ffmpeg.FfmpegCommand) => {
    // Lo-fi (Low pass filter + some noise/distortion)
    return command.audioFilters([
      'lowpass=f=3000',
      'aecho=0.6:0.3:20:0.5'
    ]);
  }
};

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 401 });
  }

  const user = getUserByApiKey(apiKey);
  if (!user) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  if (user.balance < 25) {
    return NextResponse.json({ error: 'Insufficient balance. Please top up.' }, { status: 402 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const effect = formData.get('effect') as string;

    if (!file || !effect || !EFFECTS[effect as keyof typeof EFFECTS]) {
      return NextResponse.json({ error: 'File and valid effect are required' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const inputPath = path.join(tempDir, `${uuidv4()}_input.mp3`);
    const outputPath = path.join(tempDir, `${uuidv4()}_output.mp3`);

    await writeFile(inputPath, buffer);

    return new Promise<NextResponse>((resolve) => {
      let command = ffmpeg(inputPath);
      
      // Apply the selected effect
      command = EFFECTS[effect as keyof typeof EFFECTS](command);

      command
        .toFormat('mp3')
        .on('end', async () => {
          const outputBuffer = fs.readFileSync(outputPath);
          
          // Deduct balance
          deductBalance(user.id, 25);

          // Cleanup
          await unlink(inputPath);
          await unlink(outputPath);

          resolve(new NextResponse(outputBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Content-Disposition': `attachment; filename="goh_music_${effect}.mp3"`,
              'X-Balance-Remaining': (user.balance - 25).toString()
            }
          }));
        })
        .on('error', async (err) => {
          console.error('FFmpeg error:', err);
          await unlink(inputPath).catch(() => {});
          resolve(NextResponse.json({ error: 'Processing failed. Ensure ffmpeg is installed on the server.' }, { status: 500 }));
        })
        .save(outputPath);
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

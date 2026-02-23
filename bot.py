import telebot
import requests
import os

# --- CONFIGURATION ---
BOT_TOKEN = "7828284369:AAFfTcvEoobExHgkbVNzRPfOCzwtZdLBBgc"
API_URL = "https://goh-music-api-mu.vercel.app/api/audio/process"

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    welcome_text = (
        "👋 Привет! Я бот GOH MUSIC API.\n\n"
        "Отправь мне MP3 файл, и я применю к нему эффект Slowed + Reverb.\n\n"
        "API теперь полностью открыто и не требует ключей! 🚀"
    )
    bot.reply_to(message, welcome_text)

@bot.message_handler(content_types=['audio'])
def handle_audio(message):
    try:
        status_msg = bot.reply_to(message, "⏳ Обработка аудио... Пожалуйста, подождите.")
        
        # 1. Получаем информацию о файле
        file_info = bot.get_file(message.audio.file_id)
        downloaded_file = bot.download_file(file_info.file_path)
        
        # 2. Отправляем файл на GOH MUSIC API
        files = {'file': ('audio.mp3', downloaded_file, 'audio/mpeg')}
        data = {'effect': 'slowed'} 
        
        response = requests.post(API_URL, files=files, data=data)
        
        if response.status_code == 200:
            # 3. Отправляем результат обратно пользователю
            bot.send_audio(
                message.chat.id, 
                response.content, 
                caption="✅ Готово! Обработано через GOH MUSIC API",
                reply_to_message_id=message.message_id
            )
            bot.delete_message(message.chat.id, status_msg.message_id)
        else:
            # Обработка ошибок API
            try:
                error_data = response.json()
                error_text = error_data.get('error', 'Неизвестная ошибка')
            except:
                error_text = f"Ошибка сервера: {response.status_code}"
                
            bot.edit_message_text(f"❌ Ошибка API: {error_text}", message.chat.id, status_msg.message_id)
            
    except Exception as e:
        bot.reply_to(message, f"❌ Системная ошибка: {str(e)}")

if __name__ == "__main__":
    print(f"Бот запущен... (Token: {BOT_TOKEN[:10]}...)")
    bot.infinity_polling()

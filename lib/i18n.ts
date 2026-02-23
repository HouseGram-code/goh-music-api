export type Language = 'en' | 'ru';

export const translations = {
  en: {
    nav: {
      docs: 'Documentation',
      dashboard: 'Dashboard',
      getStarted: 'Get Started',
    },
    hero: {
      badge: 'v1.0 Now Live',
      title: 'Transform Music',
      subtitle: 'With a Single API call.',
      description: 'GOH MUSIC API provides professional audio processing for developers. Apply Slowed + Reverb, Nightcore, Bass Boost, and more in real-time.',
      ctaPrimary: 'Start Building Now',
      ctaSecondary: 'View Documentation',
    },
    features: {
      fast: {
        title: 'Ultra Fast',
        desc: 'Optimized processing engine delivers results in seconds, not minutes.',
      },
      reliable: {
        title: 'Reliable',
        desc: '99.9% uptime guarantee with robust error handling and scalability.',
      },
      devFriendly: {
        title: 'Dev Friendly',
        desc: 'Simple REST API with comprehensive documentation and SDK examples.',
      },
    },
    effects: {
      title: '5 Professional Effects',
      desc: 'Our API comes pre-loaded with the most popular audio effects used by creators worldwide.',
    },
    dashboard: {
      title: 'GOH MUSIC Playground',
      subtitle: 'Try our professional audio effects instantly.',
      playground: 'API Playground',
      uploadLabel: 'Upload Audio (MP3)',
      uploadHint: 'Click or drag to upload',
      effectLabel: 'Select Effect',
      processBtn: 'Process Audio',
      processing: 'Processing...',
      complete: 'Processing Complete!',
      download: 'Download MP3',
      emptyResult: 'Processed audio will appear here',
    },
    docs: {
      title: 'Documentation',
      subtitle: 'Learn how to integrate GOH MUSIC API into your applications.',
      apiRef: 'API Reference',
      headers: 'Headers',
      bodyParams: 'Body Parameters',
      pythonExample: 'Python Example',
      telegramExample: 'Telegram Bot (pyTelegramBotAPI)',
    },
  },
  ru: {
    nav: {
      docs: 'Документация',
      dashboard: 'Панель',
      getStarted: 'Начать',
    },
    hero: {
      badge: 'v1.0 Уже доступно',
      title: 'Трансформируй музыку',
      subtitle: 'Одним вызовом API.',
      description: 'GOH MUSIC API предоставляет профессиональную обработку аудио для разработчиков. Применяйте Slowed + Reverb, Nightcore, Bass Boost и многое другое в реальном времени.',
      ctaPrimary: 'Начать разработку',
      ctaSecondary: 'Посмотреть документацию',
    },
    features: {
      fast: {
        title: 'Ультра быстро',
        desc: 'Оптимизированный движок обработки выдает результат за секунды, а не минуты.',
      },
      reliable: {
        title: 'Надежно',
        desc: 'Гарантия аптайма 99.9% с надежной обработкой ошибок и масштабируемостью.',
      },
      devFriendly: {
        title: 'Для разработчиков',
        desc: 'Простой REST API с подробной документацией и примерами SDK.',
      },
    },
    effects: {
      title: '5 профессиональных эффектов',
      desc: 'Наш API поставляется с самыми популярными аудиоэффектами, используемыми создателями контента по всему миру.',
    },
    dashboard: {
      title: 'GOH MUSIC Песочница',
      subtitle: 'Попробуйте наши профессиональные аудиоэффекты мгновенно.',
      playground: 'Песочница API',
      uploadLabel: 'Загрузить аудио (MP3)',
      uploadHint: 'Нажмите или перетащите для загрузки',
      effectLabel: 'Выберите эффект',
      processBtn: 'Обработать аудио',
      processing: 'Обработка...',
      complete: 'Обработка завершена!',
      download: 'Скачать MP3',
      emptyResult: 'Обработанное аудио появится здесь',
    },
    docs: {
      title: 'Документация',
      subtitle: 'Узнайте, как интегрировать GOH MUSIC API в ваши приложения.',
      apiRef: 'Справочник API',
      headers: 'Заголовки',
      bodyParams: 'Параметры тела',
      pythonExample: 'Пример на Python',
      telegramExample: 'Telegram бот (pyTelegramBotAPI)',
    },
  },
};

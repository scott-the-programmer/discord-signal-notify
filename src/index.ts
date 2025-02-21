import 'dotenv/config';
import { Bot } from './bot';

async function bootstrap() {
  try {
    const bot = new Bot();
    await bot.start();

  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();

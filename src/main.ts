import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(morgan('dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  try {
    process.env.DEV === 'DEVELOPMENT'
      ? app.use(morgan('dev'))
      : app.use(morgan('common'));

    await app.listen(process.env.PORT as string);
    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

bootstrap();
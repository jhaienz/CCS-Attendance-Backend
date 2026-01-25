import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Attendance Management System API ')
    .setVersion('1.0')
    .addTag('Attendance')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  try {
    process.env.DEV === 'DEVELOPMENT'
      ? app.use(morgan('dev'))
      : app.use(morgan('common'));

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

bootstrap();

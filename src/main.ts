import { ValidationPipe } from '@nestjs/common';
import '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .setTitle('my budget app')
    .setDescription('The my budget app API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('users')
    .addTag('auth')
    .addTag('transactions')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('documentation', app, document);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // удаляет все поля которые не описаны в DTO
    forbidNonWhitelisted: true, // если пришли лишние поля - выкидывает ошибку
    transform: true, // преобразует типы в DTO (например строку в число)
  }))
  app.setGlobalPrefix('api')
  app.enableShutdownHooks() // ловим резкие отключения безопасно
  app.enableCors()
  app.useGlobalFilters(new AllExceptionFilter())

  await app.listen(process.env.PORT ?? 4200);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './app/core/interceptors/response.interceptor';
import { ErrorFilter } from './app/core/filters/error.filter';
import { BASE_URL, NODE_ENV, PORT } from './app/core/constants/env.constants';
import { NodeEnvironment } from './app/shared/enums/NodeEnvironment.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(new ErrorFilter());

  app.enableCors({
    origin: 'http://localhost:5000',
  });

  app.use(helmet());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('HIRE')
    .setDescription('server for HIRE platform')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocs = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocs);

  await app.listen(PORT);

  Logger.log(`NODE_ENV = ${NODE_ENV}`);
  // Logger.log(DateTime.local().toFormat('yyyy-MM-dd HH:mm:ss.SSSZZ'));
  Logger.log(
    NODE_ENV === NodeEnvironment.DEV &&
      `Server is listening on ${BASE_URL}:${PORT}`
  );
  Logger.log(
    NODE_ENV === NodeEnvironment.DEV &&
      `Check the API docs on ${BASE_URL}:${PORT}/api`
  );
}
bootstrap().catch((e) => Logger.error(e));

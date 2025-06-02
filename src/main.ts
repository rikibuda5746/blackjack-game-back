import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LogService } from '@src/core/logger/log-service';
import process from 'node:process';
import cookieParser from 'cookie-parser';

const GLOBAL_PATH = 'api';

function setGlobalPipes(app) {
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      transform: true,
    }),
  );
}

function swaggerSetup(app) {
  const options = new DocumentBuilder()
    .setTitle('NestJS Starter')
    .setDescription('API documentation for NestJS Starter')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Authorization',
    )
    .addSecurityRequirements('Authorization')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(GLOBAL_PATH, app, document);
}

function enableCors(app) {
  if (!process.env.CORS_WHITELIST) {
    return;
  }

  const whitelist = process.env.CORS_WHITELIST.split(',');
  const options = {
    origin: whitelist,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.enableCors(options);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
    cors: true,
  });
  app.use(cookieParser());

  const logger = await app.resolve(LogService);

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection:', {
      reason: reason,
      promise: promise,
    });

    throw reason;
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    process.exit(1);
  });

  app.setGlobalPrefix(GLOBAL_PATH);

  setGlobalPipes(app);
  swaggerSetup(app);
  enableCors(app);

  const port = process.env.PORT || 4200;
  await app.listen(port);

  logger.log(
    `Start service ${process.env.APP_NAME}, PORT: ${port}, ENV: ${process.env.NODE_ENV}`,
  );
}

bootstrap();

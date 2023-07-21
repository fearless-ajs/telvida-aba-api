import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { CustomExceptionFilter } from "@libs/filters/custom-exception.filter";
import { RmqOptions } from "@nestjs/microservices";
import { RmqService } from "@libs/rmq/rmq.service";
import { CustomValidationPipe } from "@libs/pipes/custom-validation.pipe";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Importing the App config Data located in the .env File using the configService Class
  const configService = app.get(ConfigService);

  // Custom exceptions filter
  app.useGlobalFilters(new CustomExceptionFilter());

  // Cross-origin resource sharing configuration.
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });

  // Global route prefix, v1 is the version number
  app.setGlobalPrefix('api/v1');

  // RabbitMQ Initializer and configuration
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions(configService.get('RABBIT_MQ_ABA_QUEUE'), true));

  // Attaching the validation piper at the global level
  app.useGlobalPipes(new CustomValidationPipe());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/doc', app, document);

  // Starting the app as a microservice and API backend server
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();

import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app/module";
import helmet from 'helmet';
import * as compression from 'compression';
import * as expressHandlebars from 'express-handlebars';
import * as express from 'express';
import rateLimit from 'express-rate-limit';
import { join } from "path";
import { AllExceptionsFilter } from "./app/common/filters/http-exeception.filter";

class InitApplication {
  private readonly logger = new Logger(InitApplication.name);
  private app: NestExpressApplication;

  private async init() {
    try {
      this.app = await NestFactory.create<NestExpressApplication>(AppModule);
      this.configure_middleware();
      this.configure_views();
      this.configure_assets();
      this.handle_filters();
      this.handle_shutdown_hooks();
    } catch (error) {
      this.logger.error(`Error during initialization: ${error.message}`);
      process.exit(1);
    }
  }

  private configure_middleware() {
    // helmet
    this.app.use(helmet())
    // compression
    this.app.use(compression());
    // rate limiting
    this.app.use(rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 100 requests per windowMs
      message: "Too many requests, please try again later.",
    }));
    // core
    this.app.enableCors({
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: "Content-Type,Authorization",
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
    // validate pipe
    this.app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }))
    // logging
    this.logger.log("Middleware configured: CORS, Security Headers, Compression, Rate Limiting");
  }

  private configure_views() {
    this.app.setBaseViewsDir(join(__dirname, '..', 'src'));
    const hbs = expressHandlebars.create({
      extname: '.html',
      layoutsDir: join(__dirname, '..', 'src'),
      defaultLayout: null
    });
    this.app.engine('html', hbs.engine);
    this.app.setViewEngine('html');
    // Configure template engines or view-related settings if needed
    this.logger.log("View engine configured");
  }

  private configure_assets() {
    // Serve static assets from the "public" directory
    const public_path = join(__dirname, '..', 'public');
    this.app.use('/public', express.static(public_path));
    // Serve static files or configure assets
    this.logger.log("Static assets configured");
  }

  private async handle_filters() {
    this.app.useGlobalFilters(new AllExceptionsFilter());
  }

  private handle_shutdown_hooks() {
    process.on("SIGINT", async () => {
      await this.app.close();
      this.logger.warn("Application gracefully shutting down (SIGINT)");
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await this.app.close();
      this.logger.warn("Application gracefully shutting down (SIGTERM)");
      process.exit(0);
    });
  }

  public async run(port: number) {
    try {
      await this.init();
      await this.app.listen(port);
      this.logger.log(`\x1b[32mNest application running on: \x1b[34mhttp://localhost:${port}\x1b[37m`);
    } catch (error) {
      this.logger.error(`\x1b[31mError starting the server: ${error.message}\x1b[0m`);
      process.exit(1);
    }
  }
}

const initApplication = new InitApplication();
initApplication.run(Number(process.env.PORT) || 4400);

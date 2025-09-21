import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import compression from 'compression';
const passport = require('passport');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isProd = process.env.NODE_ENV === 'production';

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Behind a proxy/load balancer (e.g., AWS App Runner), trust the first proxy
  // so secure cookies and protocol are handled correctly
  const expressApp = app.getHttpAdapter().getInstance();
  if (expressApp?.set) {
    expressApp.set('trust proxy', 1);
  }

  // Session configuration
  app.use(
    session({
      name: "connect.sid",
      secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/apnacollegedemo',
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
        // Optionally set a cookie domain if you use a custom domain. For default service domains, omit it.
        // domain: process.env.COOKIE_DOMAIN,
        secure: isProd, // required for cross-site cookies
        sameSite: isProd ? 'none' : 'lax', // allow cross-site cookie on production
      },
    }),
  );

  // Initialize passport and enable persistent login sessions
  app.use(passport.initialize());
  app.use(passport.session());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
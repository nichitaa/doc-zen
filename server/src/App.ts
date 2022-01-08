import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import { routes } from './routes/routes';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import { isLocalEnv } from './utils';
import { errorHandlerMiddleware } from './features/error-handler/error-handler.middleware';

config();

export class App {
  private readonly app: express.Express;
  private readonly checkJWT: express.RequestHandler;

  public constructor() {
    this.app = express();
    this.checkJWT = jwt({
      secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      }),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ['RS256'],
    }).unless({
      path: ['/shared', '/auth-csrf'],
    });
    this.bootstrap();
  }

  public connectToDB = async () => {
    try {
      const mongoURL = process.env.MONGODB_URL as string;
      await connect(mongoURL);
      console.log(`Successfully connected to mongodb: ${mongoURL}`);
    } catch (e) {
      throw new Error(`Could not connect to mongodb, error: ${e.message}`);
    }
  };

  public listen = () => {
    const PORT = Number(process.env.PORT) || 8080;
    this.app.listen(PORT, () =>
      console.log(`doc-zen API running on PORT: ${PORT}`)
    );
  };

  private bootstrap = async () => {
    this.initAppMiddlewares();
    this.initAppRoutes();
  };

  private initAppMiddlewares = () => {
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
      })
    );
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    /**  Disabling CSRF and JWT on local postman testing */
    if (!isLocalEnv())
      this.app.use(
        csurf({
          cookie: {
            sameSite: 'none',
            secure: true,
          },
          value: (req: Request) => req.headers['x-csrf-token'] as string,
        })
      );
    if (!isLocalEnv()) this.app.use(this.checkJWT);
  };

  private initAppRoutes = () => {
    routes.forEach((route) => this.app.use(route.Router));
    /** Endpoint to get the CSRF Token */
    this.app.get('/auth-csrf', (req: Request, res: Response) => {
      const csrfToken = req.csrfToken();
      console.log(`csrf ${csrfToken}`);
      return res.json({ csrfToken });
    });
    /** Error Handler Middleware */
    this.app.use(errorHandlerMiddleware);
  };
}

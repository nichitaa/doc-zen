import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import { routes } from './routes/routes';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';
import { isLocalEnv } from './utils';

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
      path: ['/shared'],
    });
    this.bootstrap();
  }

  private bootstrap = async () => {
    this.initAppMiddlewares();
    this.initAppRoutes();
  };

  public connectToDB = async () => {
    try {
      const mongoURL = process.env.MONGODB_URL as string;
      await connect(mongoURL);
      console.log(`Successfully connected to mongodb: ${mongoURL}`);
    } catch (e) {
      throw new Error(`Could not connect to mongodb, error: ${e.message}`);
    }
  };

  private initAppMiddlewares = () => {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // keep logic with userId only for client app
    if (!isLocalEnv()) this.app.use(this.checkJWT);
  };

  private initAppRoutes = () => {
    routes.forEach((route) => this.app.use(route.Router));
  };

  public listen = () => {
    const PORT = Number(process.env.PORT) || 8080;
    this.app.listen(PORT, () =>
      console.log(`doc-zen API running on PORT: ${PORT}`)
    );
  };
}

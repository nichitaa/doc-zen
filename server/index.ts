import { App } from './src/App';

class APIServer {
  public static run = async () => {
    const app = new App();
    await app.connectToDB();
    app.listen();
  };
}

APIServer.run();

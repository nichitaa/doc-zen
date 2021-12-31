import express, {Router} from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import { config } from "dotenv";
import rateLimit from "express-rate-limit";

config();

const PORT = process.env.PORT || 8000;
const TARGET = process.env.PROXY_TARGET || "http://localhost:8080";

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "To many request (100 request per 1 minute)",
});

app.use(limiter);

app.use(Router().get('/test', (_, res) => {
  res.status(200).send('doc-zen proxy is OK')
}))

app.use(
  "/",
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
  })
);

app.listen(PORT, () =>
  console.log(`doc-zen proxy is running on port: ${PORT}`)
);

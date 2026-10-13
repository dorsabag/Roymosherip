import express, { type Express, type ErrorRequestHandler } from "express";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(express.json({limit:"16kb"}));

app.use("/api", router);
const handleError: ErrorRequestHandler = (err, req, res, _next) => {
  req.log.error({name:err?.name, code:err?.code}, "Request failed");
  const status = err?.type === "entity.too.large" ? 413 : err instanceof SyntaxError ? 400 : 503;
  res.status(status).json({error:status === 503 ? "השירות אינו זמין כרגע. נסו שוב בעוד רגע." : "בקשה לא תקינה"});
};
app.use(handleError);

export default app;

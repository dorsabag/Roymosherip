import express, { type Express, type ErrorRequestHandler } from "express";
import path from "node:path";
import { accessSync, constants } from "node:fs";
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
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "העמוד לא נמצא" });
});

// A single production origin serves both the API and the built memorial SPA.
// Replit's existing split-service routing remains usable when STATIC_DIR is unset.
if (process.env.STATIC_DIR) {
  const staticDir = path.resolve(process.env.STATIC_DIR);
  const indexFile = path.join(staticDir, "index.html");
  accessSync(indexFile, constants.R_OK);
  app.use(express.static(staticDir, { index: false }));
  app.get(/.*/, (req, res, next) => {
    if (path.extname(req.path)) { next(); return; }
    res.set("Cache-Control", "no-cache");
    res.sendFile(indexFile);
  });
}
const handleError: ErrorRequestHandler = (err, req, res, _next) => {
  req.log.error({name:err?.name, code:err?.code}, "Request failed");
  const status = err?.type === "entity.too.large" ? 413 : err instanceof SyntaxError ? 400 : 503;
  res.status(status).json({error:status === 503 ? "השירות אינו זמין כרגע. נסו שוב בעוד רגע." : "בקשה לא תקינה"});
};
app.use(handleError);

export default app;

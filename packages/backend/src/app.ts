import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import multer from 'multer';
import Tokens from 'csrf';



function debug(log: any): void {
  if (process.env.DEBUG) {
    console.log(log);
  }
}


dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const home = process.env.HOMEPAGE;
const basePath = `${home}/api`;
const gitlabDomain = process.env.GITLAB_DOMAIN;
const appID = process.env.GITLAB_APP_ID;
const projectsNb = process.env.PROJECTS_NB || 10;

if (!gitlabDomain || !appID) {
  throw new Error("Cannot start the server because the gitlab domain and/or gitlab app id are not defined")
}

const tokens = new Tokens();
const secret = tokens.secretSync();

debug(process.env);

app.use(morgan('combined'));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
})

app.get(`${basePath}/config`, (req: Request, res: Response) => {
  res.status(200).json({
    gitlabDomain,
    appID,
    projectsNb
  });
});

app.get(`${basePath}/token`, (req: Request, res: Response) => {
  res.status(200).json({
    token: tokens.create(secret),
  });
});

app.post(
  `${basePath}/token`,
  multer().none(),
  (req: Request, res: Response) => {
    const body = req.body;
    if (tokens.verify(secret, body.token)) {
      res.sendStatus(200);
    } else {
      res.sendStatus(403);
    }
  },
);


function serveIndex(res: Response): void {
  debug(`Sending index.html`);
  res.sendFile('public/index.html', { root: process.cwd() });
}


app.get(home || '/', (req: Request, res: Response) => {
  serveIndex(res);
});

app.get(`${home}/oauth/redirect`, (req: Request, res: Response) => {
  serveIndex(res);
})

app.get(`${home}/dashboard`, (req: Request, res: Response) => {
  serveIndex(res);
})

app.use(`${home}/public`, express.static(`public`));


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.log(`⚡️[server]: Serving files from folder public`);
});

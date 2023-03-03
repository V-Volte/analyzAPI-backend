import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { readdirSync } from "fs";
import { resolve, extname } from "path";
import { config } from "dotenv";
config({ path: resolve(__dirname, "../config.env") });
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

let dirData = readdirSync(resolve(__dirname, "../Router"));
dirData.forEach(async (dir) => {
    let routeName = dir.replace(extname(dir), "");

    app.use(
        `/api/v1/${routeName}`,
        (await import(resolve(__dirname, "../Router", dir))).default
    );
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    res.send("Error: invalid JSON object sent.");
});

export default app;

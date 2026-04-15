

import express from 'express';
import type {Express} from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import healthCheckRoute from "./modules/healthcheck/routes";
import authRoute from "./modules/auth/routes";
import seatsRoute from "./modules/seats/routes";
import { errorHandler } from './common/middleware/error-handler';


export function createApplication(): Express {
    const app = express();

    // common application middlewares
    app.use(
        cors({
            "origin": process.env.CORS_ORIGIN,
            credentials: true
        })
    );

    app.use(express.json({limit: "16kb"}));
    app.use(express.urlencoded({ extended: true, limit: "16kb"}));
    app.use(express.static("public"));
    app.use(cookieParser())

    // middlewares
    

    // healthcheck routes
    app.use("/api/v1/healthcheck", healthCheckRoute);

    // auth routes
    app.use("/api/v1/auth", authRoute);

    // seat book routes
    app.use("/api/v1/seats", seatsRoute);

    // error handler middleware
    app.use(errorHandler);

    return app;
}
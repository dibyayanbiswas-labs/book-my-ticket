
import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error";

export function errorHandler (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if(err instanceof ApiError) {
        res.status(err.statusCode).json({
            error: err.message,
            details: err.details
        })
        return;
    }

    console.error(err);
    res.status(500).json({error: "Internal server error"});
}
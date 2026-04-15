import type { Request, Response, NextFunction } from "express"
import ApiError from "../../common/utils/api-error";
import { verifyAccessToken } from "../../common/utils/jwt";
import prisma from "../../common/config/prisma";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number,
                email: string
            }
        }
    }
}

const authenticate = async(req: Request, res: Response, next: NextFunction) => {
    try {
        let token;

        if(req.headers.authorization?.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }

        if(!token) {
            throw ApiError.unauthorized("Access token missing")
        }

        const decoded = verifyAccessToken(token) as {userId: number; email: string};
        req.user = decoded;
        next();

    } catch (error) {
        throw ApiError.unauthorized('Invalid or expired access token', error);
    }
}

export {
    authenticate
}
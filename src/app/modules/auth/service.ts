import bcrypt from "bcryptjs";
import prisma from "../../common/config/prisma"
import ApiError from "../../common/utils/api-error";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../common/utils/jwt";
import crypto, { createHmac, randomBytes } from 'crypto';

class AuthService {

    //helper methods
    private hashPassword = (salt: string, password: string) => createHmac('sha256', salt).update(password).digest("hex");

    private hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

    private generateTokens = async (userId: number, email: string) => {
        const accessToken = generateAccessToken(userId, email);
        const refreshToken = generateRefreshToken(userId);

        await prisma.user.update({
            where: {id: userId},
            data: {refreshToken: this.hashToken(refreshToken)}
        })

        return {accessToken, refreshToken};
    }

    // route methods
    public register = async (username: string, email: string, password: string) => {
        const existing = await prisma.user.findFirst({
            where: {
                OR: [
                    {email},
                    {username}
                ]
            }
        });

        if(existing) {
            throw ApiError.conflict("User already exists");
        }

        const salt = randomBytes(32).toString("hex");
        const hash = this.hashPassword(salt, password);
        const user = await prisma.user.create({
            data: {username, email, password: hash, salt},
            select: {id: true, username: true, email: true, createdAt: true}
        });

        const tokens = await this.generateTokens(user.id, user.email);

        return {user, ...tokens}
    }

    public login = async (identifier: string, password: string) => {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: identifier},
                    {username: identifier}
                ]
            }
        });
        
        if(!user) {
            throw ApiError.unauthorized("Invalid credentials");
        }

        const salt = user.salt!;
        const hash = this.hashPassword(salt, password);

        if(user.password !== hash) {
            throw ApiError.unauthorized("Invalid credentials")
        }

       const tokens = await this.generateTokens(user.id, user.email);
       return {
        user: {id: user.id, username: user.username, email: user.email},
        ...tokens
       }
    }

    public profile = async (userId: number) => {
        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {id: true, username: true, email: true, createdAt: true}
        });

        if(!user) throw ApiError.notFound("User not found");
        return user;
    }

    public refresh = async (token: string) => {
          
        const decoded = verifyRefreshToken(token) as {userId: number};
        const user = await prisma.user.findUnique({
            where: {id: decoded.userId}
        });

        if(!user) throw ApiError.unauthorized("User not found");

        if(user.refreshToken !== this.hashToken(token)) {
            throw ApiError.unauthorized("Invalid refresh token")
        };

        const tokens = await this.generateTokens(user.id, user.email);
        return tokens;
    }

    public logout = async (userId: number) => {
        await prisma.user.update({
            where: {id: userId},
            data: {refreshToken: null}
        })
    }
}

export default new AuthService();
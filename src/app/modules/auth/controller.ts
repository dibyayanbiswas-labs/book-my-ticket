import type { Request, Response } from "express";
import { loginModel, registerModel } from "./models";
import ApiError from "../../common/utils/api-error";
import authService from "./service";
import ApiResponse from "../../common/utils/api-response";

class AuthController {
    public handleRegister = async (req: Request, res: Response) => {
        const validateRegister = await  registerModel.safeParseAsync(req.body);
        if(validateRegister.error) {
            throw ApiError.badRequest("Invalid credentials", validateRegister.error.issues);
        }

        const {username, email, password} = validateRegister.data;
        const {user, accessToken, refreshToken} = await authService.register(username, email, password);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: true
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: true
        });

        return ApiResponse.created(res, "Registration successful", {user, accessToken, refreshToken});
    }

    public handleLogin = async (req: Request, res: Response) => {
        const validateLogin = await loginModel.safeParseAsync(req.body);
        if(validateLogin.error) {
            throw ApiError.badRequest("Invalid credentials", validateLogin.error.issues);
        }

        const {identifier, password} = validateLogin.data;
        const {user, accessToken, refreshToken} = await authService.login(identifier, password);

         res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: true
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: true
        });

        return ApiResponse.ok(res, "Login successful", {user, accessToken, refreshToken})
    }

    public handleProfile = async(req: Request, res: Response) => {
        const result = await authService.profile(req.user!.userId);
        ApiResponse.ok(res, "Profile fetched", result);
    }

    public handleRefresh = async(req: Request, res: Response) => {
        const {refreshToken} = req.body;

         if (!refreshToken) throw ApiError.badRequest('Refresh token missing');

         const tokens = await authService.refresh(refreshToken);
        return ApiResponse.ok(res, 'Token refreshed', tokens);
    }

    public handleLogout = async(req: Request, res:Response) => {
        await authService.logout(req.user!.userId);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        ApiResponse.ok(res, "Logout successful")
    }
}

export default new AuthController();
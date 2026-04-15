import { Router } from "express";
import authController from "./controller";
import { asyncHandler } from "../../common/utils/async-handler";
import { authenticate } from "./middleware";

const router = Router();

router.post("/register", asyncHandler(authController.handleRegister));
router.post("/login", asyncHandler(authController.handleLogin));
router.post('/refresh', asyncHandler(authController.handleRefresh));
router.get("/profile", authenticate, authController.handleProfile);
router.post("/logout", authenticate, authController.handleLogout);

export default router;
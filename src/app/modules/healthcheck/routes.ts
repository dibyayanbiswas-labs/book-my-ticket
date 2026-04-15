import { Router } from "express";
import healthCheckController from "./controller";
import { asyncHandler } from "../../common/utils/async-handler";

const router = Router();

router.get("/", asyncHandler(healthCheckController.healthCheckTest));
router.get("/test", asyncHandler(healthCheckController.healthCheckTest));

export default router;
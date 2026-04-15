import ApiResponse from "../../common/utils/api-response";
import type {Request, Response} from 'express';

class HealthCheckController {
    public healthCheckTest = async (req: Request, res: Response) => {
        return ApiResponse.ok(res, "Health check passed!");
    }
}

export default new HealthCheckController();

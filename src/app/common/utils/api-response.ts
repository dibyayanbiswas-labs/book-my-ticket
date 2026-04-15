import type {Response} from 'express';

class ApiResponse {

    public static ok(res: Response, message="OK", data: unknown = null) {
        return res.status(200).json({
            success: true,
            message,
            data
        })
    }

    public static created(res: Response, message="CREATED", data:unknown = null) {
        return res.status(201).json({
            success: true,
            message,
            data
        })
    }

    static noContent(res: Response) {
        return res.status(204).send();
    }
}

export default ApiResponse;
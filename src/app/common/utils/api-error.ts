class ApiError extends Error {
    statusCode: number;
    details: unknown;
    constructor(statusCode: number, message: string, details?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }

    public static badRequest(message="BAD REQUEST", details?: unknown) {
        return new ApiError(400, message, details);
    }

    public static unauthorized(message="UNAUTHORIZED", details?: unknown) {
        return new ApiError(401, message, details);
    }
    
    public static conflict(message="CONFLICT", details?: unknown) {
        return new ApiError(409, message, details);
    }
    
    public static forbidden(message="FORBIDDEN", details?: unknown) {
        return new ApiError(412, message, details);
    }
    
    public static notFound(message="NOT FOUND", details?: unknown) {
        return new ApiError(404, message, details);
    }

}

export default ApiError;
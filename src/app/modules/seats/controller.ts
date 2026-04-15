import type { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import ApiError from "../../common/utils/api-error";
import seatService from "./service";
import ApiResponse from "../../common/utils/api-response";

class SeatController {
    
  public getAllSeats = asyncHandler(async (req: Request, res: Response) => {

    const seats = await seatService.getAllSeats();
    ApiResponse.ok(res, "Seats fetched successfully", seats);
  });

  public bookSeat = asyncHandler(async (req: Request, res: Response) => {

    const seatId = parseInt(req.params.seatId as string);

    if (isNaN(seatId)) {
        throw ApiError.badRequest("seatId must be a number");
    }

    const userId = req.user!.userId;

    const booking = await seatService.bookSeat(seatId, userId);
    ApiResponse.ok(res, "Seat booked successfully", booking);
  });

  public getMyBookings = asyncHandler(async (req: Request, res: Response) => {

    const userId = req.user!.userId;
    const bookings = await seatService.getMyBookings(userId);
    ApiResponse.ok(res, "Bookings fetched successfully", bookings);
  });
}

export default new SeatController();
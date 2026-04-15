import { Router } from "express";
import seatController from "./controller";
import { authenticate } from "../auth/middleware";

const router = Router();

// public — mirrors original GET /seats
router.get("/", seatController.getAllSeats);

// protected — only logged in users can book
router.post("/book/:seatId", authenticate, seatController.bookSeat);

// protected — get my bookings
router.get("/my-bookings", authenticate, seatController.getMyBookings);

export default router;
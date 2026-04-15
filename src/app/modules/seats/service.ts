import { Prisma } from "@prisma/client";
import prisma from "../../common/config/prisma"
import ApiError from "../../common/utils/api-error";

class SeatService {
    public getAllSeats = async () => {
        return await prisma.seat.findMany({
            orderBy: {id: 'asc'},
        });
    };

    public bookSeat = async (seatId: number, userId: number) => {
        return await prisma.$transaction(
            async (tx) => {
                // SELECT * FROM seats WHERE id = $1 AND isbooked = 0 FOR UPDATE
                const seat = await tx.seat.findFirst({
                    where: { id: seatId, isBooked: 0},
                });

                // if (result.rowCount === 0)
                if(!seat) {
                    throw ApiError.conflict("Seat is already booked");
                }

                const user = await tx.user.findUnique({ where: {id: userId}})

                // UPDATE seats SET isbooked = 1, name = $2 WHERE id = $1
                await tx.seat.update({
                    where: {id: seatId},
                    data: {isBooked: 1, username: user!.username},
                });

                // associate booking with user
                const booking = await tx.booking.create({
                    data: {userId, seatId}
                });

                return booking;
            },
            {
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable
            }
        );
    }

    public getMyBookings = async (userId: number) => {
        return await prisma.booking.findMany({
            where: {userId},
            include: {seat: true},
            orderBy: {bookedAt: 'desc'}
        })
    }
}

export default new SeatService();
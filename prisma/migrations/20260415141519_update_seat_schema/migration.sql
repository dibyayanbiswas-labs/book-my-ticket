/*
  Warnings:

  - You are about to drop the column `username` on the `seat` table. All the data in the column will be lost.
  - The `isBooked` column on the `seat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[number]` on the table `seat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `seat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "seat" DROP COLUMN "username",
ADD COLUMN     "number" INTEGER NOT NULL,
DROP COLUMN "isBooked",
ADD COLUMN     "isBooked" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "seat_number_key" ON "seat"("number");

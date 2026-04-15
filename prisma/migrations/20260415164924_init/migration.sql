/*
  Warnings:

  - You are about to drop the column `number` on the `seat` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "seat_number_key";

-- AlterTable
ALTER TABLE "seat" DROP COLUMN "number",
ADD COLUMN     "username" TEXT;

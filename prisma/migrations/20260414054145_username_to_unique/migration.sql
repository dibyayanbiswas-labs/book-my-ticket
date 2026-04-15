/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" RENAME CONSTRAINT "users_pkey" TO "user_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- RenameIndex
ALTER INDEX "users_email_key" RENAME TO "user_email_key";

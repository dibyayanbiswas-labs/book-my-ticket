/*
  Warnings:

  - You are about to drop the column `name` on the `seat` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/

ALTER TABLE "public"."users" RENAME COLUMN "name" TO "username";
ALTER TABLE "public"."seat" RENAME COLUMN "name" TO "username";
ALTER TABLE "public"."users" RENAME TO "user";

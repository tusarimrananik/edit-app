/*
  Warnings:

  - You are about to drop the column `edit` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "edit",
ADD COLUMN     "edits" INTEGER NOT NULL DEFAULT 0;

/*
  Warnings:

  - You are about to drop the `UserScore` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserScore" DROP CONSTRAINT "UserScore_challId_fkey";

-- DropForeignKey
ALTER TABLE "UserScore" DROP CONSTRAINT "UserScore_userId_fkey";

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "top" JSONB;

-- DropTable
DROP TABLE "UserScore";

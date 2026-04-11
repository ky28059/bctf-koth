/*
  Warnings:

  - Added the required column `status` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('QUEUED', 'TESTING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Submission"
ADD COLUMN "score" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN "status" "Status" NOT NULL DEFAULT 'COMPLETED';

ALTER TABLE "Submission"
ALTER COLUMN "status" DROP DEFAULT;

-- CreateEnum
CREATE TYPE "EventFormat" AS ENUM ('IN_PERSON', 'ONLINE');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "format" "EventFormat" NOT NULL DEFAULT 'IN_PERSON';

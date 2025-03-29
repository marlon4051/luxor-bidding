/*
  Warnings:

  - The primary key for the `Bid` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Collection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userId` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Collection` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_userId_fkey";

-- AlterTable
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "collectionId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Bid_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Bid_id_seq";

-- AlterTable
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_pkey",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET NOT NULL,
ADD CONSTRAINT "Collection_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Collection_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

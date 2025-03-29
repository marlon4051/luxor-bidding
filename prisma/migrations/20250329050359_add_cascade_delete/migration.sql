-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_collectionId_fkey";

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

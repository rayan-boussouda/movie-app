-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_movieId_fkey";

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

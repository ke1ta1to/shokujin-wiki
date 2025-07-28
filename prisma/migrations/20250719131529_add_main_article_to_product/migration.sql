/*
  Warnings:

  - A unique constraint covering the columns `[mainArticleId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "mainArticleId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Product_mainArticleId_key" ON "Product"("mainArticleId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_mainArticleId_fkey" FOREIGN KEY ("mainArticleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

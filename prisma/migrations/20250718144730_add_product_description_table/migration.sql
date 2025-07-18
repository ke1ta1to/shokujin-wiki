-- CreateTable
CREATE TABLE "ProductDescription" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "lastEditedUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductDescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductDescription_productId_key" ON "ProductDescription"("productId");

-- AddForeignKey
ALTER TABLE "ProductDescription" ADD CONSTRAINT "ProductDescription_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDescription" ADD CONSTRAINT "ProductDescription_lastEditedUserId_fkey" FOREIGN KEY ("lastEditedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

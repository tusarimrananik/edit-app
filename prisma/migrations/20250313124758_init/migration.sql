-- CreateTable
CREATE TABLE "Browsers" (
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Browsers_name_key" ON "Browsers"("name");

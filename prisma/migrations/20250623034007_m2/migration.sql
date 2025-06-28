-- CreateTable
CREATE TABLE "MultipleStep" (
    "id" SERIAL NOT NULL,
    "step" TEXT,
    "payment" TEXT,
    "profile_pic" TEXT,
    "profile_name" TEXT,

    CONSTRAINT "MultipleStep_pkey" PRIMARY KEY ("id")
);

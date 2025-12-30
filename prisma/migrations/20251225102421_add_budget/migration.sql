-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "budgetName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "spendinglimit" DOUBLE PRECISION NOT NULL,
    "frequency" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

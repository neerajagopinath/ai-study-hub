-- CreateTable
CREATE TABLE "StudyKit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "keyTopics" JSONB NOT NULL,
    "flashcards" JSONB NOT NULL,
    "definitions" JSONB NOT NULL,
    "subject" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyKit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyKit_userId_documentId_key" ON "StudyKit"("userId", "documentId");

-- AddForeignKey
ALTER TABLE "StudyKit" ADD CONSTRAINT "StudyKit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyKit" ADD CONSTRAINT "StudyKit_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

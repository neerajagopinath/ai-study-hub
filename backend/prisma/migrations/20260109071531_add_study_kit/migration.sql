-- CreateTable
CREATE TABLE "SpeakerNotes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "notes" JSONB NOT NULL,
    "vivaQs" JSONB NOT NULL,
    "tips" JSONB NOT NULL,
    "mode" TEXT,
    "style" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpeakerNotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpeakerNotes_userId_documentId_key" ON "SpeakerNotes"("userId", "documentId");

-- AddForeignKey
ALTER TABLE "SpeakerNotes" ADD CONSTRAINT "SpeakerNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeakerNotes" ADD CONSTRAINT "SpeakerNotes_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

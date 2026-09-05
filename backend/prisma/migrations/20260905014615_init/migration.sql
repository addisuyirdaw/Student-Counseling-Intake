-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "yearInSchool" TEXT NOT NULL,
    "gpa" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CounselingRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "counselingTopic" TEXT NOT NULL,
    "topicCustom" TEXT,
    "concernDescription" TEXT NOT NULL,
    "hadPreviousCounseling" BOOLEAN NOT NULL,
    "previousCounselingDetails" TEXT,
    "preferredDays" TEXT NOT NULL,
    "preferredTimeSlots" TEXT NOT NULL,
    "additionalComments" TEXT,
    "consentGiven" BOOLEAN NOT NULL,
    "signatureDataUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CounselingRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentId_key" ON "Student"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE INDEX "CounselingRequest_studentId_idx" ON "CounselingRequest"("studentId");

-- CreateIndex
CREATE INDEX "CounselingRequest_status_idx" ON "CounselingRequest"("status");

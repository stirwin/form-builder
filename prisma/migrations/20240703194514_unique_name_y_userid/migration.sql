/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Form` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `FormSubmissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FormSubmissions" ADD COLUMN     "content" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Form_name_userId_key" ON "Form"("name", "userId");

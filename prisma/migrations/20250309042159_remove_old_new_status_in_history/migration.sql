/*
  Warnings:

  - You are about to drop the column `newStatus` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `oldStatus` on the `History` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_History" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskId" INTEGER NOT NULL,
    "modifiedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" INTEGER NOT NULL,
    CONSTRAINT "History_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_History" ("id", "modifiedAt", "modifiedBy", "taskId") SELECT "id", "modifiedAt", "modifiedBy", "taskId" FROM "History";
DROP TABLE "History";
ALTER TABLE "new_History" RENAME TO "History";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

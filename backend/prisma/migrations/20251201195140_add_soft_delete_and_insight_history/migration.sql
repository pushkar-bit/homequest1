-- AlterTable
ALTER TABLE `Property` ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `deletedBy` INTEGER NULL;

-- CreateTable
CREATE TABLE `InsightHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `insightType` VARCHAR(191) NOT NULL,
    `insightId` INTEGER NOT NULL,
    `fieldName` VARCHAR(191) NOT NULL,
    `oldValue` TEXT NOT NULL,
    `newValue` TEXT NOT NULL,
    `changedBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InsightHistory` ADD CONSTRAINT `InsightHistory_changedBy_fkey` FOREIGN KEY (`changedBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

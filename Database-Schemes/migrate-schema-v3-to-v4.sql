-- Updated writeups to use ids
ALTER TABLE `writeup_submissions` ADD `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;
-- ALTER TABLE `writeup_submissions` DROP COLUMN `key`;
ALTER TABLE `writeup_submissions` ADD `time_created` DATETIME NOT NULL;
ALTER TABLE `writeup_submissions` ADD `time_updated` DATETIME NOT NULL;
ALTER TABLE `file_uploads` ADD `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;
-- ALTER TABLE `file_uploads` DROP COLUMN `key`;
ALTER TABLE `file_uploads` ADD `time_created` DATETIME NOT NULL;
ALTER TABLE `file_uploads` ADD `name` varchar(255) NOT NULL DEFAULT '';


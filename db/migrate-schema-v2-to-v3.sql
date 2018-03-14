CREATE TABLE `writeup_submissions` (
	`account_id` INT NOT NULL,
	`key` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `file_uploads` (
	`account_id` INT NOT NULL,
	`key` varchar(255) NOT NULL
);

CREATE TABLE `tiles` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` varchar(127) NOT NULL,
	`description` varchar(255) NOT NULL,
	`link` varchar(255) NOT NULL,
	`deleted` BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (`id`)
);

CREATE TABLE `tile_clicks` (
	`tile_id` INT NOT NULL,
	`user_id` INT NOT NULL
);


ALTER TABLE `writeup_submissions` ADD CONSTRAINT `writeup_submissions_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`); 

ALTER TABLE `file_uploads` ADD CONSTRAINT `file_uploads_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`); 
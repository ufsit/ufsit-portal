CREATE TABLE `account` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`full_name` varchar(100) NOT NULL,
	`email` varchar(254) NOT NULL,
	`ufl_email` varchar(254) NOT NULL,
	`verification_level` INT NOT NULL DEFAULT '0',
	`permissions` TEXT NOT NULL,
	`password` varchar(200) NOT NULL,
	`registration_ip` varchar(40) NOT NULL,
	`registration_date` DATETIME NOT NULL,
	`last_visit` DATETIME,
	`mass_mail_optin` INT(1) NOT NULL,
	`grad_date` varchar(50) NOT NULL,
	`rank` INT NULL,
	`resume` varchar(255) NULL,
	`resume_date` DATETIME NULL,
	`social_slack` varchar(128) NULL,
	`social_facebook` varchar(128) NULL,
	`social_twitter` varchar(128) NULL,
	`social_github` varchar(128) NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `event_signin` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`event_id` INT NOT NULL,
	`account_id` INT NOT NULL,
	`time` DATETIME NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `event` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`type` INT NOT NULL,
	`name` varchar(150) NOT NULL,
	`description` TEXT,
	`location` varchar(100) NOT NULL,
	`start_date` DATETIME NOT NULL,
	`end_date` DATETIME NOT NULL,
	`create_date` DATETIME NOT NULL,
	`created_by` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `session` (
	`id` varchar(32) NOT NULL,
	`account_id` INT NOT NULL,
	`start_date` DATETIME NOT NULL,
	`expire_date` DATETIME NOT NULL,
	`ip_address` varchar(40) NOT NULL,
	`browser` varchar(255)
);

CREATE TABLE `account_rank` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`title` varchar(150) NOT NULL,
	`image` varchar(255),
	PRIMARY KEY (`id`)
);

CREATE TABLE `site_log` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`type` INT NOT NULL,
	`account_id` INT NOT NULL,
	`ip_address` varchar(40) NOT NULL,
	`log_time` DATETIME NOT NULL,
	`operation` varchar(100) NOT NULL,
	`data` TEXT,
	PRIMARY KEY (`id`)
);

CREATE TABLE `writeup_submissions` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`account_id` INT NOT NULL,
	`name` varchar(255) NOT NULL,
	`time_created` DATETIME NOT NULL,
	`time_updated` DATETIME NOT NULL,
	PRIMARY KEY (`id`);
);

CREATE TABLE `file_uploads` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`account_id` INT NOT NULL,
	`time_created` DATETIME NOT NULL,
	`name` varchar(255) NOT NULL DEFAULT '',
	PRIMARY KEY (`id`);
);

CREATE TABLE `tiles` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` varchar(127) NOT NULL,
	`description` varchar(255) NOT NULL,
	`link` varchar(255) NOT NULL,
	`deleted` BOOLEAN NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`)
);

CREATE TABLE `event_sign_ins_old` (
	`email` varchar(100),
	`timestamp` varchar(100)
);

ALTER TABLE `account` ADD CONSTRAINT `account_fk0` FOREIGN KEY (`rank`) REFERENCES `account_rank`(`id`);

ALTER TABLE `event_signin` ADD CONSTRAINT `event_signin_fk0` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`);

ALTER TABLE `event_signin` ADD CONSTRAINT `event_signin_fk1` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`);

ALTER TABLE `event` ADD CONSTRAINT `event_fk1` FOREIGN KEY (`created_by`) REFERENCES `account`(`id`);

ALTER TABLE `session` ADD CONSTRAINT `session_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`);

ALTER TABLE `site_log` ADD CONSTRAINT `site_log_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`);

ALTER TABLE `writeup_submissions` ADD CONSTRAINT `writeup_submissions_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`); 

ALTER TABLE `file_uploads` ADD CONSTRAINT `file_uploads_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`); 
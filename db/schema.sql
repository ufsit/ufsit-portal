CREATE TABLE `account` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`full_name` varchar(100) NOT NULL,
	`email` varchar(254) NOT NULL,
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
	`account_id` INT NOT NULL,
	`key` varchar(255) NOT NULL
);

CREATE TABLE `image_uploads` (
	`account_id` INT NOT NULL,
	`key` varchar(255) NOT NULL
);

CREATE TABLE `candidates` (
	`person` varchar(255) NOT NULL,
	`pres` bit NOT NULL,
	`vp` bit NOT NULL,
	`treas` bit NOT NULL,
	`secr` bit NOT NULL
);

CREATE TABLE `pres` (
	`first` varchar(255),
	`second` varchar(255),
	`third` varchar(255),
	`fourth` varchar(255),
	`fifth` varchar(255)
);

CREATE TABLE `vp` (
	`first` varchar(255),
	`second` varchar(255),
	`third` varchar(255),
	`fourth` varchar(255),
	`fifth` varchar(255)
);

CREATE TABLE `treas` (
	`first` varchar(255),
	`second` varchar(255),
	`third` varchar(255),
	`fourth` varchar(255),
	`fifth` varchar(255)
);

CREATE TABLE `secr` (
	`first` varchar(255),
	`second` varchar(255),
	`third` varchar(255),
	`fourth` varchar(255),
	`fifth` varchar(255)
);

CREATE TABLE `voters` (
	`person` INT NOT NULL
);

CREATE TABLE `results` {
	`position`varchar(255),
	`json` varchar(255)
}

ALTER TABLE `account` ADD CONSTRAINT `account_fk0` FOREIGN KEY (`rank`) REFERENCES `account_rank`(`id`);

ALTER TABLE `event_signin` ADD CONSTRAINT `event_signin_fk0` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`);

ALTER TABLE `event_signin` ADD CONSTRAINT `event_signin_fk1` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`);

ALTER TABLE `event` ADD CONSTRAINT `event_fk1` FOREIGN KEY (`created_by`) REFERENCES `account`(`id`);

ALTER TABLE `session` ADD CONSTRAINT `session_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`);

ALTER TABLE `site_log` ADD CONSTRAINT `site_log_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`);

ALTER TABLE `writeup_submissions` ADD CONSTRAINT `writeup_submissions_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`); 

ALTER TABLE `image_uploads` ADD CONSTRAINT `image_uploads_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`); 
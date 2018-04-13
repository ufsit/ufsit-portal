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
	`rank` INT NOT NULL DEFAULT '0',
	`resume` varchar(255) NULL,
	`resume_date` DATETIME NULL,
	`social_slack` varchar(128) NULL,
	`social_facebook` varchar(128) NULL,
	`social_twitter` varchar(128) NULL,
	`social_github` varchar(128) NULL,
	`total_meetings` INT NOT NULL DEFAULT '0',
	`research` boolean NOT NULL DEFAULT FALSE,
	`internship` boolean NOT NULL DEFAULT FALSE,
	`major` varchar(128) NOT NULL DEFAULT 'computer science',
	`gpa` INT NOT NULL DEFAULT '0'
	PRIMARY KEY (`id`)
);

CREATE TABLE `candidates` (
	`person` varchar(255) NOT NULL,
	`pres` bit NOT NULL,
	`vp` bit NOT NULL,
	`treas` bit NOT NULL,
	`secr` bit NOT NULL
);

CREATE TABLE `content_tags` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` varchar(64),
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
	`CREATE_date` DATETIME NOT NULL,
	`CREATEd_by` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `event_signin` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`event_id` INT NOT NULL,
	`account_id` INT NOT NULL,
	`time` DATETIME NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `file_uploads` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`account_id` INT NOT NULL,
	`time_created` DATETIME NOT NULL,
	`name` varchar(255) NOT NULL DEFAULT '',
	PRIMARY KEY (`id`);
);

CREATE TABLE president (
	`1th` varchar(255),
	`2th` varchar(255),
	`3th` varchar(255),
	`4th` varchar(255),
	`5th` varchar(255),
	`6th` varchar(255),
	`7th` varchar(255),
	`8th` varchar(255),
	`9th` varchar(255),
	`10th` varchar(255),
	`11th` varchar(255),
	`12th` varchar(255),
	`13th` varchar(255),
	`14th` varchar(255),
	`15th` varchar(255),
	`16th` varchar(255),
	`17th` varchar(255),
	`18th` varchar(255),
	`19th` varchar(255),
	`20th` varchar(255),
	`21th` varchar(255),
	`22th` varchar(255),
	`23th` varchar(255),
	`24th` varchar(255),
	`25th` varchar(255),
	`26th` varchar(255),
	`27th` varchar(255),
	`28th` varchar(255),
	`29th` varchar(255),
	`30th` varchar(255)
);

CREATE TABLE `results` (
	`position`varchar(255),
	`json` varchar(255)
)

CREATE TABLE secretary (
	`1th` varchar(255),
	`2th` varchar(255),
	`3th` varchar(255),
	`4th` varchar(255),
	`5th` varchar(255),
	`6th` varchar(255),
	`7th` varchar(255),
	`8th` varchar(255),
	`9th` varchar(255),
	`10th` varchar(255),
	`11th` varchar(255),
	`12th` varchar(255),
	`13th` varchar(255),
	`14th` varchar(255),
	`15th` varchar(255),
	`16th` varchar(255),
	`17th` varchar(255),
	`18th` varchar(255),
	`19th` varchar(255),
	`20th` varchar(255),
	`21th` varchar(255),
	`22th` varchar(255),
	`23th` varchar(255),
	`24th` varchar(255),
	`25th` varchar(255),
	`26th` varchar(255),
	`27th` varchar(255),
	`28th` varchar(255),
	`29th` varchar(255),
	`30th` varchar(255)
);

CREATE TABLE `session` (
	`id` varchar(32) NOT NULL,
	`account_id` INT NOT NULL,
	`start_date` DATETIME NOT NULL,
	`expire_date` DATETIME NOT NULL,
	`ip_address` varchar(40) NOT NULL,
	`browser` varchar(255)
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

CREATE TABLE `tagged_writeups` (
	`writeup_id` INT NOT NULL,
	`tag_id` INT NOT NULL,
	PRIMARY KEY (`writeup_id`,`tag_id`)
);

CREATE TABLE `tile_clicks` (
	`tile_id` INT NOT NULL,
	`user_id` INT NOT NULL,
	PRIMARY KEY (`tile_id`,`user_id`)
);

CREATE TABLE `tiles` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` varchar(127) NOT NULL,
	`description` varchar(255) NOT NULL,
	`link` varchar(255) NOT NULL,
	`deleted` BOOLEAN NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`)
);

CREATE TABLE `treasurer` (
	`1th` varchar(255),
	`2th` varchar(255),
	`3th` varchar(255),
	`4th` varchar(255),
	`5th` varchar(255),
	`6th` varchar(255),
	`7th` varchar(255),
	`8th` varchar(255),
	`9th` varchar(255),
	`10th` varchar(255),
	`11th` varchar(255),
	`12th` varchar(255),
	`13th` varchar(255),
	`14th` varchar(255),
	`15th` varchar(255),
	`16th` varchar(255),
	`17th` varchar(255),
	`18th` varchar(255),
	`19th` varchar(255),
	`20th` varchar(255),
	`21th` varchar(255),
	`22th` varchar(255),
	`23th` varchar(255),
	`24th` varchar(255),
	`25th` varchar(255),
	`26th` varchar(255),
	`27th` varchar(255),
	`28th` varchar(255),
	`29th` varchar(255),
	`30th` varchar(255)
);

CREATE TABLE `voters` (
	`person` INT NOT NULL
);

CREATE TABLE `vp` (
	`1th` varchar(255),
	`2th` varchar(255),
	`3th` varchar(255),
	`4th` varchar(255),
	`5th` varchar(255),
	`6th` varchar(255),
	`7th` varchar(255),
	`8th` varchar(255),
	`9th` varchar(255),
	`10th` varchar(255),
	`11th` varchar(255),
	`12th` varchar(255),
	`13th` varchar(255),
	`14th` varchar(255),
	`15th` varchar(255),
	`16th` varchar(255),
	`17th` varchar(255),
	`18th` varchar(255),
	`19th` varchar(255),
	`20th` varchar(255),
	`21th` varchar(255),
	`22th` varchar(255),
	`23th` varchar(255),
	`24th` varchar(255),
	`25th` varchar(255),
	`26th` varchar(255),
	`27th` varchar(255),
	`28th` varchar(255),
	`29th` varchar(255),
	`30th` varchar(255)
);

CREATE TABLE `writeup_clicks` (
	`user_id` INT NOT NULL,
	`writeup_id` INT NOT NULL,
	`click_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`user_id`,`writeup_id`,`click_time`)
);

CREATE TABLE `writeup_submissions` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`account_id` INT NOT NULL,
	`name` varchar(255) NOT NULL,
	`time_created` DATETIME NOT NULL,
	`time_updated` DATETIME NOT NULL,
	`difficulty` INT NOT NULL DEFAULT '0';
	`description` varchar(255) NOT NULL DEFAULT '';
	`hidden` BOOLEAN NOT NULL DEFAULT TRUE;
	PRIMARY KEY (`id`);
);

CREATE TABLE `event_sign_ins_old` (
	`email` varchar(100),
	`timestamp` varchar(100)
);

ALTER TABLE `event_signin` ADD CONSTRAINT `event_signin_fk0` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`);
ALTER TABLE `event_signin` ADD CONSTRAINT `event_signin_fk1` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`);
ALTER TABLE `event` ADD CONSTRAINT `event_fk1` FOREIGN KEY (`CREATEd_by`) REFERENCES `account`(`id`);
ALTER TABLE `session` ADD CONSTRAINT `session_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`);
ALTER TABLE `site_log` ADD CONSTRAINT `site_log_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`);
ALTER TABLE `writeup_submissions` ADD CONSTRAINT `writeup_submissions_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`); 
ALTER TABLE `file_uploads` ADD CONSTRAINT `file_uploads_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`); 
ALTER TABLE `tagged_writeups` ADD CONSTRAINT `tagged_writeups_fk0` FOREIGN KEY (`writeup_id`) REFERENCES `writeup_submissions`(`id`);
ALTER TABLE `tagged_writeups` ADD CONSTRAINT `tagged_writeups_fk1` FOREIGN KEY (`tag_id`) REFERENCES `content_tags`(`id`);
ALTER TABLE `writeup_clicks` ADD CONSTRAINT `writeup_clicks_fk0` FOREIGN KEY (`user_id`) REFERENCES `account`(`id`);
ALTER TABLE `writeup_clicks` ADD CONSTRAINT `writeup_clicks_fk1` FOREIGN KEY (`writeup_id`) REFERENCES `writeup_submissions`(`id`);

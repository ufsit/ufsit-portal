CREATE TABLE `eligible_voters` (
	`id` INT NOT NULL
);

CREATE TABLE `president` (
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

create table `vp` (
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

CREATE TABLE `secretary` (
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

CREATE TABLE `candidates` (
	`person` varchar(255) NOT NULL,
	`pres` bit NOT NULL,
	`vp` bit NOT NULL,
	`treas` bit NOT NULL,
	`secr` bit NOT NULL
);

CREATE TABLE `results` (
	`position` varchar(255),
	`json` varchar(255)
);

-- Everythin up to here is voting


-- This chunk is all account info
ALTER TABLE `account` add COLUMN `research` boolean NOT NULL DEFAULT FALSE;
ALTER TABLE `account` add COLUMN `internship` boolean NOT NULL DEFAULT FALSE;
ALTER TABLE `account` add COLUMN `major` varchar(128) NOT NULL DEFAULT 'computer science';
ALTER TABLE `account` add COLUMN `gpa` INT NOT NULL DEFAULT '0';
ALTER TABLE `account` add COLUMN `total_meetings` INT NOT NULL DEFAULT '0';
ALTER TABLE `account` add COLUMN `ufl_email` varchar(254) NOT NULL;


-- Write-up submissions
ALTER TABLE `writeup_submissions` ADD COLUMN `difficulty` INT NOT NULL DEFAULT '0';
ALTER TABLE `writeup_submissions` ADD COLUMN `description` varchar(255) NOT NULL DEFAULT '';
ALTER TABLE `writeup_submissions` ADD COLUMN `hidden` BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE `writeup_clicks` (
	`user_id` INT NOT NULL,
	`writeup_id` INT NOT NULL,
	`click_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`user_id`,`writeup_id`,`click_time`)
);

CREATE TABLE `tagged_writeups` (
	`writeup_id` INT NOT NULL,
	`tag_id` INT NOT NULL,
	PRIMARY KEY (`writeup_id`,`tag_id`)
);

CREATE TABLE `content_tags` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` varchar(64),
	PRIMARY KEY (`id`)
);

ALTER TABLE `tagged_writeups` ADD CONSTRAINT `tagged_writeups_fk0`
FOREIGN KEY (`writeup_id`) REFERENCES `writeup_submissions`(`id`);

ALTER TABLE `tagged_writeups` ADD CONSTRAINT `tagged_writeups_fk1`
FOREIGN KEY (`tag_id`) REFERENCES `content_tags`(`id`);

ALTER TABLE `writeup_clicks` ADD CONSTRAINT `writeup_clicks_fk0`
FOREIGN KEY (`user_id`) REFERENCES `account`(`id`);

ALTER TABLE `writeup_clicks` ADD CONSTRAINT `writeup_clicks_fk1`
FOREIGN KEY (`writeup_id`) REFERENCES `writeup_submissions`(`id`);

ALTER TABLE `file_uploads` ADD CONSTRAINT `file_uploads_fk0` FOREIGN KEY (`account_id`) REFERENCES `account`(`id`);


-- Tables to be dropped
 DROP TABLE `account_rank`;


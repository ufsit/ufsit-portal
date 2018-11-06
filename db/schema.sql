-- MySQL dump 10.13  Distrib 5.7.19, for osx10.11 (x86_64)
--
-- Host: er7lx9km02rjyf3n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com    Database: ypsz5z6b0h2nvijw
-- ------------------------------------------------------
-- Server version	5.5.5-10.0.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `ypsz5z6b0h2nvijw`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ypsz5z6b0h2nvijw` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;

USE `ypsz5z6b0h2nvijw`;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8_unicode_ci NOT NULL,
  `verification_level` int(11) NOT NULL DEFAULT '0',
  `permissions` text COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `registration_ip` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `registration_date` datetime NOT NULL,
  `last_visit` datetime DEFAULT NULL,
  `mass_mail_optin` int(1) NOT NULL,
  `grad_date` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `rank` int(11) DEFAULT NULL,
  `resume` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `resume_date` datetime DEFAULT NULL,
  `social_slack` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `social_facebook` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `social_twitter` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `social_github` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `research` tinyint(1) NOT NULL DEFAULT '0',
  `internship` tinyint(1) NOT NULL DEFAULT '0',
  `major` varchar(128) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'computer science',
  `gpa` int(11) NOT NULL DEFAULT '0',
  `total_meetings` int(11) NOT NULL DEFAULT '0',
  `ufl_email` varchar(254) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `account_fk0` (`rank`)
) ENGINE=InnoDB AUTO_INCREMENT=487 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `accounts_old`
--

DROP TABLE IF EXISTS `accounts_old`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts_old` (
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `password_salt` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password_hash` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `full_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `in_mailing_list` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `grad_year` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `candidates` (
  `person` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pres` bit(1) NOT NULL,
  `vp` bit(1) NOT NULL,
  `treas` bit(1) NOT NULL,
  `secr` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `content_tags`
--

DROP TABLE IF EXISTS `content_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `content_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `eligible_voters`
--

DROP TABLE IF EXISTS `eligible_voters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eligible_voters` (
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `name` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `location` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `create_date` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_fk1` (`created_by`),
  CONSTRAINT `event_fk1` FOREIGN KEY (`created_by`) REFERENCES `account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_sign_ins_old`
--

DROP TABLE IF EXISTS `event_sign_ins_old`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_sign_ins_old` (
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `timestamp` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_signin`
--

DROP TABLE IF EXISTS `event_signin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_signin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_signin_fk0` (`event_id`),
  KEY `event_signin_fk1` (`account_id`),
  CONSTRAINT `event_signin_fk0` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `event_signin_fk1` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `file_uploads`
--

DROP TABLE IF EXISTS `file_uploads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `file_uploads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) NOT NULL,
  `key` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `time_created` datetime NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `file_uploads_fk0` (`account_id`),
  CONSTRAINT `file_uploads_fk0` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `president`
--

DROP TABLE IF EXISTS `president`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `president` (
  `1th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `2th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `3th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `4th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `5th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `6th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `7th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `8th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `9th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `10th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `11th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `12th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `13th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `14th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `15th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `16th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `17th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `18th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `19th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `20th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `21th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `22th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `23th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `24th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `25th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `26th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `27th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `28th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `29th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `30th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `results` (
  `position` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `json` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `secretary`
--

DROP TABLE IF EXISTS `secretary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `secretary` (
  `1th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `2th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `3th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `4th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `5th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `6th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `7th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `8th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `9th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `10th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `11th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `12th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `13th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `14th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `15th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `16th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `17th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `18th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `19th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `20th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `21th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `22th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `23th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `24th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `25th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `26th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `27th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `28th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `29th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `30th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session` (
  `id` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `account_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `expire_date` datetime NOT NULL,
  `ip_address` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `browser` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  KEY `session_fk0` (`account_id`),
  CONSTRAINT `session_fk0` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `site_log`
--

DROP TABLE IF EXISTS `site_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `ip_address` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `log_time` datetime NOT NULL,
  `operation` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `data` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `site_log_fk0` (`account_id`),
  CONSTRAINT `site_log_fk0` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tagged_writeups`
--

DROP TABLE IF EXISTS `tagged_writeups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tagged_writeups` (
  `writeup_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`writeup_id`,`tag_id`),
  KEY `tagged_writeups_fk1` (`tag_id`),
  CONSTRAINT `tagged_writeups_fk0` FOREIGN KEY (`writeup_id`) REFERENCES `writeup_submissions` (`id`),
  CONSTRAINT `tagged_writeups_fk1` FOREIGN KEY (`tag_id`) REFERENCES `content_tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tile_clicks`
--

DROP TABLE IF EXISTS `tile_clicks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tile_clicks` (
  `tile_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tiles`
--

DROP TABLE IF EXISTS `tiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(127) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `link` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `treasurer`
--

DROP TABLE IF EXISTS `treasurer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `treasurer` (
  `1th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `2th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `3th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `4th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `5th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `6th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `7th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `8th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `9th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `10th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `11th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `12th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `13th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `14th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `15th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `16th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `17th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `18th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `19th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `20th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `21th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `22th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `23th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `24th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `25th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `26th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `27th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `28th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `29th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `30th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `voters`
--

DROP TABLE IF EXISTS `voters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voters` (
  `person` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vp`
--

DROP TABLE IF EXISTS `vp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vp` (
  `1th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `2th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `3th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `4th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `5th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `6th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `7th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `8th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `9th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `10th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `11th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `12th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `13th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `14th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `15th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `16th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `17th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `18th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `19th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `20th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `21th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `22th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `23th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `24th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `25th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `26th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `27th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `28th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `29th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `30th` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `writeup_clicks`
--

DROP TABLE IF EXISTS `writeup_clicks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `writeup_clicks` (
  `user_id` int(11) NOT NULL,
  `writeup_id` int(11) NOT NULL,
  `click_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`writeup_id`,`click_time`),
  KEY `writeup_clicks_fk1` (`writeup_id`),
  CONSTRAINT `writeup_clicks_fk0` FOREIGN KEY (`user_id`) REFERENCES `account` (`id`),
  CONSTRAINT `writeup_clicks_fk1` FOREIGN KEY (`writeup_id`) REFERENCES `writeup_submissions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `writeup_submissions`
--

DROP TABLE IF EXISTS `writeup_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `writeup_submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) NOT NULL,
  `key` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `time_created` datetime NOT NULL,
  `time_updated` datetime NOT NULL,
  `difficulty` int(11) NOT NULL DEFAULT '0',
  `description` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `hidden` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `writeup_submissions_fk0` (`account_id`),
  CONSTRAINT `writeup_submissions_fk0` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-11-06 16:25:06

-- Set timezone to GMT +08:00 (Kuala Lumpur / Singapore)
SET time_zone = '+08:00';

-- Drop database if database exists
DROP DATABASE IF EXISTS `CLUB-MAN`;
CREATE DATABASE IF NOT EXISTS `CLUB-MAN` CHARACTER SET utf8mb4;

-- Select database after it is created
USE CLUB-MAN;

-- Drop tables if table exists
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `USER`;
DROP TABLE IF EXISTS `USER // ROLE`;
DROP TABLE IF EXISTS `ROLE`;
DROP TABLE IF EXISTS `FEEDBACK`;
DROP TABLE IF EXISTS `RSVP`;
DROP TABLE IF EXISTS `ATTENDANCE`;
DROP TABLE IF EXISTS `ACTIVITY`;
DROP TABLE IF EXISTS `PERMISSIONS`;
SET FOREIGN_KEY_CHECKS = 1;

-- Create tables
CREATE TABLE `USER` (
    `userID` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `engName` TINYTEXT NOT NULL,
    -- `chineseName` TINYTEXT NOT NULL,
    `email` TINYTEXT NOT NULL,
    `phoneNo` TINYTEXT NOT NULL,
    `facebookID` TINYTEXT,
    `icNo` CHAR(14) NOT NULL,
    `hostel` TINYTEXT,
    `faculty` TINYTEXT,
    `course` TINYTEXT,
    `hometown` TINYTEXT,
    `matricNo` CHAR(10) NOT NULL,
    `custPw` TINYTEXT,
    `signupTime` TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP 
        NOT NULL,
    `activeStart` DATE,
    `activeEnd` DATE,
    `updateTime` TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP 
        NOT NULL,
    `updateDue` BOOLEAN NOT NULL
        DEFAULT 0,
    PRIMARY KEY (`userID`),
    UNIQUE (`userID`)
);

CREATE TABLE `ROLE` (
    `roleID` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `roleName` TINYTEXT NOT NULL,
    PRIMARY KEY (`roleID`),
    UNIQUE (`roleID`)
);

CREATE TABLE `USER_ROLE` (
    `roleID` INT UNSIGNED NOT NULL,
    `userID` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`roleID`, `userID`)
);

CREATE TABLE `FEEDBACK` (
    `feedbackID` INT UNSIGNED 
        AUTO_INCREMENT
        NOT NULL,
    `userID` INT UNSIGNED,
    `activityID` BIGINT UNSIGNED,
    `isAnonymous` BOOLEAN NOT NULL,
    `feedback` TEXT,
    `ratingOverall` TINYINT UNSIGNED,
    `ratingHumans` TINYINT UNSIGNED,
    `ratingSouvenir` TINYINT UNSIGNED,
    `ratingLearn` TINYINT UNSIGNED,
    `ratingConfidence` TINYINT UNSIGNED,
    `createTime` TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP 
        NOT NULL,
    PRIMARY KEY (`feedbackID`),
    UNIQUE (`feedbackID`)
);

CREATE TABLE `RSVP` (
    `rsvpID` SERIAL NOT NULL,
    `userID` INT UNSIGNED NOT NULL,
    `activityID` BIGINT UNSIGNED NOT NULL,
    `createTime` TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP 
        NOT NULL,
    `specificInfo` JSON NOT NULL,
    `isRevoked` BOOLEAN NOT NULL,
    PRIMARY KEY (`rsvpID`),
    UNIQUE (`rsvpID`)
);

CREATE TABLE `ATTENDANCE` (
    `attendanceID` SERIAL NOT NULL,
    `userID` INT UNSIGNED NOT NULL,
    `activityID` BIGINT UNSIGNED NOT NULL,
    `createTime` TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP 
        NOT NULL,
    PRIMARY KEY (`attendanceID`),
    UNIQUE (`attendanceID`)
);

CREATE TABLE `ACTIVITY` (
    `activityID` SERIAL NOT NULL,
    `activityDesc` TEXT,
    `activityPic` TEXT,
    `userID` INT UNSIGNED NOT NULL,
    `activityStart` DATETIME NOT NULL,
    `activityEnd` DATETIME NOT NULL,
    `activityLocation` TEXT,
    `createTime` TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP
        NOT NULL,
    `updateTime` TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
        NOT NULL,
    `activityTag` JSON,
    `specificInfo` JSON,
    PRIMARY KEY (`activityID`),
    UNIQUE (`activityID`)
);

CREATE TABLE `PERMISSIONS` (
    `permissionID` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `roleID` INT UNSIGNED,
    `userID` INT UNSIGNED,
    `tableName` TINYTEXT NOT NULL,
    `fieldName` TINYTEXT,
    `permission` JSON NOT NULL,
    PRIMARY KEY (`permissionID`)
);

-- Assigning foreign keys to tables and linking them up.
ALTER TABLE `USER // ROLE` ADD FOREIGN KEY (`userID`) REFERENCES `USER`(`userID`);
ALTER TABLE `USER // ROLE` ADD FOREIGN KEY (`roleID`) REFERENCES `ROLE`(`roleID`);
ALTER TABLE `FEEDBACK` ADD FOREIGN KEY (`userID`) REFERENCES `USER`(`userID`);
ALTER TABLE `FEEDBACK` ADD FOREIGN KEY (`activityID`) REFERENCES `ACTIVITY`(`activityID`);
ALTER TABLE `RSVP` ADD FOREIGN KEY (`userID`) REFERENCES `USER`(`userID`);
ALTER TABLE `RSVP` ADD FOREIGN KEY (`activityID`) REFERENCES `ACTIVITY`(`activityID`);
ALTER TABLE `ATTENDANCE` ADD FOREIGN KEY (`userID`) REFERENCES `USER`(`userID`);
ALTER TABLE `ATTENDANCE` ADD FOREIGN KEY (`activityID`) REFERENCES `ACTIVITY`(`activityID`);
ALTER TABLE `ACTIVITY` ADD FOREIGN KEY (`userID`) REFERENCES `USER`(`userID`);
ALTER TABLE `PERMISSIONS` ADD FOREIGN KEY (`roleID`) REFERENCES `ROLE`(`roleID`);
ALTER TABLE `PERMISSIONS` ADD FOREIGN KEY (`userID`) REFERENCES `USER`(`userID`);

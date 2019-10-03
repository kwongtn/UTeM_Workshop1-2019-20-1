-- Drop database if database exists
DROP DATABASE IF EXISTS `TEST-DATABASE`;
CREATE DATABASE IF NOT EXISTS `TEST-DATABASE` CHARACTER SET utf8mb4;

-- Select database after it is created
USE `TEST-DATABASE`;

-- Drop tables if table exists
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `USER`;
DROP TABLE IF EXISTS `USER // ROLE`;
DROP TABLE IF EXISTS `ROLE`;
DROP TABLE IF EXISTS `FEEDBACK`;
DROP TABLE IF EXISTS `RSVP`;
DROP TABLE IF EXISTS `ATTENDANCE`;
DROP TABLE IF EXISTS `ACTIVITY`;
SET FOREIGN_KEY_CHECKS = 1;

-- Create tables
CREATE TABLE `USER` (
    `userID` INT NOT NULL,
    `signupTime` TIMESTAMP NOT NULL,
    `engName` TEXT NOT NULL,
    `chineseName` TEXT NOT NULL,
    `email` TEXT NOT NULL,
    `phoneNo` TEXT NOT NULL,
    `facebookID` TEXT NOT NULL,
    `icNo` TEXT NOT NULL,
    `hostel` TEXT NOT NULL,
    `faculty` TEXT,
    `course` TEXT,
    `hometown` TEXT,
    `matricNo` TEXT NOT NULL,
    `custPw` TEXT,
    PRIMARY KEY (`userID`),
    UNIQUE (`userID`)
);

CREATE TABLE `USER // ROLE` (
    `roleID` SMALLINT NOT NULL,
    `userID` INT NOT NULL,
    PRIMARY KEY (`roleID`, `userID`)
);

CREATE TABLE `ROLE` (
    `roleID` SMALLINT NOT NULL,
    `roleName` TEXT NOT NULL,
    PRIMARY KEY (`roleID`),
    UNIQUE (`roleID`)
);

CREATE TABLE `FEEDBACK` (
    `feedbackID` INT NOT NULL,
    `userID` INT,
    `activityID` BIGINT,
    `isAnonymous` BOOL NOT NULL,
    `feedback` TEXT,
    `ratingOverall` SMALLINT,
    `ratingHumans` SMALLINT,
    `ratingSouvenir` SMALLINT,
    `ratingLearn` SMALLINT,
    `ratingConfidence` SMALLINT,
    `createTime` TIMESTAMP NOT NULL,
    PRIMARY KEY (`feedbackID`),
    UNIQUE (`feedbackID`)
);

CREATE TABLE `RSVP` (
    `rsvpID` BIGINT NOT NULL,
    `userID` INT NOT NULL,
    `activityID` BIGINT NOT NULL,
    `createTime` TIMESTAMP NOT NULL,
    PRIMARY KEY (`rsvpID`),
    UNIQUE (`rsvpID`)
);

CREATE TABLE `ATTENDANCE` (
    `attendanceID` BIGINT NOT NULL,
    `userID` INT NOT NULL,
    `activityID` BIGINT NOT NULL,
    `createTime` TIMESTAMP NOT NULL,
    PRIMARY KEY (`attendanceID`),
    UNIQUE (`attendanceID`)
);

CREATE TABLE `ACTIVITY` (
    `activityID` BIGINT NOT NULL,
    `activityDesc` TEXT NOT NULL,
    `activityPic` TEXT NOT NULL,
    `userID` INT NOT NULL,
    `activityStart` DATETIME NOT NULL,
    `activityEnd` DATETIME NOT NULL,
    `createTime` TIMESTAMP NOT NULL,
    `activityLocation` TEXT NOT NULL,
    PRIMARY KEY (`activityID`),
    UNIQUE (`activityID`)
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


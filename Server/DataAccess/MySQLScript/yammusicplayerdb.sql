/*
 Navicat Premium Data Transfer

 Source Server         : 192.168.3.82_3306
 Source Server Type    : MySQL
 Source Server Version : 80026
 Source Host           : 192.168.3.82:3306
 Source Schema         : yammusicplayerdb

 Target Server Type    : MySQL
 Target Server Version : 80026
 File Encoding         : 65001

 Date: 06/03/2024 21:33:01
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for albuminfo
-- ----------------------------
DROP TABLE IF EXISTS `albuminfo`;
CREATE TABLE `albuminfo`  (
  `albumId` bigint(0) NOT NULL COMMENT '专辑编号',
  `albumName` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '专辑名称',
  `albumAuthor` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '专辑作者',
  `albumIntro` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '专辑简介',
  `albumCover` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '专辑封面',
  `viewCount` int(0) NULL DEFAULT NULL COMMENT '浏览次数',
  `shareCount` int(0) NULL DEFAULT NULL COMMENT '分享次数',
  `userid` bigint(0) NULL DEFAULT NULL COMMENT '创建人',
  `createdatetime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `modifierId` bigint(0) NULL DEFAULT NULL COMMENT '修改人',
  `modifieddatetime` datetime(0) NULL DEFAULT NULL COMMENT '修改时间',
  `songLength` int(0) NULL DEFAULT NULL COMMENT '歌曲数量',
  PRIMARY KEY (`albumId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '专辑信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for appdevicerecord
-- ----------------------------
DROP TABLE IF EXISTS `appdevicerecord`;
CREATE TABLE `appdevicerecord`  (
  `userid` bigint(0) NOT NULL COMMENT '用户编号',
  `deviceid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '设备id',
  `token` varchar(1855) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'token',
  `DeviceType` int(0) NOT NULL COMMENT '设备类型(1-PC 2-IPhone 3-Android)',
  `createdatetime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `modifieddatetime` datetime(0) NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`deviceid`, `userid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'app设备信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for friends
-- ----------------------------
DROP TABLE IF EXISTS `friends`;
CREATE TABLE `friends`  (
  `recordId` bigint(0) NOT NULL COMMENT '记录编号',
  `userId` bigint(0) NULL DEFAULT NULL COMMENT '用户编号',
  `friendUserId` bigint(0) NULL DEFAULT NULL COMMENT '好友用户编号',
  `songId` bigint(0) NULL DEFAULT NULL COMMENT '歌曲编号',
  `createddatetime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `backup01` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备用字段01',
  `backup02` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备用字段02',
  `backup03` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备用字段03',
  PRIMARY KEY (`recordId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户好友信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for listeninghistory
-- ----------------------------
DROP TABLE IF EXISTS `listeninghistory`;
CREATE TABLE `listeninghistory`  (
  `recordId` bigint(0) NOT NULL COMMENT '记录编号',
  `songId` bigint(0) NULL DEFAULT NULL COMMENT '歌曲编号',
  `userId` bigint(0) NULL DEFAULT NULL COMMENT '用户编号',
  `backup01` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备用字段01',
  `backup02` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备用字段02',
  `backup03` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备用字段03',
  `CreationDateTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`recordId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '收听历史' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for recentlylistened
-- ----------------------------
DROP TABLE IF EXISTS `recentlylistened`;
CREATE TABLE `recentlylistened`  (
  `RecordID` bigint(0) NOT NULL COMMENT '主键编号',
  `UserID` bigint(0) NOT NULL COMMENT '用户编号',
  `SongId` bigint(0) NULL DEFAULT NULL COMMENT '歌曲编号',
  `AlbumId` bigint(0) NULL DEFAULT NULL COMMENT '专辑编号',
  `CreatedDataTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`RecordID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '最近收听记录' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sharinghistory
-- ----------------------------
DROP TABLE IF EXISTS `sharinghistory`;
CREATE TABLE `sharinghistory`  (
  `recordId` bigint(0) NOT NULL COMMENT '记录编号',
  `songId` bigint(0) NULL DEFAULT NULL COMMENT '歌曲编号',
  `shareTarget` bigint(0) NULL DEFAULT NULL COMMENT '分享目标用户编号',
  `shareUser` bigint(0) NULL DEFAULT NULL COMMENT '分享用户编号',
  `CreatedDataTime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `backup01` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备用字段01',
  `backup02` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备用字段02',
  `backup03` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备用字段03',
  PRIMARY KEY (`recordId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '分享历史' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for songcomment
-- ----------------------------
DROP TABLE IF EXISTS `songcomment`;
CREATE TABLE `songcomment`  (
  `commentId` bigint(0) NOT NULL COMMENT '评论编号',
  `songId` bigint(0) NULL DEFAULT NULL COMMENT '歌曲编号',
  `publisher` bigint(0) NULL DEFAULT NULL COMMENT '发布者',
  `content` varchar(655) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '评论内容',
  `createddatetime` datetime(0) NULL DEFAULT NULL COMMENT '发布时间',
  `backup01` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备用字段01',
  `backup02` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备用字段02',
  `backup03` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备用字段03',
  `state` int(0) NULL DEFAULT NULL COMMENT '状态',
  PRIMARY KEY (`commentId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '歌曲评论' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for songinfo
-- ----------------------------
DROP TABLE IF EXISTS `songinfo`;
CREATE TABLE `songinfo`  (
  `songId` bigint(0) NOT NULL COMMENT '歌曲编号',
  `albumId` bigint(0) NOT NULL COMMENT '专辑编号',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '歌曲名称',
  `cover` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '专辑封面',
  `fileName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '文件名',
  `fileType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '文件类型',
  `fileSize` double NULL DEFAULT NULL COMMENT '文件大小',
  `duration` double NULL DEFAULT NULL COMMENT '歌曲时长',
  `artist` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '歌手名',
  `year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '年份',
  `comment` varchar(855) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '注释',
  `reserved1` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '保留位1',
  `reserved2` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '保留位2',
  `reserved3` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '保留位3',
  `userid` bigint(0) NULL DEFAULT NULL COMMENT '创建人',
  `createdatetime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `modifierId` bigint(0) NULL DEFAULT NULL COMMENT '修改人',
  `modifieddatetime` datetime(0) NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`songId`, `albumId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '歌曲信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for userinfo
-- ----------------------------
DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo`  (
  `userid` bigint(0) NOT NULL COMMENT '用户编号',
  `username` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(90) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '电子邮件',
  `wechart` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '微信号',
  `signature` varchar(355) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '签名',
  `createdatetime` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `modifieddatetime` datetime(0) NULL DEFAULT NULL COMMENT '修改时间',
  `userface` varchar(855) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户头像',
  PRIMARY KEY (`userid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- View structure for vw_friends
-- ----------------------------
DROP VIEW IF EXISTS `vw_friends`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `vw_friends` AS select `friends`.`recordId` AS `recordId`,`friends`.`userId` AS `userId`,`friends`.`friendUserId` AS `friendUserId`,`friends`.`songId` AS `songId`,`friends`.`createddatetime` AS `createddatetime`,`friends`.`backup01` AS `backup01`,`friends`.`backup02` AS `backup02`,`friends`.`backup03` AS `backup03`,`songinfo`.`title` AS `title`,`songinfo`.`cover` AS `cover`,`songinfo`.`artist` AS `artist`,`songinfo`.`year` AS `year`,`songinfo`.`comment` AS `comment`,`userinfo`.`username` AS `username`,`userinfo`.`userface` AS `userface`,`fu`.`username` AS `friendUserName`,`fu`.`userface` AS `friendUserFace` from (((`friends` left join `songinfo` on((`friends`.`songId` = `songinfo`.`songId`))) left join `userinfo` on((`friends`.`userId` = `userinfo`.`userid`))) left join `userinfo` `fu` on((`friends`.`friendUserId` = `fu`.`userid`)));

-- ----------------------------
-- View structure for vw_recentlylistened
-- ----------------------------
DROP VIEW IF EXISTS `vw_recentlylistened`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `vw_recentlylistened` AS select `recentlylistened`.`RecordID` AS `RecordID`,`recentlylistened`.`UserID` AS `UserID`,`recentlylistened`.`SongId` AS `SongId`,`recentlylistened`.`AlbumId` AS `AlbumId`,`recentlylistened`.`CreatedDataTime` AS `CreatedDataTime`,`userinfo`.`username` AS `username`,`userinfo`.`userface` AS `userface`,`songinfo`.`title` AS `title`,`songinfo`.`cover` AS `cover`,`songinfo`.`artist` AS `artist`,`songinfo`.`duration` AS `duration`,`songinfo`.`year` AS `year`,`songinfo`.`comment` AS `comment`,`songinfo`.`fileName` AS `fileName`,`songinfo`.`fileType` AS `fileType`,`songinfo`.`fileSize` AS `fileSize`,`albuminfo`.`albumName` AS `albumName`,`albuminfo`.`albumAuthor` AS `albumAuthor`,`albuminfo`.`albumIntro` AS `albumIntro`,`albuminfo`.`albumCover` AS `albumCover`,`albuminfo`.`viewCount` AS `viewCount`,`albuminfo`.`shareCount` AS `shareCount`,`albuminfo`.`songLength` AS `songLength` from (((`recentlylistened` left join `userinfo` on((`recentlylistened`.`UserID` = `userinfo`.`userid`))) left join `songinfo` on((`recentlylistened`.`SongId` = `songinfo`.`songId`))) left join `albuminfo` on((`recentlylistened`.`AlbumId` = `albuminfo`.`albumId`)));

-- ----------------------------
-- View structure for vw_sharinghistory
-- ----------------------------
DROP VIEW IF EXISTS `vw_sharinghistory`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `vw_sharinghistory` AS select `sharinghistory`.`recordId` AS `recordId`,`sharinghistory`.`songId` AS `songId`,`sharinghistory`.`shareTarget` AS `shareTarget`,`sharinghistory`.`shareUser` AS `shareUser`,`sharinghistory`.`CreatedDataTime` AS `CreatedDataTime`,`sharinghistory`.`backup01` AS `backup01`,`sharinghistory`.`backup02` AS `backup02`,`sharinghistory`.`backup03` AS `backup03`,`songinfo`.`title` AS `title`,`songinfo`.`cover` AS `cover`,`songinfo`.`fileName` AS `fileName`,`songinfo`.`fileType` AS `fileType`,`songinfo`.`fileSize` AS `fileSize`,`songinfo`.`duration` AS `duration`,`songinfo`.`artist` AS `artist`,`songinfo`.`year` AS `year`,`songinfo`.`comment` AS `comment`,`songinfo`.`reserved3` AS `reserved3`,`songinfo`.`reserved2` AS `reserved2`,`songinfo`.`reserved1` AS `reserved1`,`userinfo`.`username` AS `shareTargetUserName`,`userinfo`.`userface` AS `shareTargetUserFace`,`su`.`username` AS `shareUserName`,`su`.`userface` AS `shareUserFace` from (((`sharinghistory` left join `songinfo` on((`sharinghistory`.`songId` = `songinfo`.`songId`))) left join `userinfo` on((`sharinghistory`.`shareTarget` = `userinfo`.`userid`))) left join `userinfo` `su` on((`sharinghistory`.`shareUser` = `su`.`userid`)));

-- ----------------------------
-- View structure for vw_songcomment
-- ----------------------------
DROP VIEW IF EXISTS `vw_songcomment`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `vw_songcomment` AS select `songcomment`.`commentId` AS `commentId`,`songcomment`.`songId` AS `songId`,`songcomment`.`publisher` AS `publisher`,`songcomment`.`content` AS `content`,`songcomment`.`createddatetime` AS `createddatetime`,`songcomment`.`backup01` AS `backup01`,`songcomment`.`backup02` AS `backup02`,`songcomment`.`backup03` AS `backup03`,`userinfo`.`username` AS `username`,`userinfo`.`userface` AS `userface`,`songcomment`.`state` AS `state` from (`songcomment` left join `userinfo` on((`songcomment`.`publisher` = `userinfo`.`userid`)));

-- ----------------------------
-- View structure for vw_userdeviceinfo
-- ----------------------------
DROP VIEW IF EXISTS `vw_userdeviceinfo`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `vw_userdeviceinfo` AS select `userinfo`.`userid` AS `userid`,`userinfo`.`username` AS `username`,`userinfo`.`password` AS `password`,`userinfo`.`email` AS `email`,`userinfo`.`wechart` AS `wechart`,`userinfo`.`signature` AS `signature`,`userinfo`.`createdatetime` AS `createdatetime`,`userinfo`.`modifieddatetime` AS `modifieddatetime`,`appdevicerecord`.`deviceid` AS `deviceid`,`appdevicerecord`.`token` AS `token`,`appdevicerecord`.`DeviceType` AS `DeviceType`,`userinfo`.`userface` AS `userface` from (`userinfo` left join `appdevicerecord` on((`userinfo`.`userid` = `appdevicerecord`.`userid`)));

-- ----------------------------
-- Procedure structure for Create_albuminfo
-- ----------------------------
DROP PROCEDURE IF EXISTS `Create_albuminfo`;
delimiter ;;
CREATE PROCEDURE `Create_albuminfo`(IN albumId bigint,
                    IN albumName varchar(600),
                    IN albumAuthor varchar(600),
                    IN albumIntro varchar(1200),
                    IN albumCover varchar(8000),
                    IN viewCount int,
                    IN shareCount int,
                    IN userid bigint,
                    IN createdatetime datetime,
                    IN modifierId bigint,
                    IN modifieddatetime datetime,
                    IN songLength int)
begin
     insert into albuminfo
     (
               albumId,
               albumName,
               albumAuthor,
               albumIntro,
               albumCover,
               viewCount,
               shareCount,
               userid,
               createdatetime,
               modifierId,
               modifieddatetime,
               songLength
     )
     values
     (
               albumId,
               albumName,
               albumAuthor,
               albumIntro,
               albumCover,
               viewCount,
               shareCount,
               userid,
               createdatetime,
               modifierId,
               modifieddatetime,
               songLength
     );
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Create_appdevicerecord
-- ----------------------------
DROP PROCEDURE IF EXISTS `Create_appdevicerecord`;
delimiter ;;
CREATE PROCEDURE `Create_appdevicerecord`(IN userid bigint,
                    IN deviceid varchar(1020),
                    IN token varchar(1020),
                    IN DeviceType int,
                    IN createdatetime datetime,
                    IN modifieddatetime datetime)
begin
     insert into appdevicerecord
     (
               userid,
               deviceid,
               token,
               DeviceType,
               createdatetime,
               modifieddatetime
     )
     values
     (
               userid,
               deviceid,
               token,
               DeviceType,
               createdatetime,
               modifieddatetime
     );
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Create_friends
-- ----------------------------
DROP PROCEDURE IF EXISTS `Create_friends`;
delimiter ;;
CREATE PROCEDURE `Create_friends`(IN recordId bigint,
                    IN userId bigint,
                    IN friendUserId bigint,
                    IN songId bigint,
                    IN createddatetime datetime,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020))
begin
     insert into friends
     (
               recordId,
               userId,
               friendUserId,
               songId,
               createddatetime,
               backup01,
               backup02,
               backup03
     )
     values
     (
               recordId,
               userId,
               friendUserId,
               songId,
               createddatetime,
               backup01,
               backup02,
               backup03
     );
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Create_listeninghistory
-- ----------------------------
DROP PROCEDURE IF EXISTS `Create_listeninghistory`;
delimiter ;;
CREATE PROCEDURE `Create_listeninghistory`(IN recordId bigint,
                    IN songId bigint,
                    IN userId bigint,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020),
                    IN CreationDateTime datetime)
begin
     insert into listeninghistory
     (
               recordId,
               songId,
               userId,
               backup01,
               backup02,
               backup03,
               CreationDateTime
     )
     values
     (
               recordId,
               songId,
               userId,
               backup01,
               backup02,
               backup03,
               CreationDateTime
     );
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Create_recentlylistened
-- ----------------------------
DROP PROCEDURE IF EXISTS `Create_recentlylistened`;
delimiter ;;
CREATE PROCEDURE `Create_recentlylistened`(IN RecordID bigint,
                    IN UserID bigint,
                    IN SongId bigint,
                    IN AlbumId bigint,
                    IN CreatedDataTime datetime)
begin
     insert into recentlylistened
     (
               RecordID,
               UserID,
               SongId,
               AlbumId,
               CreatedDataTime
     )
     values
     (
               RecordID,
               UserID,
               SongId,
               AlbumId,
               CreatedDataTime
     );
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Create_sharinghistory
-- ----------------------------
DROP PROCEDURE IF EXISTS `Create_sharinghistory`;
delimiter ;;
CREATE PROCEDURE `Create_sharinghistory`(IN recordId bigint,
                    IN songId bigint,
                    IN shareTarget bigint,
                    IN shareUser bigint,
                    IN CreatedDataTime datetime,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020))
begin
     insert into sharinghistory
     (
               recordId,
               songId,
               shareTarget,
               shareUser,
               CreatedDataTime,
               backup01,
               backup02,
               backup03
     )
     values
     (
               recordId,
               songId,
               shareTarget,
               shareUser,
               CreatedDataTime,
               backup01,
               backup02,
               backup03
     );
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Create_songcomment
-- ----------------------------
DROP PROCEDURE IF EXISTS `Create_songcomment`;
delimiter ;;
CREATE PROCEDURE `Create_songcomment`(IN commentId bigint,
                    IN songId bigint,
                    IN publisher bigint,
                    IN content varchar(2620),
                    IN createddatetime datetime,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020),
                    IN state int)
begin
     insert into songcomment
     (
               commentId,
               songId,
               publisher,
               content,
               createddatetime,
               backup01,
               backup02,
               backup03,
               state
     )
     values
     (
               commentId,
               songId,
               publisher,
               content,
               createddatetime,
               backup01,
               backup02,
               backup03,
               state
     );
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Create_songinfo
-- ----------------------------
DROP PROCEDURE IF EXISTS `Create_songinfo`;
delimiter ;;
CREATE PROCEDURE `Create_songinfo`(IN songId bigint,
                    IN albumId bigint,
                    IN title varchar(1020),
                    IN cover varchar(8000),
                    IN fileName varchar(1020),
                    IN fileType varchar(1020),
                    IN fileSize double,
                    IN duration double,
                    IN artist varchar(1020),
                    IN year varchar(1020),
                    IN comment varchar(3420),
                    IN reserved1 varchar(12000),
                    IN reserved2 varchar(12000),
                    IN reserved3 varchar(12000),
                    IN userid bigint,
                    IN createdatetime datetime,
                    IN modifierId bigint,
                    IN modifieddatetime datetime)
begin
     insert into songinfo
     (
               songId,
               albumId,
               title,
               cover,
               fileName,
               fileType,
               fileSize,
               duration,
               artist,
               year,
               comment,
               reserved1,
               reserved2,
               reserved3,
               userid,
               createdatetime,
               modifierId,
               modifieddatetime
     )
     values
     (
               songId,
               albumId,
               title,
               cover,
               fileName,
               fileType,
               fileSize,
               duration,
               artist,
               year,
               comment,
               reserved1,
               reserved2,
               reserved3,
               userid,
               createdatetime,
               modifierId,
               modifieddatetime
     );
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Create_userinfo
-- ----------------------------
DROP PROCEDURE IF EXISTS `Create_userinfo`;
delimiter ;;
CREATE PROCEDURE `Create_userinfo`(IN userid bigint,
                    IN username varchar(60),
                    IN password varchar(270),
                    IN email varchar(1020),
                    IN wechart varchar(1020),
                    IN signature varchar(1420),
                    IN createdatetime datetime,
                    IN modifieddatetime datetime,
                    IN userface varchar(3420))
begin
     insert into userinfo
     (
               userid,
               username,
               password,
               email,
               wechart,
               signature,
               createdatetime,
               modifieddatetime,
               userface
     )
     values
     (
               userid,
               username,
               password,
               email,
               wechart,
               signature,
               createdatetime,
               modifieddatetime,
               userface
     );
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_albuminfo
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_albuminfo`;
delimiter ;;
CREATE PROCEDURE `Query_albuminfo`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'albumId,');
                Set SqlStr=CONCAT(SqlStr,'albumName,');
                Set SqlStr=CONCAT(SqlStr,'albumAuthor,');
                Set SqlStr=CONCAT(SqlStr,'albumIntro,');
                Set SqlStr=CONCAT(SqlStr,'albumCover,');
                Set SqlStr=CONCAT(SqlStr,'viewCount,');
                Set SqlStr=CONCAT(SqlStr,'shareCount,');
                Set SqlStr=CONCAT(SqlStr,'userid,');
                Set SqlStr=CONCAT(SqlStr,'createdatetime,');
                Set SqlStr=CONCAT(SqlStr,'modifierId,');
                Set SqlStr=CONCAT(SqlStr,'modifieddatetime,');
                Set SqlStr=CONCAT(SqlStr,'songLength');
    Set SqlStr=CONCAT(SqlStr,' from albuminfo');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_albuminfo_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_albuminfo_Page`;
delimiter ;;
CREATE PROCEDURE `Query_albuminfo_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='albuminfo';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'albumId,');
                Set SqlStr=CONCAT(SqlStr,'albumName,');
                Set SqlStr=CONCAT(SqlStr,'albumAuthor,');
                Set SqlStr=CONCAT(SqlStr,'albumIntro,');
                Set SqlStr=CONCAT(SqlStr,'albumCover,');
                Set SqlStr=CONCAT(SqlStr,'viewCount,');
                Set SqlStr=CONCAT(SqlStr,'shareCount,');
                Set SqlStr=CONCAT(SqlStr,'userid,');
                Set SqlStr=CONCAT(SqlStr,'createdatetime,');
                Set SqlStr=CONCAT(SqlStr,'modifierId,');
                Set SqlStr=CONCAT(SqlStr,'modifieddatetime,');
                Set SqlStr=CONCAT(SqlStr,'songLength');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 	
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_appdevicerecord
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_appdevicerecord`;
delimiter ;;
CREATE PROCEDURE `Query_appdevicerecord`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'userid,');
                Set SqlStr=CONCAT(SqlStr,'deviceid,');
                Set SqlStr=CONCAT(SqlStr,'token,');
                Set SqlStr=CONCAT(SqlStr,'DeviceType,');
                Set SqlStr=CONCAT(SqlStr,'createdatetime,');
                Set SqlStr=CONCAT(SqlStr,'modifieddatetime');
    Set SqlStr=CONCAT(SqlStr,' from appdevicerecord');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_appdevicerecord_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_appdevicerecord_Page`;
delimiter ;;
CREATE PROCEDURE `Query_appdevicerecord_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='appdevicerecord';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'userid,');
                Set SqlStr=CONCAT(SqlStr,'deviceid,');
                Set SqlStr=CONCAT(SqlStr,'token,');
                Set SqlStr=CONCAT(SqlStr,'DeviceType,');
                Set SqlStr=CONCAT(SqlStr,'createdatetime,');
                Set SqlStr=CONCAT(SqlStr,'modifieddatetime');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 	
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_friends
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_friends`;
delimiter ;;
CREATE PROCEDURE `Query_friends`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'recordId,');
                Set SqlStr=CONCAT(SqlStr,'userId,');
                Set SqlStr=CONCAT(SqlStr,'friendUserId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'createddatetime,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03');
    Set SqlStr=CONCAT(SqlStr,' from friends');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_friends_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_friends_Page`;
delimiter ;;
CREATE PROCEDURE `Query_friends_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='friends';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'recordId,');
                Set SqlStr=CONCAT(SqlStr,'userId,');
                Set SqlStr=CONCAT(SqlStr,'friendUserId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'createddatetime,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 	
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_listeninghistory
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_listeninghistory`;
delimiter ;;
CREATE PROCEDURE `Query_listeninghistory`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'recordId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'userId,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03,');
                Set SqlStr=CONCAT(SqlStr,'CreationDateTime');
    Set SqlStr=CONCAT(SqlStr,' from listeninghistory');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_listeninghistory_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_listeninghistory_Page`;
delimiter ;;
CREATE PROCEDURE `Query_listeninghistory_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='listeninghistory';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'recordId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'userId,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03,');
                Set SqlStr=CONCAT(SqlStr,'CreationDateTime');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 	
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_recentlylistened
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_recentlylistened`;
delimiter ;;
CREATE PROCEDURE `Query_recentlylistened`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'RecordID,');
                Set SqlStr=CONCAT(SqlStr,'UserID,');
                Set SqlStr=CONCAT(SqlStr,'SongId,');
                Set SqlStr=CONCAT(SqlStr,'AlbumId,');
                Set SqlStr=CONCAT(SqlStr,'CreatedDataTime');
    Set SqlStr=CONCAT(SqlStr,' from recentlylistened');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_recentlylistened_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_recentlylistened_Page`;
delimiter ;;
CREATE PROCEDURE `Query_recentlylistened_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='recentlylistened';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'RecordID,');
                Set SqlStr=CONCAT(SqlStr,'UserID,');
                Set SqlStr=CONCAT(SqlStr,'SongId,');
                Set SqlStr=CONCAT(SqlStr,'AlbumId,');
                Set SqlStr=CONCAT(SqlStr,'CreatedDataTime');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 	
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_sharinghistory
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_sharinghistory`;
delimiter ;;
CREATE PROCEDURE `Query_sharinghistory`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'recordId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'shareTarget,');
                Set SqlStr=CONCAT(SqlStr,'shareUser,');
                Set SqlStr=CONCAT(SqlStr,'CreatedDataTime,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03');
    Set SqlStr=CONCAT(SqlStr,' from sharinghistory');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_sharinghistory_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_sharinghistory_Page`;
delimiter ;;
CREATE PROCEDURE `Query_sharinghistory_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='sharinghistory';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'recordId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'shareTarget,');
                Set SqlStr=CONCAT(SqlStr,'shareUser,');
                Set SqlStr=CONCAT(SqlStr,'CreatedDataTime,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 	
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_songcomment
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_songcomment`;
delimiter ;;
CREATE PROCEDURE `Query_songcomment`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'commentId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'publisher,');
                Set SqlStr=CONCAT(SqlStr,'content,');
                Set SqlStr=CONCAT(SqlStr,'createddatetime,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03,');
                Set SqlStr=CONCAT(SqlStr,'state');
    Set SqlStr=CONCAT(SqlStr,' from songcomment');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_songcomment_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_songcomment_Page`;
delimiter ;;
CREATE PROCEDURE `Query_songcomment_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='songcomment';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'commentId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'publisher,');
                Set SqlStr=CONCAT(SqlStr,'content,');
                Set SqlStr=CONCAT(SqlStr,'createddatetime,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03,');
                Set SqlStr=CONCAT(SqlStr,'state');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 	
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_songinfo
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_songinfo`;
delimiter ;;
CREATE PROCEDURE `Query_songinfo`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'albumId,');
                Set SqlStr=CONCAT(SqlStr,'title,');
                Set SqlStr=CONCAT(SqlStr,'cover,');
                Set SqlStr=CONCAT(SqlStr,'fileName,');
                Set SqlStr=CONCAT(SqlStr,'fileType,');
                Set SqlStr=CONCAT(SqlStr,'fileSize,');
                Set SqlStr=CONCAT(SqlStr,'duration,');
                Set SqlStr=CONCAT(SqlStr,'artist,');
                Set SqlStr=CONCAT(SqlStr,'year,');
                Set SqlStr=CONCAT(SqlStr,'comment,');
                Set SqlStr=CONCAT(SqlStr,'reserved1,');
                Set SqlStr=CONCAT(SqlStr,'reserved2,');
                Set SqlStr=CONCAT(SqlStr,'reserved3,');
                Set SqlStr=CONCAT(SqlStr,'userid,');
                Set SqlStr=CONCAT(SqlStr,'createdatetime,');
                Set SqlStr=CONCAT(SqlStr,'modifierId,');
                Set SqlStr=CONCAT(SqlStr,'modifieddatetime');
    Set SqlStr=CONCAT(SqlStr,' from songinfo');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_songinfo_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_songinfo_Page`;
delimiter ;;
CREATE PROCEDURE `Query_songinfo_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='songinfo';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'albumId,');
                Set SqlStr=CONCAT(SqlStr,'title,');
                Set SqlStr=CONCAT(SqlStr,'cover,');
                Set SqlStr=CONCAT(SqlStr,'fileName,');
                Set SqlStr=CONCAT(SqlStr,'fileType,');
                Set SqlStr=CONCAT(SqlStr,'fileSize,');
                Set SqlStr=CONCAT(SqlStr,'duration,');
                Set SqlStr=CONCAT(SqlStr,'artist,');
                Set SqlStr=CONCAT(SqlStr,'year,');
                Set SqlStr=CONCAT(SqlStr,'comment,');
                Set SqlStr=CONCAT(SqlStr,'reserved1,');
                Set SqlStr=CONCAT(SqlStr,'reserved2,');
                Set SqlStr=CONCAT(SqlStr,'reserved3,');
                Set SqlStr=CONCAT(SqlStr,'userid,');
                Set SqlStr=CONCAT(SqlStr,'createdatetime,');
                Set SqlStr=CONCAT(SqlStr,'modifierId,');
                Set SqlStr=CONCAT(SqlStr,'modifieddatetime');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 	
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_userinfo
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_userinfo`;
delimiter ;;
CREATE PROCEDURE `Query_userinfo`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'userid,');
                Set SqlStr=CONCAT(SqlStr,'username,');
                Set SqlStr=CONCAT(SqlStr,'password,');
                Set SqlStr=CONCAT(SqlStr,'email,');
                Set SqlStr=CONCAT(SqlStr,'wechart,');
                Set SqlStr=CONCAT(SqlStr,'signature,');
                Set SqlStr=CONCAT(SqlStr,'createdatetime,');
                Set SqlStr=CONCAT(SqlStr,'modifieddatetime,');
                Set SqlStr=CONCAT(SqlStr,'userface');
    Set SqlStr=CONCAT(SqlStr,' from userinfo');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_userinfo_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_userinfo_Page`;
delimiter ;;
CREATE PROCEDURE `Query_userinfo_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='userinfo';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'userid,');
                Set SqlStr=CONCAT(SqlStr,'username,');
                Set SqlStr=CONCAT(SqlStr,'password,');
                Set SqlStr=CONCAT(SqlStr,'email,');
                Set SqlStr=CONCAT(SqlStr,'wechart,');
                Set SqlStr=CONCAT(SqlStr,'signature,');
                Set SqlStr=CONCAT(SqlStr,'createdatetime,');
                Set SqlStr=CONCAT(SqlStr,'modifieddatetime,');
                Set SqlStr=CONCAT(SqlStr,'userface');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 	
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_vw_friends
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_vw_friends`;
delimiter ;;
CREATE PROCEDURE `Query_vw_friends`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'recordId,');
                Set SqlStr=CONCAT(SqlStr,'userId,');
                Set SqlStr=CONCAT(SqlStr,'friendUserId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'createddatetime,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03,');
                Set SqlStr=CONCAT(SqlStr,'title,');
                Set SqlStr=CONCAT(SqlStr,'cover,');
                Set SqlStr=CONCAT(SqlStr,'artist,');
                Set SqlStr=CONCAT(SqlStr,'year,');
                Set SqlStr=CONCAT(SqlStr,'comment,');
                Set SqlStr=CONCAT(SqlStr,'username,');
                Set SqlStr=CONCAT(SqlStr,'userface,');
                Set SqlStr=CONCAT(SqlStr,'friendUserName,');
                Set SqlStr=CONCAT(SqlStr,'friendUserFace');
    Set SqlStr=CONCAT(SqlStr,' from vw_friends');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_vw_friends_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_vw_friends_Page`;
delimiter ;;
CREATE PROCEDURE `Query_vw_friends_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='vw_friends';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'recordId,');
                Set SqlStr=CONCAT(SqlStr,'userId,');
                Set SqlStr=CONCAT(SqlStr,'friendUserId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'createddatetime,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03,');
                Set SqlStr=CONCAT(SqlStr,'title,');
                Set SqlStr=CONCAT(SqlStr,'cover,');
                Set SqlStr=CONCAT(SqlStr,'artist,');
                Set SqlStr=CONCAT(SqlStr,'year,');
                Set SqlStr=CONCAT(SqlStr,'comment,');
                Set SqlStr=CONCAT(SqlStr,'username,');
                Set SqlStr=CONCAT(SqlStr,'userface,');
                Set SqlStr=CONCAT(SqlStr,'friendUserName,');
                Set SqlStr=CONCAT(SqlStr,'friendUserFace');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_vw_recentlylistened
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_vw_recentlylistened`;
delimiter ;;
CREATE PROCEDURE `Query_vw_recentlylistened`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'RecordID,');
                Set SqlStr=CONCAT(SqlStr,'UserID,');
                Set SqlStr=CONCAT(SqlStr,'SongId,');
                Set SqlStr=CONCAT(SqlStr,'AlbumId,');
                Set SqlStr=CONCAT(SqlStr,'CreatedDataTime,');
                Set SqlStr=CONCAT(SqlStr,'username,');
                Set SqlStr=CONCAT(SqlStr,'userface,');
                Set SqlStr=CONCAT(SqlStr,'title,');
                Set SqlStr=CONCAT(SqlStr,'cover,');
                Set SqlStr=CONCAT(SqlStr,'artist,');
                Set SqlStr=CONCAT(SqlStr,'duration,');
                Set SqlStr=CONCAT(SqlStr,'year,');
                Set SqlStr=CONCAT(SqlStr,'comment,');
                Set SqlStr=CONCAT(SqlStr,'fileName,');
                Set SqlStr=CONCAT(SqlStr,'fileType,');
                Set SqlStr=CONCAT(SqlStr,'fileSize,');
                Set SqlStr=CONCAT(SqlStr,'albumName,');
                Set SqlStr=CONCAT(SqlStr,'albumAuthor,');
                Set SqlStr=CONCAT(SqlStr,'albumIntro,');
                Set SqlStr=CONCAT(SqlStr,'albumCover,');
                Set SqlStr=CONCAT(SqlStr,'viewCount,');
                Set SqlStr=CONCAT(SqlStr,'shareCount,');
                Set SqlStr=CONCAT(SqlStr,'songLength');
    Set SqlStr=CONCAT(SqlStr,' from vw_recentlylistened');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_vw_recentlylistened_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_vw_recentlylistened_Page`;
delimiter ;;
CREATE PROCEDURE `Query_vw_recentlylistened_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='vw_recentlylistened';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'RecordID,');
                Set SqlStr=CONCAT(SqlStr,'UserID,');
                Set SqlStr=CONCAT(SqlStr,'SongId,');
                Set SqlStr=CONCAT(SqlStr,'AlbumId,');
                Set SqlStr=CONCAT(SqlStr,'CreatedDataTime,');
                Set SqlStr=CONCAT(SqlStr,'username,');
                Set SqlStr=CONCAT(SqlStr,'userface,');
                Set SqlStr=CONCAT(SqlStr,'title,');
                Set SqlStr=CONCAT(SqlStr,'cover,');
                Set SqlStr=CONCAT(SqlStr,'artist,');
                Set SqlStr=CONCAT(SqlStr,'duration,');
                Set SqlStr=CONCAT(SqlStr,'year,');
                Set SqlStr=CONCAT(SqlStr,'comment,');
                Set SqlStr=CONCAT(SqlStr,'fileName,');
                Set SqlStr=CONCAT(SqlStr,'fileType,');
                Set SqlStr=CONCAT(SqlStr,'fileSize,');
                Set SqlStr=CONCAT(SqlStr,'albumName,');
                Set SqlStr=CONCAT(SqlStr,'albumAuthor,');
                Set SqlStr=CONCAT(SqlStr,'albumIntro,');
                Set SqlStr=CONCAT(SqlStr,'albumCover,');
                Set SqlStr=CONCAT(SqlStr,'viewCount,');
                Set SqlStr=CONCAT(SqlStr,'shareCount,');
                Set SqlStr=CONCAT(SqlStr,'songLength');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_vw_sharinghistory
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_vw_sharinghistory`;
delimiter ;;
CREATE PROCEDURE `Query_vw_sharinghistory`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'recordId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'shareTarget,');
                Set SqlStr=CONCAT(SqlStr,'shareUser,');
                Set SqlStr=CONCAT(SqlStr,'CreatedDataTime,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03,');
                Set SqlStr=CONCAT(SqlStr,'title,');
                Set SqlStr=CONCAT(SqlStr,'cover,');
                Set SqlStr=CONCAT(SqlStr,'fileName,');
                Set SqlStr=CONCAT(SqlStr,'fileType,');
                Set SqlStr=CONCAT(SqlStr,'fileSize,');
                Set SqlStr=CONCAT(SqlStr,'duration,');
                Set SqlStr=CONCAT(SqlStr,'artist,');
                Set SqlStr=CONCAT(SqlStr,'year,');
                Set SqlStr=CONCAT(SqlStr,'comment,');
                Set SqlStr=CONCAT(SqlStr,'reserved3,');
                Set SqlStr=CONCAT(SqlStr,'reserved2,');
                Set SqlStr=CONCAT(SqlStr,'reserved1,');
                Set SqlStr=CONCAT(SqlStr,'shareTargetUserName,');
                Set SqlStr=CONCAT(SqlStr,'shareTargetUserFace,');
                Set SqlStr=CONCAT(SqlStr,'shareUserName,');
                Set SqlStr=CONCAT(SqlStr,'shareUserFace');
    Set SqlStr=CONCAT(SqlStr,' from vw_sharinghistory');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_vw_sharinghistory_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_vw_sharinghistory_Page`;
delimiter ;;
CREATE PROCEDURE `Query_vw_sharinghistory_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='vw_sharinghistory';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'recordId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'shareTarget,');
                Set SqlStr=CONCAT(SqlStr,'shareUser,');
                Set SqlStr=CONCAT(SqlStr,'CreatedDataTime,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03,');
                Set SqlStr=CONCAT(SqlStr,'title,');
                Set SqlStr=CONCAT(SqlStr,'cover,');
                Set SqlStr=CONCAT(SqlStr,'fileName,');
                Set SqlStr=CONCAT(SqlStr,'fileType,');
                Set SqlStr=CONCAT(SqlStr,'fileSize,');
                Set SqlStr=CONCAT(SqlStr,'duration,');
                Set SqlStr=CONCAT(SqlStr,'artist,');
                Set SqlStr=CONCAT(SqlStr,'year,');
                Set SqlStr=CONCAT(SqlStr,'comment,');
                Set SqlStr=CONCAT(SqlStr,'reserved3,');
                Set SqlStr=CONCAT(SqlStr,'reserved2,');
                Set SqlStr=CONCAT(SqlStr,'reserved1,');
                Set SqlStr=CONCAT(SqlStr,'shareTargetUserName,');
                Set SqlStr=CONCAT(SqlStr,'shareTargetUserFace,');
                Set SqlStr=CONCAT(SqlStr,'shareUserName,');
                Set SqlStr=CONCAT(SqlStr,'shareUserFace');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_vw_songcomment
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_vw_songcomment`;
delimiter ;;
CREATE PROCEDURE `Query_vw_songcomment`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'commentId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'publisher,');
                Set SqlStr=CONCAT(SqlStr,'content,');
                Set SqlStr=CONCAT(SqlStr,'createddatetime,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03,');
                Set SqlStr=CONCAT(SqlStr,'username,');
                Set SqlStr=CONCAT(SqlStr,'userface,');
                Set SqlStr=CONCAT(SqlStr,'state');
    Set SqlStr=CONCAT(SqlStr,' from vw_songcomment');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_vw_songcomment_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_vw_songcomment_Page`;
delimiter ;;
CREATE PROCEDURE `Query_vw_songcomment_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='vw_songcomment';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'commentId,');
                Set SqlStr=CONCAT(SqlStr,'songId,');
                Set SqlStr=CONCAT(SqlStr,'publisher,');
                Set SqlStr=CONCAT(SqlStr,'content,');
                Set SqlStr=CONCAT(SqlStr,'createddatetime,');
                Set SqlStr=CONCAT(SqlStr,'backup01,');
                Set SqlStr=CONCAT(SqlStr,'backup02,');
                Set SqlStr=CONCAT(SqlStr,'backup03,');
                Set SqlStr=CONCAT(SqlStr,'username,');
                Set SqlStr=CONCAT(SqlStr,'userface,');
                Set SqlStr=CONCAT(SqlStr,'state');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_vw_userdeviceinfo
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_vw_userdeviceinfo`;
delimiter ;;
CREATE PROCEDURE `Query_vw_userdeviceinfo`(IN SqlWhere varchar(8000))
begin
    Declare SqlStr varchar(8000);
	Set SqlStr='select ';
                Set SqlStr=CONCAT(SqlStr,'userid,');
                Set SqlStr=CONCAT(SqlStr,'username,');
                Set SqlStr=CONCAT(SqlStr,'password,');
                Set SqlStr=CONCAT(SqlStr,'email,');
                Set SqlStr=CONCAT(SqlStr,'wechart,');
                Set SqlStr=CONCAT(SqlStr,'signature,');
                Set SqlStr=CONCAT(SqlStr,'createdatetime,');
                Set SqlStr=CONCAT(SqlStr,'modifieddatetime,');
                Set SqlStr=CONCAT(SqlStr,'deviceid,');
                Set SqlStr=CONCAT(SqlStr,'token,');
                Set SqlStr=CONCAT(SqlStr,'DeviceType,');
                Set SqlStr=CONCAT(SqlStr,'userface');
    Set SqlStr=CONCAT(SqlStr,' from vw_userdeviceinfo');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Query_vw_userdeviceinfo_Page
-- ----------------------------
DROP PROCEDURE IF EXISTS `Query_vw_userdeviceinfo_Page`;
delimiter ;;
CREATE PROCEDURE `Query_vw_userdeviceinfo_Page`(IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000))
BEGIN
	declare SqlStr varchar(8000);
    declare totalsql varchar(8000);
    declare PageSql varchar(8000);
    declare TableName varchar(8000);
    set TableName='vw_userdeviceinfo';
    set SqlStr=CONCAT('select Row_Number() over(order by ',SortField,' ',SortMethod,') as RowNum,');
                Set SqlStr=CONCAT(SqlStr,'userid,');
                Set SqlStr=CONCAT(SqlStr,'username,');
                Set SqlStr=CONCAT(SqlStr,'password,');
                Set SqlStr=CONCAT(SqlStr,'email,');
                Set SqlStr=CONCAT(SqlStr,'wechart,');
                Set SqlStr=CONCAT(SqlStr,'signature,');
                Set SqlStr=CONCAT(SqlStr,'createdatetime,');
                Set SqlStr=CONCAT(SqlStr,'modifieddatetime,');
                Set SqlStr=CONCAT(SqlStr,'deviceid,');
                Set SqlStr=CONCAT(SqlStr,'token,');
                Set SqlStr=CONCAT(SqlStr,'DeviceType,');
                Set SqlStr=CONCAT(SqlStr,'userface');
    Set SqlStr=CONCAT(SqlStr,' from ',TableName);
    if SqlWhere<>'' then
       set SqlStr=CONCAT(SqlStr,' Where ',SqlWhere);
    End if;
    set totalsql=CONCAT('select count(*) into @TotalNumber from (',SqlStr,') as Result');
    set @totalsql=totalsql;
    PREPARE totalsql1 from @totalsql;
    EXECUTE totalsql1;
    deallocate prepare totalsql1;
    set TotalNumber = @TotalNumber;
    set PageSql=CONCAT(' select * from (',SqlStr,') as Result where Result.RowNum>=',StartRow,' and Result.RowNum<=',EndRow);
    set @sql = PageSql;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare 
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for UpadteAlbumSongData
-- ----------------------------
DROP PROCEDURE IF EXISTS `UpadteAlbumSongData`;
delimiter ;;
CREATE PROCEDURE `UpadteAlbumSongData`(IN `valbumId` bigint)
BEGIN
  if valbumId=0 Or valbumId is null then
		WITH temp_update_table AS (
			SELECT albumId, songLength
			FROM albuminfo
		)
		UPDATE albuminfo 
		SET albuminfo.songLength=(select count(songinfo.songId) from songinfo where songinfo.albumId=albuminfo.albumId)
		where albuminfo.albumId=temp_update_table.albumId;
	else
		UPDATE albuminfo 
		SET albuminfo.songLength=(select count(songinfo.songId) from songinfo where songinfo.albumId=valbumId)
		where albuminfo.albumId=valbumId;
	end if;

END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for updateAlbumSongLength
-- ----------------------------
DROP PROCEDURE IF EXISTS `updateAlbumSongLength`;
delimiter ;;
CREATE PROCEDURE `updateAlbumSongLength`(in valbumId bigint)
BEGIN
  if valbumId=0 Or valbumId is null then
		WITH temp_update_table AS (
			SELECT albumId, songLength
			FROM albuminfo
		)
		UPDATE albuminfo JOIN temp_update_table on albuminfo.albumId=temp_update_table.albumId
		SET albuminfo.songLength=(select count(songinfo.songId) from songinfo where songinfo.albumId=albuminfo.albumId)
		where albuminfo.albumId=temp_update_table.albumId;
	else
		UPDATE albuminfo 
		SET albuminfo.songLength=(select count(songinfo.songId) from songinfo where songinfo.albumId=valbumId)
		where albuminfo.albumId=valbumId;
	end if;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Update_albuminfo
-- ----------------------------
DROP PROCEDURE IF EXISTS `Update_albuminfo`;
delimiter ;;
CREATE PROCEDURE `Update_albuminfo`(IN albumId bigint,
                    IN albumName varchar(600),
                    IN albumAuthor varchar(600),
                    IN albumIntro varchar(1200),
                    IN albumCover varchar(8000),
                   IN viewCount int,
                   IN shareCount int,
                   IN userid bigint,
                   IN createdatetime datetime,
                   IN modifierId bigint,
                   IN modifieddatetime datetime,
                   IN songLength int,
         IN SqlWhere VARCHAR(8000))
begin
     Declare SqlStr varchar(8000);
     Set SqlStr='Update albuminfo Set ';
              Set SqlStr=CONCAT(SqlStr,'albumId=',cast(albumId as char),',');
              Set SqlStr=CONCAT(SqlStr,'albumName="',albumName,'",');
              Set SqlStr=CONCAT(SqlStr,'albumAuthor="',albumAuthor,'",');
              Set SqlStr=CONCAT(SqlStr,'albumIntro="',albumIntro,'",');
              Set SqlStr=CONCAT(SqlStr,'albumCover="',albumCover,'",');
              Set SqlStr=CONCAT(SqlStr,'viewCount=',cast(viewCount as char),',');
              Set SqlStr=CONCAT(SqlStr,'shareCount=',cast(shareCount as char),',');
              Set SqlStr=CONCAT(SqlStr,'userid=',cast(userid as char),',');
              Set SqlStr=CONCAT(SqlStr,'createdatetime="',DATE_FORMAT(createdatetime, '%Y-%m-%d %H:%i:%s'),'",');              
              Set SqlStr=CONCAT(SqlStr,'modifierId=',cast(modifierId as char),',');
              Set SqlStr=CONCAT(SqlStr,'modifieddatetime="',DATE_FORMAT(modifieddatetime, '%Y-%m-%d %H:%i:%s'),'",');              
              Set SqlStr=CONCAT(SqlStr,'songLength=',cast(songLength as char));
    if SqlWhere Is Not Null And SqlWhere<>'' Then
       Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere);
    End if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                   -- 执行sql语句
    deallocate prepare stmt;        -- 释放prepare
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Update_appdevicerecord
-- ----------------------------
DROP PROCEDURE IF EXISTS `Update_appdevicerecord`;
delimiter ;;
CREATE PROCEDURE `Update_appdevicerecord`(IN userid bigint,
                    IN deviceid varchar(1020),
                    IN token varchar(1020),
                   IN DeviceType int,
                   IN createdatetime datetime,
                   IN modifieddatetime datetime,
         IN SqlWhere VARCHAR(8000))
begin
     Declare SqlStr varchar(8000);
     Set SqlStr='Update appdevicerecord Set ';
              Set SqlStr=CONCAT(SqlStr,'userid=',cast(userid as char),',');
              Set SqlStr=CONCAT(SqlStr,'deviceid="',deviceid,'",');
              Set SqlStr=CONCAT(SqlStr,'token="',token,'",');
              Set SqlStr=CONCAT(SqlStr,'DeviceType=',cast(DeviceType as char),',');
              Set SqlStr=CONCAT(SqlStr,'createdatetime="',DATE_FORMAT(createdatetime, '%Y-%m-%d %H:%i:%s'),'",');              
              Set SqlStr=CONCAT(SqlStr,'modifieddatetime="',DATE_FORMAT(modifieddatetime, '%Y-%m-%d %H:%i:%s'),'"');              
    if SqlWhere Is Not Null And SqlWhere<>'' Then
       Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere);
    End if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                   -- 执行sql语句
    deallocate prepare stmt;        -- 释放prepare
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Update_friends
-- ----------------------------
DROP PROCEDURE IF EXISTS `Update_friends`;
delimiter ;;
CREATE PROCEDURE `Update_friends`(IN recordId bigint,
                   IN userId bigint,
                   IN friendUserId bigint,
                   IN songId bigint,
                   IN createddatetime datetime,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020),
         IN SqlWhere VARCHAR(8000))
begin
     Declare SqlStr varchar(8000);
     Set SqlStr='Update friends Set ';
              Set SqlStr=CONCAT(SqlStr,'recordId=',cast(recordId as char),',');
              Set SqlStr=CONCAT(SqlStr,'userId=',cast(userId as char),',');
              Set SqlStr=CONCAT(SqlStr,'friendUserId=',cast(friendUserId as char),',');
              Set SqlStr=CONCAT(SqlStr,'songId=',cast(songId as char),',');
              Set SqlStr=CONCAT(SqlStr,'createddatetime="',DATE_FORMAT(createddatetime, '%Y-%m-%d %H:%i:%s'),'",');              
              Set SqlStr=CONCAT(SqlStr,'backup01="',backup01,'",');
              Set SqlStr=CONCAT(SqlStr,'backup02="',backup02,'",');
              Set SqlStr=CONCAT(SqlStr,'backup03="',backup03,'"');
    if SqlWhere Is Not Null And SqlWhere<>'' Then
       Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere);
    End if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                   -- 执行sql语句
    deallocate prepare stmt;        -- 释放prepare
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Update_listeninghistory
-- ----------------------------
DROP PROCEDURE IF EXISTS `Update_listeninghistory`;
delimiter ;;
CREATE PROCEDURE `Update_listeninghistory`(IN recordId bigint,
                   IN songId bigint,
                   IN userId bigint,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020),
                   IN CreationDateTime datetime,
         IN SqlWhere VARCHAR(8000))
begin
     Declare SqlStr varchar(8000);
     Set SqlStr='Update listeninghistory Set ';
              Set SqlStr=CONCAT(SqlStr,'recordId=',cast(recordId as char),',');
              Set SqlStr=CONCAT(SqlStr,'songId=',cast(songId as char),',');
              Set SqlStr=CONCAT(SqlStr,'userId=',cast(userId as char),',');
              Set SqlStr=CONCAT(SqlStr,'backup01="',backup01,'",');
              Set SqlStr=CONCAT(SqlStr,'backup02="',backup02,'",');
              Set SqlStr=CONCAT(SqlStr,'backup03="',backup03,'",');
              Set SqlStr=CONCAT(SqlStr,'CreationDateTime="',DATE_FORMAT(CreationDateTime, '%Y-%m-%d %H:%i:%s'),'"');              
    if SqlWhere Is Not Null And SqlWhere<>'' Then
       Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere);
    End if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                   -- 执行sql语句
    deallocate prepare stmt;        -- 释放prepare
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Update_recentlylistened
-- ----------------------------
DROP PROCEDURE IF EXISTS `Update_recentlylistened`;
delimiter ;;
CREATE PROCEDURE `Update_recentlylistened`(IN RecordID bigint,
                   IN UserID bigint,
                   IN SongId bigint,
                   IN AlbumId bigint,
                   IN CreatedDataTime datetime,
         IN SqlWhere VARCHAR(8000))
begin
     Declare SqlStr varchar(8000);
     Set SqlStr='Update recentlylistened Set ';
              Set SqlStr=CONCAT(SqlStr,'RecordID=',cast(RecordID as char),',');
              Set SqlStr=CONCAT(SqlStr,'UserID=',cast(UserID as char),',');
              Set SqlStr=CONCAT(SqlStr,'SongId=',cast(SongId as char),',');
              Set SqlStr=CONCAT(SqlStr,'AlbumId=',cast(AlbumId as char),',');
              Set SqlStr=CONCAT(SqlStr,'CreatedDataTime="',DATE_FORMAT(CreatedDataTime, '%Y-%m-%d %H:%i:%s'),'"');              
    if SqlWhere Is Not Null And SqlWhere<>'' Then
       Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere);
    End if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                   -- 执行sql语句
    deallocate prepare stmt;        -- 释放prepare
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Update_sharinghistory
-- ----------------------------
DROP PROCEDURE IF EXISTS `Update_sharinghistory`;
delimiter ;;
CREATE PROCEDURE `Update_sharinghistory`(IN recordId bigint,
                   IN songId bigint,
                   IN shareTarget bigint,
                   IN shareUser bigint,
                   IN CreatedDataTime datetime,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020),
         IN SqlWhere VARCHAR(8000))
begin
     Declare SqlStr varchar(8000);
     Set SqlStr='Update sharinghistory Set ';
              Set SqlStr=CONCAT(SqlStr,'recordId=',cast(recordId as char),',');
              Set SqlStr=CONCAT(SqlStr,'songId=',cast(songId as char),',');
              Set SqlStr=CONCAT(SqlStr,'shareTarget=',cast(shareTarget as char),',');
              Set SqlStr=CONCAT(SqlStr,'shareUser=',cast(shareUser as char),',');
              Set SqlStr=CONCAT(SqlStr,'CreatedDataTime="',DATE_FORMAT(CreatedDataTime, '%Y-%m-%d %H:%i:%s'),'",');              
              Set SqlStr=CONCAT(SqlStr,'backup01="',backup01,'",');
              Set SqlStr=CONCAT(SqlStr,'backup02="',backup02,'",');
              Set SqlStr=CONCAT(SqlStr,'backup03="',backup03,'"');
    if SqlWhere Is Not Null And SqlWhere<>'' Then
       Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere);
    End if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                   -- 执行sql语句
    deallocate prepare stmt;        -- 释放prepare
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Update_songcomment
-- ----------------------------
DROP PROCEDURE IF EXISTS `Update_songcomment`;
delimiter ;;
CREATE PROCEDURE `Update_songcomment`(IN commentId bigint,
                   IN songId bigint,
                   IN publisher bigint,
                    IN content varchar(2620),
                   IN createddatetime datetime,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020),
                   IN state int,
         IN SqlWhere VARCHAR(8000))
begin
     Declare SqlStr varchar(8000);
     Set SqlStr='Update songcomment Set ';
              Set SqlStr=CONCAT(SqlStr,'commentId=',cast(commentId as char),',');
              Set SqlStr=CONCAT(SqlStr,'songId=',cast(songId as char),',');
              Set SqlStr=CONCAT(SqlStr,'publisher=',cast(publisher as char),',');
              Set SqlStr=CONCAT(SqlStr,'content="',content,'",');
              Set SqlStr=CONCAT(SqlStr,'createddatetime="',DATE_FORMAT(createddatetime, '%Y-%m-%d %H:%i:%s'),'",');              
              Set SqlStr=CONCAT(SqlStr,'backup01="',backup01,'",');
              Set SqlStr=CONCAT(SqlStr,'backup02="',backup02,'",');
              Set SqlStr=CONCAT(SqlStr,'backup03="',backup03,'",');
              Set SqlStr=CONCAT(SqlStr,'state=',cast(state as char));
    if SqlWhere Is Not Null And SqlWhere<>'' Then
       Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere);
    End if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                   -- 执行sql语句
    deallocate prepare stmt;        -- 释放prepare
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Update_songinfo
-- ----------------------------
DROP PROCEDURE IF EXISTS `Update_songinfo`;
delimiter ;;
CREATE PROCEDURE `Update_songinfo`(IN songId bigint,
                   IN albumId bigint,
                    IN title varchar(1020),
                    IN cover varchar(8000),
                    IN fileName varchar(1020),
                    IN fileType varchar(1020),
                   IN fileSize double,
                   IN duration double,
                    IN artist varchar(1020),
                    IN year varchar(1020),
                    IN comment varchar(3420),
                    IN reserved1 varchar(12000),
                    IN reserved2 varchar(12000),
                    IN reserved3 varchar(12000),
                   IN userid bigint,
                   IN createdatetime datetime,
                   IN modifierId bigint,
                   IN modifieddatetime datetime,
         IN SqlWhere VARCHAR(8000))
begin
     Declare SqlStr varchar(8000);
     Set SqlStr='Update songinfo Set ';
              Set SqlStr=CONCAT(SqlStr,'songId=',cast(songId as char),',');
              Set SqlStr=CONCAT(SqlStr,'albumId=',cast(albumId as char),',');
              Set SqlStr=CONCAT(SqlStr,'title="',title,'",');
              Set SqlStr=CONCAT(SqlStr,'cover="',cover,'",');
              Set SqlStr=CONCAT(SqlStr,'fileName="',filleName,'",');
              Set SqlStr=CONCAT(SqlStr,'fileType="',fileType,'",');
              Set SqlStr=CONCAT(SqlStr,'fileSize=',cast(fileSize as char),',');
              Set SqlStr=CONCAT(SqlStr,'duration=',cast(duration as char),',');
              Set SqlStr=CONCAT(SqlStr,'artist="',artist,'",');
              Set SqlStr=CONCAT(SqlStr,'year="',year,'",');
              Set SqlStr=CONCAT(SqlStr,'comment="',comment,'",');
              Set SqlStr=CONCAT(SqlStr,'reserved1="',reserved1,'",');
              Set SqlStr=CONCAT(SqlStr,'reserved2="',reserved2,'",');
              Set SqlStr=CONCAT(SqlStr,'reserved3="',reserved3,'",');
              Set SqlStr=CONCAT(SqlStr,'userid=',cast(userid as char),',');
              Set SqlStr=CONCAT(SqlStr,'createdatetime="',DATE_FORMAT(createdatetime, '%Y-%m-%d %H:%i:%s'),'",');              
              Set SqlStr=CONCAT(SqlStr,'modifierId=',cast(modifierId as char),',');
              Set SqlStr=CONCAT(SqlStr,'modifieddatetime="',DATE_FORMAT(modifieddatetime, '%Y-%m-%d %H:%i:%s'),'"');              
    if SqlWhere Is Not Null And SqlWhere<>'' Then
       Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere);
    End if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                   -- 执行sql语句
    deallocate prepare stmt;        -- 释放prepare
end
;;
delimiter ;

-- ----------------------------
-- Procedure structure for Update_userinfo
-- ----------------------------
DROP PROCEDURE IF EXISTS `Update_userinfo`;
delimiter ;;
CREATE PROCEDURE `Update_userinfo`(IN userid bigint,
                    IN username varchar(60),
                    IN password varchar(270),
                    IN email varchar(1020),
                    IN wechart varchar(1020),
                    IN signature varchar(1420),
                   IN createdatetime datetime,
                   IN modifieddatetime datetime,
                    IN userface varchar(3420),
         IN SqlWhere VARCHAR(8000))
begin
     Declare SqlStr varchar(8000);
     Set SqlStr='Update userinfo Set ';
              Set SqlStr=CONCAT(SqlStr,'userid=',cast(userid as char),',');
              Set SqlStr=CONCAT(SqlStr,'username="',username,'",');
              Set SqlStr=CONCAT(SqlStr,'password="',password,'",');
              Set SqlStr=CONCAT(SqlStr,'email="',email,'",');
              Set SqlStr=CONCAT(SqlStr,'wechart="',wechart,'",');
              Set SqlStr=CONCAT(SqlStr,'signature="',signature,'",');
              Set SqlStr=CONCAT(SqlStr,'createdatetime="',DATE_FORMAT(createdatetime, '%Y-%m-%d %H:%i:%s'),'",');              
              Set SqlStr=CONCAT(SqlStr,'modifieddatetime="',DATE_FORMAT(modifieddatetime, '%Y-%m-%d %H:%i:%s'),'",');              
              Set SqlStr=CONCAT(SqlStr,'userface="',userface,'"');
    if SqlWhere Is Not Null And SqlWhere<>'' Then
       Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere);
    End if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt;                   -- 执行sql语句
    deallocate prepare stmt;        -- 释放prepare
end
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;

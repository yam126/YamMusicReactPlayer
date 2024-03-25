
DROP PROCEDURE IF EXISTS Create_albuminfo;
DELIMITER $$
CREATE PROCEDURE Create_albuminfo
(
                    IN albumId bigint,
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
                    IN songLength int
)
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
end;
$$
DROP PROCEDURE if exists Update_albuminfo;
DELIMITER $$
create PROCEDURE Update_albuminfo
(
                   IN albumId bigint,
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
         IN SqlWhere VARCHAR(8000)
)
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
end;
$$
drop procedure if exists Query_albuminfo;
DELIMITER $$
create PROCEDURE Query_albuminfo
(
    IN SqlWhere varchar(8000)
)
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
end;
$$
drop procedure if exists Query_albuminfo_Page;
DELIMITER $$
create PROCEDURE Query_albuminfo_Page
(
  IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000) -- 查询条件
)
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
end;
$$
DROP PROCEDURE IF EXISTS Create_appdevicerecord;
DELIMITER $$
CREATE PROCEDURE Create_appdevicerecord
(
                    IN userid bigint,
                    IN deviceid varchar(1020),
                    IN token varchar(7420),
                    IN DeviceType int,
                    IN createdatetime datetime,
                    IN modifieddatetime datetime
)
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
end;
$$
DROP PROCEDURE if exists Update_appdevicerecord;
DELIMITER $$
create PROCEDURE Update_appdevicerecord
(
                   IN userid bigint,
                    IN deviceid varchar(1020),
                    IN token varchar(7420),
                   IN DeviceType int,
                   IN createdatetime datetime,
                   IN modifieddatetime datetime,
         IN SqlWhere VARCHAR(8000)
)
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
end;
$$
drop procedure if exists Query_appdevicerecord;
DELIMITER $$
create PROCEDURE Query_appdevicerecord
(
    IN SqlWhere varchar(8000)
)
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
end;
$$
drop procedure if exists Query_appdevicerecord_Page;
DELIMITER $$
create PROCEDURE Query_appdevicerecord_Page
(
  IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000) -- 查询条件
)
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
end;
$$
DROP PROCEDURE IF EXISTS Create_friends;
DELIMITER $$
CREATE PROCEDURE Create_friends
(
                    IN recordId bigint,
                    IN userId bigint,
                    IN friendUserId bigint,
                    IN songId bigint,
                    IN createddatetime datetime,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020)
)
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
end;
$$
DROP PROCEDURE if exists Update_friends;
DELIMITER $$
create PROCEDURE Update_friends
(
                   IN recordId bigint,
                   IN userId bigint,
                   IN friendUserId bigint,
                   IN songId bigint,
                   IN createddatetime datetime,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020),
         IN SqlWhere VARCHAR(8000)
)
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
end;
$$
drop procedure if exists Query_friends;
DELIMITER $$
create PROCEDURE Query_friends
(
    IN SqlWhere varchar(8000)
)
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
end;
$$
drop procedure if exists Query_friends_Page;
DELIMITER $$
create PROCEDURE Query_friends_Page
(
  IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000) -- 查询条件
)
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
end;
$$
DROP PROCEDURE IF EXISTS Create_listeninghistory;
DELIMITER $$
CREATE PROCEDURE Create_listeninghistory
(
                    IN recordId bigint,
                    IN songId bigint,
                    IN userId bigint,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020),
                    IN CreationDateTime datetime
)
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
end;
$$
DROP PROCEDURE if exists Update_listeninghistory;
DELIMITER $$
create PROCEDURE Update_listeninghistory
(
                   IN recordId bigint,
                   IN songId bigint,
                   IN userId bigint,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020),
                   IN CreationDateTime datetime,
         IN SqlWhere VARCHAR(8000)
)
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
end;
$$
drop procedure if exists Query_listeninghistory;
DELIMITER $$
create PROCEDURE Query_listeninghistory
(
    IN SqlWhere varchar(8000)
)
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
end;
$$
drop procedure if exists Query_listeninghistory_Page;
DELIMITER $$
create PROCEDURE Query_listeninghistory_Page
(
  IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000) -- 查询条件
)
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
end;
$$
DROP PROCEDURE IF EXISTS Create_recentlylistened;
DELIMITER $$
CREATE PROCEDURE Create_recentlylistened
(
                    IN RecordID bigint,
                    IN UserID bigint,
                    IN SongId bigint,
                    IN AlbumId bigint,
                    IN CreatedDataTime datetime
)
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
end;
$$
DROP PROCEDURE if exists Update_recentlylistened;
DELIMITER $$
create PROCEDURE Update_recentlylistened
(
                   IN RecordID bigint,
                   IN UserID bigint,
                   IN SongId bigint,
                   IN AlbumId bigint,
                   IN CreatedDataTime datetime,
         IN SqlWhere VARCHAR(8000)
)
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
end;
$$
drop procedure if exists Query_recentlylistened;
DELIMITER $$
create PROCEDURE Query_recentlylistened
(
    IN SqlWhere varchar(8000)
)
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
end;
$$
drop procedure if exists Query_recentlylistened_Page;
DELIMITER $$
create PROCEDURE Query_recentlylistened_Page
(
  IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000) -- 查询条件
)
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
end;
$$
DROP PROCEDURE IF EXISTS Create_sharinghistory;
DELIMITER $$
CREATE PROCEDURE Create_sharinghistory
(
                    IN recordId bigint,
                    IN songId bigint,
                    IN shareTarget bigint,
                    IN shareUser bigint,
                    IN CreatedDataTime datetime,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020)
)
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
end;
$$
DROP PROCEDURE if exists Update_sharinghistory;
DELIMITER $$
create PROCEDURE Update_sharinghistory
(
                   IN recordId bigint,
                   IN songId bigint,
                   IN shareTarget bigint,
                   IN shareUser bigint,
                   IN CreatedDataTime datetime,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020),
         IN SqlWhere VARCHAR(8000)
)
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
end;
$$
drop procedure if exists Query_sharinghistory;
DELIMITER $$
create PROCEDURE Query_sharinghistory
(
    IN SqlWhere varchar(8000)
)
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
end;
$$
drop procedure if exists Query_sharinghistory_Page;
DELIMITER $$
create PROCEDURE Query_sharinghistory_Page
(
  IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000) -- 查询条件
)
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
end;
$$
DROP PROCEDURE IF EXISTS Create_songcomment;
DELIMITER $$
CREATE PROCEDURE Create_songcomment
(
                    IN commentId bigint,
                    IN songId bigint,
                    IN publisher bigint,
                    IN content varchar(2620),
                    IN createddatetime datetime,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020),
                    IN state int
)
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
end;
$$
DROP PROCEDURE if exists Update_songcomment;
DELIMITER $$
create PROCEDURE Update_songcomment
(
                   IN commentId bigint,
                   IN songId bigint,
                   IN publisher bigint,
                    IN content varchar(2620),
                   IN createddatetime datetime,
                    IN backup01 varchar(1020),
                    IN backup02 varchar(1020),
                    IN backup03 varchar(1020),
                   IN state int,
         IN SqlWhere VARCHAR(8000)
)
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
end;
$$
drop procedure if exists Query_songcomment;
DELIMITER $$
create PROCEDURE Query_songcomment
(
    IN SqlWhere varchar(8000)
)
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
end;
$$
drop procedure if exists Query_songcomment_Page;
DELIMITER $$
create PROCEDURE Query_songcomment_Page
(
  IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000) -- 查询条件
)
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
end;
$$
DROP PROCEDURE IF EXISTS Create_songinfo;
DELIMITER $$
CREATE PROCEDURE Create_songinfo
(
                    IN songId bigint,
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
                    IN modifieddatetime datetime
)
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
end;
$$
DROP PROCEDURE if exists Update_songinfo;
DELIMITER $$
create PROCEDURE Update_songinfo
(
                   IN songId bigint,
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
         IN SqlWhere VARCHAR(8000)
)
begin
     Declare SqlStr varchar(8000);
     Set SqlStr='Update songinfo Set ';
              Set SqlStr=CONCAT(SqlStr,'songId=',cast(songId as char),',');
              Set SqlStr=CONCAT(SqlStr,'albumId=',cast(albumId as char),',');
              Set SqlStr=CONCAT(SqlStr,'title="',title,'",');
              Set SqlStr=CONCAT(SqlStr,'cover="',cover,'",');
              Set SqlStr=CONCAT(SqlStr,'fileName="',fileName,'",');
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
end;
$$
drop procedure if exists Query_songinfo;
DELIMITER $$
create PROCEDURE Query_songinfo
(
    IN SqlWhere varchar(8000)
)
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
end;
$$
drop procedure if exists Query_songinfo_Page;
DELIMITER $$
create PROCEDURE Query_songinfo_Page
(
  IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000) -- 查询条件
)
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
end;
$$
DROP PROCEDURE IF EXISTS Create_userinfo;
DELIMITER $$
CREATE PROCEDURE Create_userinfo
(
                    IN userid bigint,
                    IN username varchar(60),
                    IN password varchar(270),
                    IN email varchar(1020),
                    IN wechart varchar(1020),
                    IN signature varchar(1420),
                    IN createdatetime datetime,
                    IN modifieddatetime datetime,
                    IN userface varchar(3420)
)
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
end;
$$
DROP PROCEDURE if exists Update_userinfo;
DELIMITER $$
create PROCEDURE Update_userinfo
(
                   IN userid bigint,
                    IN username varchar(60),
                    IN password varchar(270),
                    IN email varchar(1020),
                    IN wechart varchar(1020),
                    IN signature varchar(1420),
                   IN createdatetime datetime,
                   IN modifieddatetime datetime,
                    IN userface varchar(3420),
         IN SqlWhere VARCHAR(8000)
)
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
end;
$$
drop procedure if exists Query_userinfo;
DELIMITER $$
create PROCEDURE Query_userinfo
(
    IN SqlWhere varchar(8000)
)
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
end;
$$
drop procedure if exists Query_userinfo_Page;
DELIMITER $$
create PROCEDURE Query_userinfo_Page
(
  IN StartRow int, -- 开始位置
  IN EndRow int, -- 结束位置
  OUT TotalNumber int,-- 总数据量
  IN SortField varchar(8000),-- 排序字段
  IN SortMethod varchar(10),-- 排序方法
  IN SqlWhere varchar(8000) -- 查询条件
)
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
end;
$$



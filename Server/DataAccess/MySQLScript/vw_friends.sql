﻿drop procedure if exists Query_vw_friends;
DELIMITER $$
create PROCEDURE Query_vw_friends
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
                Set SqlStr=CONCAT(SqlStr,'backup03,');
                Set SqlStr=CONCAT(SqlStr,'title,');
                Set SqlStr=CONCAT(SqlStr,'cover,');
                Set SqlStr=CONCAT(SqlStr,'artist,');
                Set SqlStr=CONCAT(SqlStr,'year,');
                Set SqlStr=CONCAT(SqlStr,'comment,');
                Set SqlStr=CONCAT(SqlStr,'username,');
                Set SqlStr=CONCAT(SqlStr,'userface,');
                Set SqlStr=CONCAT(SqlStr,'friendUserName,');
                Set SqlStr=CONCAT(SqlStr,'friendUserFace,');
                Set SqlStr=CONCAT(SqlStr,'friendSignature,');
                Set SqlStr=CONCAT(SqlStr,'friendRegistrationTime');
    Set SqlStr=CONCAT(SqlStr,' from vw_friends');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare
end
$$
drop procedure if exists Query_vw_friends_Page;
DELIMITER $$
create PROCEDURE Query_vw_friends_Page
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
                Set SqlStr=CONCAT(SqlStr,'friendUserFace,');
                Set SqlStr=CONCAT(SqlStr,'friendSignature,');
                Set SqlStr=CONCAT(SqlStr,'friendRegistrationTime');
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
$$
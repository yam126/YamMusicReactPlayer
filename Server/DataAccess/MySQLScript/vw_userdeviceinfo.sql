﻿drop procedure if exists Query_vw_userdeviceinfo;
DELIMITER $$
create PROCEDURE Query_vw_userdeviceinfo
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
                Set SqlStr=CONCAT(SqlStr,'deviceid,');
                Set SqlStr=CONCAT(SqlStr,'token,');
                Set SqlStr=CONCAT(SqlStr,'DeviceType');
    Set SqlStr=CONCAT(SqlStr,' from vw_userdeviceinfo');
	if SqlWhere is not Null Or SqlWhere<>'' then
	   Set SqlStr=CONCAT(SqlStr,' where ',SqlWhere); 
	end if;
    set @sql = SqlStr;
    PREPARE stmt FROM @sql;         -- 预处理动态sql语句
    EXECUTE stmt ;                        -- 执行sql语句
    deallocate prepare stmt;      -- 释放prepare
end
$$
drop procedure if exists Query_vw_userdeviceinfo_Page;
DELIMITER $$
create PROCEDURE Query_vw_userdeviceinfo_Page
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
                Set SqlStr=CONCAT(SqlStr,'DeviceType');
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
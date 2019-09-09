--日期文本转换
CREATE FUNCTION [dbo].[fwDateToChar]
(
	@d DATE
)
RETURNS VARCHAR(100)
WITH SCHEMABINDING
AS
BEGIN
	DECLARE 
	@returnValue VARCHAR(100)
	SET @returnValue = CONVERT(VARCHAR(100), @d, 23);
	RETURN @returnValue
END
GO

--时间文本转换
CREATE FUNCTION [dbo].[fwTimeToChar]
(
	@dt DATETIME
)
RETURNS VARCHAR(100)
WITH SCHEMABINDING
AS
BEGIN
	DECLARE 
	@returnValue VARCHAR(100)
	SET @returnValue = CONVERT(VARCHAR(100), @dt, 120);
	RETURN @returnValue
END
GO

--编码文本转换
CREATE FUNCTION [dbo].[fwCodeToText]
(
	@bizCodeType VARCHAR(5000),
	@bizCode VARCHAR(5000)
)
RETURNS VARCHAR(5000)
WITH SCHEMABINDING
AS
BEGIN
	DECLARE 
	@cTem VARCHAR(5000),
	@returnValue VARCHAR(5000),
	@p INT,
	@c VARCHAR(50)

	IF @bizCodeType is null or @bizCodeType='' or @bizCode is null or @bizCode=''
	BEGIN
		RETURN ''
	END

	SET @cTem=@bizCode + ','
	SET @returnValue=''
    WHILE @cTem<>''
    BEGIN
        SET @p=charindex(',',@cTem)
        IF @p>0
        BEGIN
            SET @c=left(@cTem,@p-1)
			IF @returnValue=''
				SELECT 
					@returnValue=dbo.FW_CODE.CODE_NAME 
				FROM 
					dbo.FW_CODE 
				WHERE 
					dbo.FW_CODE.CODE_TYPE_OID=@bizCodeType and dbo.FW_CODE.CODE=@c
			ELSE
				SELECT 
					@returnValue=@returnValue+'、'+dbo.FW_CODE.CODE_NAME 
				FROM 
					dbo.FW_CODE 
				WHERE 
					dbo.FW_CODE.CODE_TYPE_OID=@bizCodeType and dbo.FW_CODE.CODE=@c				
            SET @cTem=substring(@cTem,@p+1,500)
        END
	END

	RETURN @returnValue
END
GO

-- 计算年龄函数
CREATE FUNCTION [dbo].[fwGetAge]
(
    @BIRTHDAY DATETIME,
    @NOWDAY DATETIME
)
RETURNS INT
AS
BEGIN
	DECLARE @AGE INT, @YEAR INT, @MONTH INT, @DAY INT
	SET @AGE = 0
	SET @YEAR = 0
	SET @MONTH = 0
	SET @DAY = 0
	SET @YEAR = DATEPART(YEAR,@NOWDAY) - DATEPART(YEAR, @BIRTHDAY)
	SET @MONTH = DATEPART(MONTH,@NOWDAY) - DATEPART(MONTH, @BIRTHDAY)
	SET @DAY = DATEPART(DAY,@NOWDAY) - DATEPART(DAY, @BIRTHDAY)
	IF( @MONTH > 0)
		SET @AGE = @YEAR
	IF( @MONTH < 0)
		SET @AGE = @YEAR - 1
	IF(@MONTH = 0)
	BEGIN
		IF( @DAY >= 0)
			SET @AGE = @YEAR
		ELSE
			SET @AGE = @YEAR -1
	END
	RETURN(@AGE)
END
GO
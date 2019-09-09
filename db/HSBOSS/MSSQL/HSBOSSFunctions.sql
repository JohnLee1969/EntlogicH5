--将空串转为null
CREATE FUNCTION [dbo].[fwTextToNull]
(
	@text VARCHAR(50)
)
RETURNS VARCHAR(5000)
WITH SCHEMABINDING
AS
BEGIN
	DECLARE 
	@returnValue VARCHAR(5000)
	
	IF @text = '' or @text = 'null'
		RETURN null
	ELSE
		SET @returnValue = @text

	RETURN @returnValue
END
GO


--编码文本转换
CREATE FUNCTION [dbo].[hsCodeToText]
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
					@returnValue=dbo.HS_CODE.CODE_NAME 
				FROM 
					dbo.HS_CODE 
				WHERE 
					dbo.HS_CODE.HS_CODE_TYPE=@bizCodeType and dbo.HS_CODE.CODE=@c
			ELSE
				SELECT 
					@returnValue=@returnValue+'、'+dbo.HS_CODE.CODE_NAME 
				FROM 
					dbo.HS_CODE 
				WHERE 
					dbo.HS_CODE.HS_CODE_TYPE=@bizCodeType and dbo.HS_CODE.CODE=@c				
            SET @cTem=substring(@cTem,@p+1,500)
        END
	END

	RETURN @returnValue
END
GO

--获取企业名称
CREATE FUNCTION [dbo].[hsGetEnterpriseName]
(
	@oid VARCHAR(50)
)
RETURNS VARCHAR(5000)
WITH SCHEMABINDING
AS
BEGIN
	DECLARE 
	@returnValue VARCHAR(5000)

	SELECT 
		@returnValue=dbo.HS_ENTERPRISE.NAME 
	FROM 
		dbo.HS_ENTERPRISE 
	WHERE 
		dbo.HS_ENTERPRISE.OID=@oid

	RETURN @returnValue
END
GO

--获取工作人员名称
CREATE FUNCTION [dbo].[hsGetWorkerName]
(
	@oid VARCHAR(50)
)
RETURNS VARCHAR(5000)
WITH SCHEMABINDING
AS
BEGIN
	DECLARE 
	@returnValue VARCHAR(5000)

	SELECT 
		@returnValue=dbo.HS_WORKER.NAME 
	FROM 
		dbo.HS_WORKER 
	WHERE 
		dbo.HS_WORKER.OID=@oid

	RETURN @returnValue
END
GO

--获取产品名称
CREATE FUNCTION [dbo].[hsGetServiceName]
(
	@oid VARCHAR(50)
)
RETURNS VARCHAR(5000)
WITH SCHEMABINDING
AS
BEGIN
	DECLARE 
	@returnValue VARCHAR(5000)

	SELECT 
		@returnValue=dbo.HS_SERVICE.ANOTHER_NAMER 
	FROM 
		dbo.HS_SERVICE 
	WHERE 
		dbo.HS_SERVICE.OID=@oid

	RETURN @returnValue
END
GO

--获取产品类型
CREATE FUNCTION [dbo].[hsGetServiceType]
(
	@oid VARCHAR(50)
)
RETURNS VARCHAR(5000)
WITH SCHEMABINDING
AS
BEGIN
	DECLARE 
	@returnValue VARCHAR(5000)

	SELECT 
		@returnValue=dbo.HS_SERVICE.SERVICE_TYPE 
	FROM 
		dbo.HS_SERVICE 
	WHERE 
		dbo.HS_SERVICE.OID=@oid

	RETURN @returnValue
END
GO

--获取客户名称
CREATE FUNCTION [dbo].[hsGetCustomerName]
(
	@oid VARCHAR(50)
)
RETURNS VARCHAR(5000)
WITH SCHEMABINDING
AS
BEGIN
	DECLARE 
	@returnValue VARCHAR(5000)

	SELECT 
		@returnValue=dbo.HS_CUSTOMER.NAME 
	FROM 
		dbo.HS_CUSTOMER 
	WHERE 
		dbo.HS_CUSTOMER.OID=@oid

	RETURN @returnValue
END
GO


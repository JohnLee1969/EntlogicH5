-- This is the main caller for each script  
SET NOCOUNT ON  
GO  

:On Error exit  

PRINT '创建数据库对象'
:r EntlogicSystemTables.sql
:r EntlogicSystemIndexes.sql
:r EntlogicSystemFunctions.sql
:r HSBOSSTables.sql
:r HSBOSSIndexes.sql
:r HSBOSSFunctions.sql

PRINT '导入数据'
:r HSBOSSDatas.sql
GO  
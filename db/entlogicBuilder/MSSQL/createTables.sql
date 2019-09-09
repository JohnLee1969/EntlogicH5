/*
 * ER/Studio 8.0 SQL Code Generation
 * Company :      Octopus
 * Project :      entlogicBuilder.DM1
 * Author :       John
 *
 * Date Created : Monday, September 02, 2019 20:27:29
 * Target DBMS : Microsoft SQL Server 2008
 */

/* 
 * TABLE: BD_BUG 
 */

CREATE TABLE BD_BUG(
    OID            varchar(50)      NOT NULL,
    MODULE         varchar(50)      NOT NULL,
    BUG_NAME       varchar(100)     NULL,
    PRIORITY       int              NULL,
    TEST_TIME      datetime         NULL,
    TEST_USER      varchar(50)      NULL,
    TEST_DESC      varchar(2000)    NULL,
    REPAIR_TIME    datetime         NULL,
    REPAIR_USER    varchar(10)      NULL,
    REPAIR_DESC    varchar(2000)    NULL,
    STATUS         varchar(20)      NULL,
    CONSTRAINT PK_BD_BUG PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('BD_BUG') IS NOT NULL
    PRINT '<<< CREATED TABLE BD_BUG >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE BD_BUG >>>'
go

/* 
 * TABLE: BD_BUG_IMAGES 
 */

CREATE TABLE BD_BUG_IMAGES(
    OID     varchar(50)      NOT NULL,
    BUG     varchar(50)      NOT NULL,
    SN      int              NULL,
    NOTE    varchar(2000)    NULL,
    PATH    varchar(200)     NULL,
    CONSTRAINT PK_BD_BUG_IMAGE PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('BD_BUG_IMAGES') IS NOT NULL
    PRINT '<<< CREATED TABLE BD_BUG_IMAGES >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE BD_BUG_IMAGES >>>'
go

/* 
 * TABLE: BD_MODULE 
 */

CREATE TABLE BD_MODULE(
    OID            varchar(50)      NOT NULL,
    MODULE_NAME    varchar(100)     NULL,
    MODULE_DESC    varchar(2000)    NULL,
    WORKLOAD       int              NULL,
    UPDATE_USER    varchar(50)      NULL,
    UPDATE_TIME    datetime         NULL,
    STATUS         varchar(20)      NULL,
    CONSTRAINT PK_BD_MODULE PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('BD_MODULE') IS NOT NULL
    PRINT '<<< CREATED TABLE BD_MODULE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE BD_MODULE >>>'
go

/* 
 * TABLE: BD_TEST_CASE 
 */

CREATE TABLE BD_TEST_CASE(
    OID            varchar(50)      NOT NULL,
    MODULE         varchar(50)      NOT NULL,
    SN             int              NULL,
    CASE_NAME      varchar(100)     NULL,
    CASE_DESC      varchar(2000)    NULL,
    UPDATE_USER    varchar(50)      NULL,
    UPDATE_TIME    datetime         NULL,
    STATUS         varchar(20)      NULL,
    CONSTRAINT PK_BD_TEST_CASE PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('BD_TEST_CASE') IS NOT NULL
    PRINT '<<< CREATED TABLE BD_TEST_CASE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE BD_TEST_CASE >>>'
go

/* 
 * TABLE: BD_USER 
 */

CREATE TABLE BD_USER(
    OID          varchar(50)     NOT NULL,
    USER_TYPE    varchar(200)    NULL,
    USER_NAME    varchar(100)    NULL,
    PASSWORD     varchar(20)     NULL,
    CONSTRAINT PK_BD_USER PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('BD_USER') IS NOT NULL
    PRINT '<<< CREATED TABLE BD_USER >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE BD_USER >>>'
go

/* 
 * TABLE: BD_BUG 
 */

ALTER TABLE BD_BUG ADD CONSTRAINT RefBD_MODULE15 
    FOREIGN KEY (MODULE)
    REFERENCES BD_MODULE(OID)
go


/* 
 * TABLE: BD_BUG_IMAGES 
 */

ALTER TABLE BD_BUG_IMAGES ADD CONSTRAINT RefBD_BUG12 
    FOREIGN KEY (BUG)
    REFERENCES BD_BUG(OID)
go


/* 
 * TABLE: BD_TEST_CASE 
 */

ALTER TABLE BD_TEST_CASE ADD CONSTRAINT RefBD_MODULE7 
    FOREIGN KEY (MODULE)
    REFERENCES BD_MODULE(OID)
go



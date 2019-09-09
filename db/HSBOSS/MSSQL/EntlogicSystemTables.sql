/*
 * ER/Studio 8.0 SQL Code Generation
 * Company :      Octopus
 * Project :      entlogic.DM1
 * Author :       John
 *
 * Date Created : Monday, July 29, 2019 17:50:04
 * Target DBMS : Microsoft SQL Server 2008
 */

/* 
 * TABLE: CM_CATALOG 
 */

CREATE TABLE CM_CATALOG(
    OID            varchar(50)      NOT NULL,
    OWNER          varchar(50)      NULL,
    PARENT_OID     varchar(50)      NULL,
    ORDER_CODE     varchar(50)      NULL,
    COLUMN_TYPE    varchar(50)      NULL,
    COLUMN_NAME    varchar(100)     NULL,
    HEAD           varchar(100)     NULL,
    SUBHEAD        varchar(100)     NULL,
    START_TIME     datetime         NULL,
    END_TIME       datetime         NULL,
    URL            varchar(100)     NULL,
    NOTE           varchar(2000)    NULL,
    STATUS         varchar(50)      NULL,
    FULL_TEXT      text             NULL,
    CONSTRAINT PK1 PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('CM_CATALOG') IS NOT NULL
    PRINT '<<< CREATED TABLE CM_CATALOG >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE CM_CATALOG >>>'
go

/* 
 * TABLE: CM_CONTENT 
 */

CREATE TABLE CM_CONTENT(
    OID             varchar(50)      NOT NULL,
    CM_CATALOG      varchar(50)      NOT NULL,
    SN              int              NULL,
    CONTENT_TYPE    varchar(50)      NULL,
    CONTENT_NAME    varchar(100)     NULL,
    HEAD            varchar(100)     NULL,
    SUBHEAD         varchar(100)     NULL,
    START_TIME      datetime         NULL,
    END_TIME        datetime         NULL,
    URL             varchar(100)     NULL,
    SRC             varchar(100)     NULL,
    NOTE            varchar(2000)    NULL,
    STATUS          varchar(50)      NULL,
    FULL_TEXT       text             NULL,
    CONSTRAINT PK2 PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('CM_CONTENT') IS NOT NULL
    PRINT '<<< CREATED TABLE CM_CONTENT >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE CM_CONTENT >>>'
go

/* 
 * TABLE: FW_CODE 
 */

CREATE TABLE FW_CODE(
    OID              varchar(50)     NOT NULL,
    CODE_TYPE_OID    varchar(50)     NOT NULL,
    ORDER_CODE       varchar(100)    NULL,
    CODE             varchar(20)     NULL,
    CODE_NAME        varchar(100)    NULL,
    DESCRIPTION      varchar(256)    NULL,
    CONSTRAINT PK_FW_CODE PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('FW_CODE') IS NOT NULL
    PRINT '<<< CREATED TABLE FW_CODE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE FW_CODE >>>'
go

/* 
 * TABLE: FW_CODE_TYPE 
 */

CREATE TABLE FW_CODE_TYPE(
    OID            varchar(50)      NOT NULL,
    SN             int              NULL,
    TYPE_CODE      varchar(50)      NULL,
    TYPE_NAME      varchar(50)      NULL,
    DESCRIPTION    varchar(2000)    NULL,
    CONSTRAINT PK_FW_CODE_TYPE PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('FW_CODE_TYPE') IS NOT NULL
    PRINT '<<< CREATED TABLE FW_CODE_TYPE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE FW_CODE_TYPE >>>'
go

/* 
 * TABLE: FW_DOC_CATALOG 
 */

CREATE TABLE FW_DOC_CATALOG(
    OID            varchar(50)     NOT NULL,
    ORDER_CODE     varchar(100)    NULL,
    TITLE          varchar(100)    NULL,
    URL            varchar(100)    NULL,
    AUTHOR         varchar(100)    NULL,
    UPDATE_DATE    datetime        NULL,
    CONSTRAINT PK12 PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('FW_DOC_CATALOG') IS NOT NULL
    PRINT '<<< CREATED TABLE FW_DOC_CATALOG >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE FW_DOC_CATALOG >>>'
go

/* 
 * TABLE: FW_GROUP 
 */

CREATE TABLE FW_GROUP(
    OID            varchar(50)      NOT NULL,
    PARENT_OID     varchar(50)      NOT NULL,
    ORDER_CODE     varchar(64)      NULL,
    GROUP_CODE     varchar(50)      NULL,
    GROUP_NAME     varchar(64)      NOT NULL,
    SHORT_NAME     varchar(32)      NULL,
    GROUP_TYPE     varchar(32)      NULL,
    IS_ACTIVE      int              DEFAULT 1 NULL,
    DESCRIPTION    varchar(4000)    NULL,
    CONSTRAINT PK_FW_GROUP PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('FW_GROUP') IS NOT NULL
    PRINT '<<< CREATED TABLE FW_GROUP >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE FW_GROUP >>>'
go

/* 
 * TABLE: FW_GROUP_APP 
 */

CREATE TABLE FW_GROUP_APP(
    OID            varchar(50)    NOT NULL,
    GROUP_OID      varchar(50)    NOT NULL,
    APPLICATION    varchar(50)    NULL,
    CONSTRAINT PK18 PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('FW_GROUP_APP') IS NOT NULL
    PRINT '<<< CREATED TABLE FW_GROUP_APP >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE FW_GROUP_APP >>>'
go

/* 
 * TABLE: FW_LOG 
 */

CREATE TABLE FW_LOG(
    OID               varchar(50)      NOT NULL,
    LOG_APP           varchar(128)     NULL,
    LOG_COMMAND       varchar(128)     NULL,
    LOG_PARAMS        varchar(4000)    NULL,
    LOG_DETAILS       varchar(4000)    NULL,
    LOG_TIME          datetime         NULL,
    LOG_RESULT        varchar(50)      NULL,
    LOG_USER_ID       varchar(50)      NULL,
    LOG_USER_NAME     varchar(50)      NULL,
    LOG_HOST          varchar(128)     NULL,
    LOG_GROUP_ID      varchar(50)      NULL,
    LOG_GROUP_NAME    varchar(64)      NULL,
    CONSTRAINT PK_FW_LOG PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('FW_LOG') IS NOT NULL
    PRINT '<<< CREATED TABLE FW_LOG >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE FW_LOG >>>'
go

/* 
 * TABLE: FW_MENU 
 */

CREATE TABLE FW_MENU(
    OID            varchar(128)    NOT NULL,
    PARENT_OID     varchar(128)    NULL,
    ORDER_CODE     varchar(64)     NULL,
    MENU_TYPE      varchar(64)     NULL,
    MENU_ICON      varchar(256)    NULL,
    MENU_NAME      varchar(256)    NULL,
    APPLICATION    varchar(128)    NULL,
    CONSTRAINT PK_FW_MENU PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('FW_MENU') IS NOT NULL
    PRINT '<<< CREATED TABLE FW_MENU >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE FW_MENU >>>'
go

/* 
 * TABLE: FW_PARAMETER 
 */

CREATE TABLE FW_PARAMETER(
    OID            varchar(32)      NOT NULL,
    PARAM_GROUP    varchar(32)      NULL,
    ORDER_CODE     varchar(50)      NULL,
    PARAM_KEY      varchar(1024)    NULL,
    PARAM_VALUE    varchar(4000)    NULL,
    PARAM_TYPE     varchar(32)      NULL,
    DESCRIPTION    varchar(4000)    NULL,
    CONSTRAINT PK_FW_PARAMETER PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('FW_PARAMETER') IS NOT NULL
    PRINT '<<< CREATED TABLE FW_PARAMETER >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE FW_PARAMETER >>>'
go

/* 
 * TABLE: FW_ROLE 
 */

CREATE TABLE FW_ROLE(
    OID            varchar(32)      NOT NULL,
    GROUP_OID      varchar(50)      NOT NULL,
    SN             int              NULL,
    ROLE_NAME      varchar(64)      NOT NULL,
    DESCRIPTION    varchar(4000)    NULL,
    CONSTRAINT PK_FW_ROLE PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('FW_ROLE') IS NOT NULL
    PRINT '<<< CREATED TABLE FW_ROLE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE FW_ROLE >>>'
go

/* 
 * TABLE: FW_ROLE_AUTHORIZATION 
 */

CREATE TABLE FW_ROLE_AUTHORIZATION(
    OID         varchar(32)     NOT NULL,
    ROLE_OID    varchar(32)     NOT NULL,
    MENU_OID    varchar(128)    NOT NULL,
    CONSTRAINT PK_FW_ROLE_CMD_AUTH PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('FW_ROLE_AUTHORIZATION') IS NOT NULL
    PRINT '<<< CREATED TABLE FW_ROLE_AUTHORIZATION >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE FW_ROLE_AUTHORIZATION >>>'
go

/* 
 * TABLE: FW_USER 
 */

CREATE TABLE FW_USER(
    OID                varchar(50)      NOT NULL,
    GROUP_OID          varchar(50)      NOT NULL,
    USER_NAME          varchar(32)      NOT NULL,
    PASSWORD           varchar(64)      NOT NULL,
    USER_CODE          varchar(50)      NULL,
    REAL_NAME          varchar(128)     NULL,
    PY                 varchar(32)      NULL,
    PIC                varchar(256)     NULL,
    SEX                int              DEFAULT 1 NULL,
    TEL                varchar(32)      NULL,
    MOB                varchar(32)      NULL,
    EMAIL              varchar(256)     NULL,
    DESCRIPTION        varchar(4000)    NULL,
    IS_ACTIVE          int              DEFAULT 1 NULL,
    THEME              varchar(1024)    NULL,
    BINDING_DEVICES    varchar(256)     NULL,
    CONSTRAINT PK_FW_USER PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('FW_USER') IS NOT NULL
    PRINT '<<< CREATED TABLE FW_USER >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE FW_USER >>>'
go

/* 
 * TABLE: FW_USER_AUTHORIZATION 
 */

CREATE TABLE FW_USER_AUTHORIZATION(
    OID         varchar(32)    NOT NULL,
    USER_OID    varchar(50)    NOT NULL,
    ROLE_OID    varchar(32)    NOT NULL,
    CONSTRAINT PK_FW_USER_ROLE_AUTH PRIMARY KEY NONCLUSTERED (OID)
)
go



IF OBJECT_ID('FW_USER_AUTHORIZATION') IS NOT NULL
    PRINT '<<< CREATED TABLE FW_USER_AUTHORIZATION >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE FW_USER_AUTHORIZATION >>>'
go

/* 
 * TABLE: CM_CONTENT 
 */

ALTER TABLE CM_CONTENT ADD CONSTRAINT RefCM_CATALOG11 
    FOREIGN KEY (CM_CATALOG)
    REFERENCES CM_CATALOG(OID)
go


/* 
 * TABLE: FW_CODE 
 */

ALTER TABLE FW_CODE ADD CONSTRAINT FK_FW_CODE_CODE_TYPE 
    FOREIGN KEY (CODE_TYPE_OID)
    REFERENCES FW_CODE_TYPE(OID)
go


/* 
 * TABLE: FW_GROUP_APP 
 */

ALTER TABLE FW_GROUP_APP ADD CONSTRAINT RefFW_GROUP13 
    FOREIGN KEY (GROUP_OID)
    REFERENCES FW_GROUP(OID)
go


/* 
 * TABLE: FW_ROLE 
 */

ALTER TABLE FW_ROLE ADD CONSTRAINT RefFW_GROUP16 
    FOREIGN KEY (GROUP_OID)
    REFERENCES FW_GROUP(OID)
go


/* 
 * TABLE: FW_ROLE_AUTHORIZATION 
 */

ALTER TABLE FW_ROLE_AUTHORIZATION ADD CONSTRAINT FK_FW_AUTH_CMD_ROLE 
    FOREIGN KEY (ROLE_OID)
    REFERENCES FW_ROLE(OID)
go

ALTER TABLE FW_ROLE_AUTHORIZATION ADD CONSTRAINT FK_FW_ROLE_AYTH 
    FOREIGN KEY (MENU_OID)
    REFERENCES FW_MENU(OID)
go


/* 
 * TABLE: FW_USER 
 */

ALTER TABLE FW_USER ADD CONSTRAINT FK_FW_USER_GROUP 
    FOREIGN KEY (GROUP_OID)
    REFERENCES FW_GROUP(OID)
go


/* 
 * TABLE: FW_USER_AUTHORIZATION 
 */

ALTER TABLE FW_USER_AUTHORIZATION ADD CONSTRAINT FK_FW_AUTH_ROLE_USER 
    FOREIGN KEY (USER_OID)
    REFERENCES FW_USER(OID)
go

ALTER TABLE FW_USER_AUTHORIZATION ADD CONSTRAINT FK_FW_AUTH_USER_ROLE 
    FOREIGN KEY (ROLE_OID)
    REFERENCES FW_ROLE(OID)
go



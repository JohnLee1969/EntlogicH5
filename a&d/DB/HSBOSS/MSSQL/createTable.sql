/*
 * ER/Studio 8.0 SQL Code Generation
 * Company :      Microsoft
 * Project :      HSBOSS.DM1
 * Author :       Microsoft
 *
 * Date Created : Sunday, June 30, 2019 14:51:19
 * Target DBMS : Microsoft SQL Server 2008
 */

/* 
 * TABLE: HS_ACCESSORY 
 */

CREATE TABLE HS_ACCESSORY(
    OID            varchar(50)     NOT NULL,
    BIZ_OID        varchar(50)     NULL,
    SN             int             NULL,
    NAME           varchar(100)    NULL,
    FILE_TYPE      varchar(50)     NULL,
    FILE_PATH      varchar(200)    NULL,
    CREATE_TIME    datetime        NULL,
    CONSTRAINT PK53 PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_ACCESSORY') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_ACCESSORY >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_ACCESSORY >>>'
go

/* 
 * TABLE: HS_BILL 
 */

CREATE TABLE HS_BILL(
    OID            varchar(50)       NOT NULL,
    HS_ORDER       varchar(50)       NOT NULL,
    BILL_TIME      datetime          NULL,
    CHARGE_TYPE    varchar(50)       NULL,
    SUBJECT        varchar(50)       NULL,
    UNIT           varchar(50)       NULL,
    CURRENCY       varchar(50)       NULL,
    RATE           numeric(10, 2)    NULL,
    QUANTITY       numeric(10, 2)    NULL,
    SUM            numeric(10, 2)    NULL,
    NOTE           varchar(256)      NULL,
    STATUS         varchar(50)       NULL,
    CONSTRAINT PK_HS_BILL PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_BILL') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_BILL >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_BILL >>>'
go

/* 
 * TABLE: HS_CODE 
 */

CREATE TABLE HS_CODE(
    OID             varchar(50)     NOT NULL,
    HS_CODE_TYPE    varchar(50)     NULL,
    ORDER_CODE      varchar(100)    NULL,
    CODE            varchar(20)     NULL,
    CODE_NAME       varchar(100)    NULL,
    DESCRIPTION     varchar(256)    NULL,
    CONSTRAINT PK_HS_CODE PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_CODE') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_CODE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_CODE >>>'
go

/* 
 * TABLE: HS_CODE_TYPE 
 */

CREATE TABLE HS_CODE_TYPE(
    OID            varchar(50)      NOT NULL,
    SN             int              NULL,
    TYPE_CODE      varchar(50)      NULL,
    TYPE_NAME      varchar(50)      NULL,
    DESCRIPTION    varchar(2000)    NULL,
    CONSTRAINT PK_HS_CODE_TYPE PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_CODE_TYPE') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_CODE_TYPE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_CODE_TYPE >>>'
go

/* 
 * TABLE: HS_CUSTOMER 
 */

CREATE TABLE HS_CUSTOMER(
    OID                  varchar(50)      NOT NULL,
    OWNER                varchar(50)      NULL,
    CERT_TYPE            varchar(50)      NULL,
    CERT_CODE            varchar(50)      NULL,
    NAME                 varchar(256)     NULL,
    SEX                  varchar(2)       NULL,
    BIRTHDAY             date             NULL,
    NATIONALITY          varchar(50)      NULL,
    NATIVE_AREA          varchar(50)      NULL,
    NATIVE_ADDRESS       varchar(256)     NULL,
    NATIVE_PHONE         varchar(128)     NULL,
    WORKPLACE_NATION     varchar(50)      NULL,
    WORKPLACE_AREA       varchar(50)      NULL,
    WORKPLACE_ADDRESS    varchar(256)     NULL,
    WORKPLACE_PHONE      varchar(128)     NULL,
    PROFFESION           varchar(512)     NULL,
    NOTE                 varchar(1024)    NULL,
    CREATE_TIME          datetime         NULL,
    FULL_TEXT            varchar(2000)    NULL,
    CONSTRAINT PK_HS_CUSTOMER PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_CUSTOMER') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_CUSTOMER >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_CUSTOMER >>>'
go

/* 
 * TABLE: HS_ENTERPRISE 
 */

CREATE TABLE HS_ENTERPRISE(
    OID                       varchar(50)       NOT NULL,
    OWNER                     varchar(50)       NULL,
    CREDIT_CODE               varchar(50)       NULL,
    REGION_CODE               varchar(50)       NULL,
    NAME                      varchar(512)      NULL,
    MASTER_TYPE               varchar(50)       NULL,
    REGISTERED_CAPITAL        numeric(10, 3)    NULL,
    REGIST_DATE               date              NULL,
    BUSINESS_TERM             varchar(50)       NULL,
    REGISTRATION_AUTHORITY    varchar(256)      NULL,
    REGISTERED_ADDRESS        varchar(512)      NULL,
    BUSINESS_SCOPE            varchar(1024)     NULL,
    LEGAL_PERSON              varchar(256)      NULL,
    LP_CERT_TYPE              varchar(50)       NULL,
    LP_CERT_CODE              varchar(50)       NULL,
    POST                      varchar(50)       NULL,
    EMAIL                     varchar(100)      NULL,
    TEL                       varchar(50)       NULL,
    NOTE                      varchar(1024)     NULL,
    STATUS                    varchar(50)       NULL,
    LON                       varchar(100)      NULL,
    LAT                       varchar(100)      NULL,
    FULL_TEXT                 varchar(2000)     NULL,
    CONSTRAINT PK_HS_ENTERPRISE PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_ENTERPRISE') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_ENTERPRISE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_ENTERPRISE >>>'
go

/* 
 * TABLE: HS_ENTERPRISE_ILLEGAL 
 */

CREATE TABLE HS_ENTERPRISE_ILLEGAL(
    OID                   varchar(50)      NOT NULL,
    HS_ENTERPRISE         varchar(50)      NOT NULL,
    ILLEGAL_TYPE          varchar(50)      NULL,
    ILLEGAL_DATE          date             NULL,
    ILLEGAL_BEHAVIOR      varchar(1024)    NULL,
    ARBITRATOR            varchar(50)      NULL,
    ARBITRATE_DATE        date             NULL,
    ARBITRATION_RESULT    varchar(1024)    NULL,
    EXECUTOR              varchar(128)     NULL,
    EXECUTE_DATE          date             NULL,
    EXECUTION_RESULT      varchar(1024)    NULL,
    NOTE                  varchar(1024)    NULL,
    STATUS                varchar(50)      NULL,
    CREATE_TIME           datetime         NULL,
    FULL_TEXT             varchar(2000)    NULL,
    CONSTRAINT PK_HS_WORKER_ILLEGAL PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_ENTERPRISE_ILLEGAL') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_ENTERPRISE_ILLEGAL >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_ENTERPRISE_ILLEGAL >>>'
go

/* 
 * TABLE: HS_FAVOURABLE 
 */

CREATE TABLE HS_FAVOURABLE(
    OID                varchar(50)       NOT NULL,
    HS_SERVICE         varchar(50)       NOT NULL,
    START_TIME         datetime          NULL,
    END_TIME           datetime          NULL,
    FAVOURABLE_TYPE    varchar(50)       NULL,
    DESCRITION         varchar(2000)     NULL,
    LIMIT              numeric(10, 2)    NULL,
    NOTE               varchar(2000)     NULL,
    CREATE_TIME        datetime          NULL,
    FULL_TEXT          varchar(2000)     NULL,
    CONSTRAINT PK_HS_FAVOURABLE PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_FAVOURABLE') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_FAVOURABLE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_FAVOURABLE >>>'
go

/* 
 * TABLE: HS_LABOUR_CONTRACT 
 */

CREATE TABLE HS_LABOUR_CONTRACT(
    OID              varchar(50)      NOT NULL,
    HS_ENTERPRISE    varchar(50)      NOT NULL,
    HS_WORKER        varchar(50)      NOT NULL,
    START_DATE       date             NULL,
    END_DATE         date             NULL,
    NOTE             varchar(1024)    NULL,
    CONSTRAINT PK_HS_LABOUR_CONTRACT PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_LABOUR_CONTRACT') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_LABOUR_CONTRACT >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_LABOUR_CONTRACT >>>'
go

/* 
 * TABLE: HS_ORDER 
 */

CREATE TABLE HS_ORDER(
    OID                varchar(50)      NOT NULL,
    HS_SERVICE         varchar(50)      NOT NULL,
    HS_CUTOMER         varchar(50)      NOT NULL,
    ORDER_TIME         datetime         NULL,
    START_TIME_P       datetime         NULL,
    END_TIME_P         datetime         NULL,
    SERVICE_ADDRESS    varchar(128)     NULL,
    SERVICE_NEEDS      varchar(256)     NULL,
    ACCEP_TIME         datetime2(7)     NULL,
    ACCEPTOR_NUM       varchar(50)      NULL,
    ACCEPTOR_NAME      varchar(128)     NULL,
    ACCEPTOR_TEL       varchar(50)      NULL,
    DISPATCH_TIME      datetime         NULL,
    CONFIRM_TIME       datetime         NULL,
    START_TIME_A       datetime         NULL,
    END_TIME_A         datetime         NULL,
    CANCEL_TIME        datetime         NULL,
    CANCEL_RESON       varchar(256)     NULL,
    NOTE               varchar(2000)    NOT NULL,
    STATUS             varchar(50)      NULL,
    FULL_TEXT          varchar(2000)    NULL,
    CONSTRAINT PK_HS_ORDER PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_ORDER') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_ORDER >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_ORDER >>>'
go

/* 
 * TABLE: HS_PAYMENT 
 */

CREATE TABLE HS_PAYMENT(
    OID            varchar(50)       NOT NULL,
    HS_ORDER       varchar(50)       NOT NULL,
    PAYING_TIME    datetime          NULL,
    SUBJECT        varchar(50)       NULL,
    PAYING_TYPE    varchar(50)       NULL,
    ACCOUNT        varchar(50)       NULL,
    CURRENCY       varchar(50)       NULL,
    AMOUNT         numeric(10, 2)    NULL,
    STATUS         varchar(50)       NULL,
    CONSTRAINT PK_HS_PAYMENT PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_PAYMENT') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_PAYMENT >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_PAYMENT >>>'
go

/* 
 * TABLE: HS_PROVIDE_CONTRACT 
 */

CREATE TABLE HS_PROVIDE_CONTRACT(
    OID                varchar(50)       NOT NULL,
    HS_ENTERPRISE      varchar(50)       NOT NULL,
    HS_SERVICE         varchar(50)       NOT NULL,
    START_TIME         datetime          NULL,
    END_TIME           datetime          NULL,
    [COMMISSION RATE]  numeric(10, 2)    NULL,
    NOTE               varchar(2000)     NULL,
    CONSTRAINT PK56 PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_PROVIDE_CONTRACT') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_PROVIDE_CONTRACT >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_PROVIDE_CONTRACT >>>'
go

/* 
 * TABLE: HS_SERVICE 
 */

CREATE TABLE HS_SERVICE(
    OID                varchar(50)      NOT NULL,
    OWNER              varchar(50)      NULL,
    HS_SERVICE_TYPE    varchar(50)      NOT NULL,
    ANOTHER_NAMER      varchar(100)     NULL,
    SERVICE_DESC       varchar(2000)    NULL,
    START_TIME         datetime         NULL,
    END_TIME           datetime         NULL,
    NOTE               varchar(2000)    NULL,
    STATUS             varchar(50)      NULL,
    CREATE_TIME        datetime         NULL,
    FULL_TEXT          varchar(2000)    NULL,
    CONSTRAINT PK_HS_SERVICE PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_SERVICE') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_SERVICE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_SERVICE >>>'
go

/* 
 * TABLE: HS_SERVICE_LOCATION 
 */

CREATE TABLE HS_SERVICE_LOCATION(
    OID            varchar(10)       NOT NULL,
    HS_CUSTOMER    varchar(50)       NOT NULL,
    NATION         varchar(50)       NULL,
    AREA           varchar(50)       NULL,
    ADDRESS        varchar(128)      NULL,
    LON            numeric(10, 5)    NULL,
    LAT            numeric(10, 5)    NULL,
    CONSTRAINT PK_HS_SERVICE_LOCATION PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_SERVICE_LOCATION') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_SERVICE_LOCATION >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_SERVICE_LOCATION >>>'
go

/* 
 * TABLE: HS_SERVICE_RATE 
 */

CREATE TABLE HS_SERVICE_RATE(
    OID            varchar(50)       NOT NULL,
    HS_SERVICE     varchar(50)       NOT NULL,
    START_TIME     datetime          NULL,
    END_TIME       datetime2(7)      NULL,
    CHARGE_TYPE    varchar(50)       NULL,
    UNIT           varchar(50)       NULL,
    CURRENCY       varchar(50)       NULL,
    RATE           numeric(10, 2)    NULL,
    PREPAY         numeric(10, 2)    NULL,
    NOTE           varchar(2000)     NULL,
    CREATE_TIME    datetime          NULL,
    FULL_TEXT      varchar(2000)     NULL,
    CONSTRAINT PK_HS_SERVICE_RATE PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_SERVICE_RATE') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_SERVICE_RATE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_SERVICE_RATE >>>'
go

/* 
 * TABLE: HS_SERVICE_TYPE 
 */

CREATE TABLE HS_SERVICE_TYPE(
    OID           varchar(50)      NOT NULL,
    PARENT_OID    varchar(50)      NULL,
    ORDER_CODE    varchar(50)      NULL,
    TYPE_CODE     varchar(50)      NULL,
    TYPE_NAME     varchar(128)     NULL,
    PROMPT        varchar(100)     NULL,
    ICON          varchar(100)     NULL,
    DSCRIPTION    varchar(2000)    NULL,
    CONSTRAINT PK_HS_SERVICE_TYPE PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_SERVICE_TYPE') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_SERVICE_TYPE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_SERVICE_TYPE >>>'
go

/* 
 * TABLE: HS_WORK_ORDER 
 */

CREATE TABLE HS_WORK_ORDER(
    OID                varchar(50)    NOT NULL,
    HS_ORDER           varchar(50)    NOT NULL,
    HS_WORKER          varchar(50)    NOT NULL,
    CHECKIN_TIME       datetime       NULL,
    CHECKOUT_TIME      datetime       NULL,
    ETIQUETTE_LEVEL    int            NULL,
    ATTITUDE_LEVEL     int            NULL,
    EFFICENCY_LEVEL    int            NULL,
    SKILL_LEVEL        int            NULL,
    RESULT             varchar(50)    NULL,
    STATUS             varchar(50)    NULL,
    CONSTRAINT PK_HS_WORK_ORDER PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_WORK_ORDER') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_WORK_ORDER >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_WORK_ORDER >>>'
go

/* 
 * TABLE: HS_WORKER 
 */

CREATE TABLE HS_WORKER(
    OID                  varchar(50)       NOT NULL,
    OWNER                varchar(50)       NULL,
    CERT_TYPE            varchar(50)       NULL,
    CERT_CODE            varchar(50)       NULL,
    NAME                 varchar(256)      NULL,
    SEX                  varchar(50)       NULL,
    BIRTHDAY             date              NULL,
    NATIONALITY          varchar(50)       NULL,
    NATIVE_AREA          varchar(50)       NULL,
    NATIVE_ADDRESS       varchar(256)      NULL,
    WORKPLACE_NATION     varchar(50)       NULL,
    WORKPLACE_AREA       varchar(50)       NULL,
    WORKPLACE_ADDRESS    varchar(256)      NULL,
    PHONE                varchar(128)      NULL,
    FROM_START_YEAR      int               NULL,
    SKILL                varchar(256)      NULL,
    LANGUAGE             varchar(256)      NULL,
    NOTE                 varchar(1024)     NULL,
    HEAD_PIC             varchar(50)       NULL,
    LON                  numeric(10, 5)    NULL,
    LAT                  numeric(10, 5)    NULL,
    CREATE_TIME          datetime          NULL,
    FULL_TEXT            varchar(2000)     NULL,
    CONSTRAINT PK_HS_WORKER PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_WORKER') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_WORKER >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_WORKER >>>'
go

/* 
 * TABLE: HS_WORKER_ILLEGAL 
 */

CREATE TABLE HS_WORKER_ILLEGAL(
    OID                   varchar(50)      NOT NULL,
    HS_WORKER             varchar(50)      NOT NULL,
    ILLEGAL_TYPE          varchar(50)      NULL,
    ILLEGAL_DATE          date             NULL,
    ILLEGAL_BEHAVIOR      varchar(1024)    NULL,
    ARBITRATOR            varchar(50)      NULL,
    ARBITRATE_DATE        date             NULL,
    ARBITRATION_RESULT    varchar(1024)    NULL,
    EXECUTOR              varchar(128)     NULL,
    EXECUTE_DATE          date             NULL,
    EXECUTION_RESULT      varchar(1024)    NULL,
    NOTE                  varchar(1024)    NULL,
    STATUS                varchar(50)      NULL,
    CREATE_TIME           datetime         NULL,
    FULL_TEXT             varchar(2000)    NULL,
    CONSTRAINT PK_HS_ENTERPRISE_ILLEGAL PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_WORKER_ILLEGAL') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_WORKER_ILLEGAL >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_WORKER_ILLEGAL >>>'
go

/* 
 * TABLE: HS_WORKER_LICENCE 
 */

CREATE TABLE HS_WORKER_LICENCE(
    OID               varchar(50)     NOT NULL,
    HS_WORKER         varchar(50)     NOT NULL,
    CERT_TYPE         varchar(50)     NULL,
    CERT_CODE         varchar(50)     NULL,
    EFFECTIVE_DATE    date            NULL,
    EXPIRY_DATE       date            NULL,
    ISSUING_ORG       varchar(256)    NULL,
    ISSUING_DATE      date            NULL,
    NOTE              varchar(512)    NULL,
    CONSTRAINT PK_HS_WORKER_LICENCE PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_WORKER_LICENCE') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_WORKER_LICENCE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_WORKER_LICENCE >>>'
go

/* 
 * TABLE: HS_WORKER_LOCATION 
 */

CREATE TABLE HS_WORKER_LOCATION(
    OID          varchar(50)       NOT NULL,
    HS_WORKER    varchar(50)       NOT NULL,
    LON          numeric(10, 5)    NULL,
    LAT          numeric(10, 5)    NULL,
    CONSTRAINT PK_HS_WORKER_LOCATION PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_WORKER_LOCATION') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_WORKER_LOCATION >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_WORKER_LOCATION >>>'
go

/* 
 * TABLE: HS_WORKER_MER 
 */

CREATE TABLE HS_WORKER_MER(
    OID          varchar(50)     NOT NULL,
    HS_WORKER    varchar(50)     NOT NULL,
    MEC          varchar(100)    NULL,
    ME_DATE      date            NULL,
    RESULT       varchar(50)     NULL,
    NOTE         varchar(512)    NULL,
    CONSTRAINT PK_HS_WORKER_MER PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_WORKER_MER') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_WORKER_MER >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_WORKER_MER >>>'
go

/* 
 * TABLE: HS_WORKER_RELATIVES 
 */

CREATE TABLE HS_WORKER_RELATIVES(
    OID             varchar(50)     NOT NULL,
    HS_WORKER       varchar(50)     NOT NULL,
    RELATIONSHIP    varchar(50)     NULL,
    CERT_TYPE       varchar(50)     NULL,
    CERT_NUMBER     varchar(50)     NULL,
    NAME            varchar(512)    NULL,
    SEX             varchar(50)     NULL,
    BIRTHDAY        date            NULL,
    PHONE           varchar(100)    NULL,
    ADDRESS         varchar(512)    NULL,
    NOTE            varchar(512)    NULL,
    CONSTRAINT PK_HS_WORKER_RELATIVES PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_WORKER_RELATIVES') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_WORKER_RELATIVES >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_WORKER_RELATIVES >>>'
go

/* 
 * TABLE: HS_WORKER_SERVICE 
 */

CREATE TABLE HS_WORKER_SERVICE(
    OID                 varchar(50)     NOT NULL,
    HS_WORKER           varchar(50)     NOT NULL,
    HS_SERVICE          varchar(50)     NOT NULL,
    PRIORITY            int             NULL,
    SYS_DISPATCH        int             NULL,
    SELF_COMPETITION    int             NULL,
    NOTE                varchar(256)    NULL,
    CONSTRAINT PK58 PRIMARY KEY CLUSTERED (OID)
)
go



IF OBJECT_ID('HS_WORKER_SERVICE') IS NOT NULL
    PRINT '<<< CREATED TABLE HS_WORKER_SERVICE >>>'
ELSE
    PRINT '<<< FAILED CREATING TABLE HS_WORKER_SERVICE >>>'
go

/* 
 * TABLE: HS_BILL 
 */

ALTER TABLE HS_BILL ADD CONSTRAINT RefHS_ORDER78 
    FOREIGN KEY (HS_ORDER)
    REFERENCES HS_ORDER(OID)
go


/* 
 * TABLE: HS_CODE 
 */

ALTER TABLE HS_CODE ADD CONSTRAINT RefHS_CODE_TYPE82 
    FOREIGN KEY (HS_CODE_TYPE)
    REFERENCES HS_CODE_TYPE(OID)
go


/* 
 * TABLE: HS_ENTERPRISE_ILLEGAL 
 */

ALTER TABLE HS_ENTERPRISE_ILLEGAL ADD CONSTRAINT RefHS_ENTERPRISE69 
    FOREIGN KEY (HS_ENTERPRISE)
    REFERENCES HS_ENTERPRISE(OID)
go


/* 
 * TABLE: HS_FAVOURABLE 
 */

ALTER TABLE HS_FAVOURABLE ADD CONSTRAINT RefHS_SERVICE77 
    FOREIGN KEY (HS_SERVICE)
    REFERENCES HS_SERVICE(OID)
go


/* 
 * TABLE: HS_LABOUR_CONTRACT 
 */

ALTER TABLE HS_LABOUR_CONTRACT ADD CONSTRAINT RefHS_ENTERPRISE80 
    FOREIGN KEY (HS_ENTERPRISE)
    REFERENCES HS_ENTERPRISE(OID)
go

ALTER TABLE HS_LABOUR_CONTRACT ADD CONSTRAINT RefHS_WORKER81 
    FOREIGN KEY (HS_WORKER)
    REFERENCES HS_WORKER(OID)
go


/* 
 * TABLE: HS_ORDER 
 */

ALTER TABLE HS_ORDER ADD CONSTRAINT RefHS_CUSTOMER67 
    FOREIGN KEY (HS_CUTOMER)
    REFERENCES HS_CUSTOMER(OID)
go

ALTER TABLE HS_ORDER ADD CONSTRAINT RefHS_SERVICE68 
    FOREIGN KEY (HS_SERVICE)
    REFERENCES HS_SERVICE(OID)
go


/* 
 * TABLE: HS_PAYMENT 
 */

ALTER TABLE HS_PAYMENT ADD CONSTRAINT RefHS_ORDER79 
    FOREIGN KEY (HS_ORDER)
    REFERENCES HS_ORDER(OID)
go


/* 
 * TABLE: HS_PROVIDE_CONTRACT 
 */

ALTER TABLE HS_PROVIDE_CONTRACT ADD CONSTRAINT RefHS_SERVICE85 
    FOREIGN KEY (HS_SERVICE)
    REFERENCES HS_SERVICE(OID)
go

ALTER TABLE HS_PROVIDE_CONTRACT ADD CONSTRAINT RefHS_ENTERPRISE86 
    FOREIGN KEY (HS_ENTERPRISE)
    REFERENCES HS_ENTERPRISE(OID)
go


/* 
 * TABLE: HS_SERVICE 
 */

ALTER TABLE HS_SERVICE ADD CONSTRAINT RefHS_SERVICE_TYPE64 
    FOREIGN KEY (HS_SERVICE_TYPE)
    REFERENCES HS_SERVICE_TYPE(OID)
go


/* 
 * TABLE: HS_SERVICE_LOCATION 
 */

ALTER TABLE HS_SERVICE_LOCATION ADD CONSTRAINT RefHS_CUSTOMER66 
    FOREIGN KEY (HS_CUSTOMER)
    REFERENCES HS_CUSTOMER(OID)
go


/* 
 * TABLE: HS_SERVICE_RATE 
 */

ALTER TABLE HS_SERVICE_RATE ADD CONSTRAINT RefHS_SERVICE65 
    FOREIGN KEY (HS_SERVICE)
    REFERENCES HS_SERVICE(OID)
go


/* 
 * TABLE: HS_WORK_ORDER 
 */

ALTER TABLE HS_WORK_ORDER ADD CONSTRAINT RefHS_WORKER70 
    FOREIGN KEY (HS_WORKER)
    REFERENCES HS_WORKER(OID)
go

ALTER TABLE HS_WORK_ORDER ADD CONSTRAINT RefHS_ORDER71 
    FOREIGN KEY (HS_ORDER)
    REFERENCES HS_ORDER(OID)
go


/* 
 * TABLE: HS_WORKER_ILLEGAL 
 */

ALTER TABLE HS_WORKER_ILLEGAL ADD CONSTRAINT RefHS_WORKER76 
    FOREIGN KEY (HS_WORKER)
    REFERENCES HS_WORKER(OID)
go


/* 
 * TABLE: HS_WORKER_LICENCE 
 */

ALTER TABLE HS_WORKER_LICENCE ADD CONSTRAINT RefHS_WORKER72 
    FOREIGN KEY (HS_WORKER)
    REFERENCES HS_WORKER(OID)
go


/* 
 * TABLE: HS_WORKER_LOCATION 
 */

ALTER TABLE HS_WORKER_LOCATION ADD CONSTRAINT RefHS_WORKER74 
    FOREIGN KEY (HS_WORKER)
    REFERENCES HS_WORKER(OID)
go


/* 
 * TABLE: HS_WORKER_MER 
 */

ALTER TABLE HS_WORKER_MER ADD CONSTRAINT RefHS_WORKER75 
    FOREIGN KEY (HS_WORKER)
    REFERENCES HS_WORKER(OID)
go


/* 
 * TABLE: HS_WORKER_RELATIVES 
 */

ALTER TABLE HS_WORKER_RELATIVES ADD CONSTRAINT RefHS_WORKER73 
    FOREIGN KEY (HS_WORKER)
    REFERENCES HS_WORKER(OID)
go


/* 
 * TABLE: HS_WORKER_SERVICE 
 */

ALTER TABLE HS_WORKER_SERVICE ADD CONSTRAINT RefHS_SERVICE89 
    FOREIGN KEY (HS_SERVICE)
    REFERENCES HS_SERVICE(OID)
go

ALTER TABLE HS_WORKER_SERVICE ADD CONSTRAINT RefHS_WORKER90 
    FOREIGN KEY (HS_WORKER)
    REFERENCES HS_WORKER(OID)
go



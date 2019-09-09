/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 应用的根目录
var applicationRoot = getUrlParam("applicationRoot");

//应用的根目录
var sessionId = getUrlParam("sessionId");

//本页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    
var dboHS_WORKER = null;
var dboHS_WORKER_LICENCE = null;
var dboHS_ACCESSORY_PIC = null;
var dboHS_ACCESSORY_VIDEO = null;
var dboHS_WORKER_AUDIT = null;
var dboHS_WORKER_AUDIT = null;
var dtMedal = null;



/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明
var lstMedal = null;
var lstLicence = null;
var lstPic = null;
var lstVideo = null;

var imgHeadPic = null;
var lblName = null;
var lblAge = null;
var lblMaritalStatus = null;
var lblWorkingYear = null;
var lblTotalPoints =null;
var lblNationality = null;
var lblNativeArea = null;
var lblSex = null;
var lblMarriage = null;
var lblNation = null;
var lblConstellation = null;
var lblReligion = null;
var lblZodiac = null;
var lblHeight = null;
var lblWeight = null;


var imgIdCardStatus = null;
var lblIdCardStatus = null;
var imgDishonestyStatus = null;
var lblDishonestyStatus = null;
var imgPhoneStatus = null;
var lblPhoneStatus = null;
var imgHealthStatus = null;
var lblHealthStatus = null;

var lblSkill = null;
var lblLanguage = null;



/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var workerOid = null;



/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
    dboHS_WORKER_LICENCE = new entlogic_dbo("HSBOSS", "HS_WORKER_LICENCE");
    dboHS_ACCESSORY_PIC = new entlogic_dbo("HSBOSS", "HS_ACCESSORY");
    dboHS_ACCESSORY_VIDEO = new entlogic_dbo("HSBOSS", "HS_ACCESSORY");
    dboHS_WORKER_AUDIT = new entlogic_dbo("HSBOSS", "HS_WORKER_AUDIT");
    
    dtMedal = new entlogic_data_table();
    
    lstMedal = new entlogic_mui_list("lstMedal", formControls);
    lstMedal.setBindingData(dtMedal);
    
    lstLicence = new entlogic_mui_list("lstLicence", formControls);
    lstLicence.setBindingData(dboHS_WORKER_LICENCE.dataTable);
        
    lstPic = new entlogic_mui_list("lstPic", formControls);
    lstPic.setBindingData(dboHS_ACCESSORY_PIC.dataTable);
    
    lstVideo = new entlogic_mui_list("lstVideo", formControls);
    lstVideo.setBindingData(dboHS_ACCESSORY_VIDEO.dataTable);
 
    imgHeadPic = new entlogic_mui_image("imgHeadPic", formControls);
    imgHeadPic.setBindingData(dboHS_WORKER.dataTable, "HEAD_PIC");
    
    lblName = new entlogic_mui_output("lblName", formControls);
    lblName.setBindingData(dboHS_WORKER.dataTable, "NAME");
    
    lblAge = new entlogic_mui_output("lblAge", formControls);
    lblAge.setBindingData(dboHS_WORKER.dataTable, "AGE");
    
    lblMaritalStatus =  new entlogic_mui_output("lblMaritalStatus", formControls);
    lblMaritalStatus.setBindingData(dboHS_WORKER.dataTable, "MARITAL_STATUS_TEXT");
    
    lblWorkingYear = new entlogic_mui_output("lblWorkingYear", formControls);
    
    lblTotalPoints = new entlogic_mui_output("lblTotalPoints", formControls);
    lblTotalPoints.setBindingData(dboHS_WORKER.dataTable, "TOTAL_POINTS");

    lblNationality = new entlogic_mui_output("lblNationality", formControls);
    lblNationality.setBindingData(dboHS_WORKER.dataTable, "NATIONALITY_TEXT");

    lblNativeArea = new entlogic_mui_output("lblNativeArea", formControls);
    lblNativeArea.setBindingData(dboHS_WORKER.dataTable, "NATIVE_AREA_TEXT");

    lblSex = new entlogic_mui_output("lblSex", formControls);
    lblSex.setBindingData(dboHS_WORKER.dataTable, "SEX_TEXT");

    lblMarriage = new entlogic_mui_output("lblMarriage", formControls);
    lblMarriage.setBindingData(dboHS_WORKER.dataTable, "MARRIAGE_TEXT");
    
    lblNation = new entlogic_mui_output("lblNation", formControls);
    lblNation.setBindingData(dboHS_WORKER.dataTable, "NATION_TEXT");

    lblConstellation = new entlogic_mui_output("lblConstellation", formControls);

    lblReligion = new entlogic_mui_output("lblReligion", formControls);
    lblReligion.setBindingData(dboHS_WORKER.dataTable, "RELIGION_TEXT");

    lblZodiac = new entlogic_mui_output("lblZodiac", formControls);

    lblHeight = new entlogic_mui_output("lblHeight", formControls);
    lblHeight.setBindingData(dboHS_WORKER.dataTable, "HEIGHT");

    lblWeight = new entlogic_mui_output("lblWeight", formControls);
    lblWeight.setBindingData(dboHS_WORKER.dataTable, "WEIGHT");
    
    lblLanguage = new entlogic_mui_output("lblLanguage", formControls);
    lblLanguage.setBindingData(dboHS_WORKER.dataTable, "LANGUAGE_TEXT");
    
    lblSkill = new entlogic_mui_output("lblSkill", formControls);
    lblSkill.setBindingData(dboHS_WORKER.dataTable, "SKILL_TEXT");
    
	// 初始化交互组件
    $("#btnBack").click(btnBack_click);
    $("#btnEdit").click(btnEdit_click);
};

// 加载服务人员数据
function loadWorker() {
    // 查询获取数据
	dboHS_WORKER.whereClause = "where OID = '" + workerOid + "'";
	dboHS_WORKER.execQuery();
    var dt =dboHS_WORKER.dataTable;
    if (dt != null&& dt.getSize() > 0) {
        var dr = dt.getRecord(0);
        var birthday=dr.getValue("BIRTHDAY");
        lblConstellation.setValue(EntlogicUtilCalendar.getAstro(birthday));
        lblZodiac.setValue(EntlogicUtilCalendar.getAnimal(birthday));
    }
    
    if(imgHeadPic.getValue()===null||imgHeadPic.getValue()==='')
    {
       imgHeadPic.setValue("../../app_resources/HSBOSS_E.mob/images/head.jpg");
    }
    
    dboHS_WORKER_LICENCE.whereClause = "where HS_WORKER = '" + workerOid + "' ";
    dboHS_WORKER_LICENCE.orderByClause = " order by CERT_TYPE  ";
	dboHS_WORKER_LICENCE.execQuery();
    
    dboHS_ACCESSORY_PIC.whereClause = "where (FILE_TYPE ='jpg' or FILE_TYPE ='jpeg' or FILE_TYPE ='png') and BIZ_OID = '" + workerOid + "' ";
	dboHS_ACCESSORY_PIC.orderByClause = " order by SN  ";
	dboHS_ACCESSORY_PIC.execQuery();
    
   	dboHS_ACCESSORY_VIDEO.whereClause = "where (FILE_TYPE ='avi' or FILE_TYPE ='mp4' or FILE_TYPE ='flv' or FILE_TYPE ='rmvb' or FILE_TYPE ='rm' or FILE_TYPE ='mov') and BIZ_OID = '" + workerOid + "' ";
	dboHS_ACCESSORY_VIDEO.orderByClause = " order by SN  ";
	dboHS_ACCESSORY_VIDEO.execQuery();
    $(".video-box").attr("controls", "controls");
    
    dboHS_WORKER_AUDIT.whereClause = "where HS_WORKER = '" + workerOid + "'";
    dboHS_WORKER_LICENCE.orderByClause = " order by CREATE_TIME desc  ";
	dboHS_WORKER_AUDIT.execQuery();
    var dtWorkerAudit = dboHS_WORKER_AUDIT.dataTable;
    if(dtWorkerAudit.getSize()>0)
    {
        var drWorkerAudit=dtWorkerAudit.getRecord(0);
        getResultImg(drWorkerAudit.getValue("CERT_AUDIT_STA"),"iconIdCardStatus","lblIdCardStatus");
        getResultImg(drWorkerAudit.getValue("MOBILE_AUDIT_STATUS"),"iconDishonestyStatus","lblDishonestyStatus");
        getResultImg(drWorkerAudit.getValue("CREDIT_AUDIT_STA"),"iconPhoneStatus","lblPhoneStatus");
    }
    
    var dtHealth = new entlogic_data_table();
    
    var dba = new entlogic_dba("jdbc/entlogic");
    var mydate = new Date();
    var currentDate=mydate.getFullYear();//获取完整的年份(4位,1970-????)
    var month=mydate.getMonth(); //获取当前月份(0-11,0代表1月)
    currentDate+="-"+(month>9?'0':"")+month;
    currentDate+="-"+mydate.getDate(); //获取当前日(1-31)
    dba.SQL = "select OID from HS_WORKER_LICENCE where HS_WORKER = '" + workerOid + "' and CERT_TYPE='00' and (EXPIRY_DATE='1900-01-01' or EXPIRY_DATE>='"+currentDate+"')";
    dtHealth = dba.execQuery();
    if(dtHealth.getSize()>0)
    {
        getResultImg("1","iconHealthStatus","lblHealthStatus");
    }
    else
    {
    	getResultImg("0","iconHealthStatus","lblHealthStatus");
    }
};

function getResultImg(result,imgResult,lblResult)
{
    if(result==="1")
    {
        $("#"+imgResult).html("");
        $("#"+imgResult).addClass("icon-circle-green");
        $("#"+lblResult).html("通过");
        $("#"+lblResult).addClass(" hsboss-color-green");
    }
    else
    {
        $("#"+imgResult).html("");
        $("#"+imgResult).addClass("icon-circle-orange");
        $("#"+lblResult).html("异常");
        $("#"+lblResult).addClass(" hsboss-color-gray");
    }
};

// 加载服务人员荣誉勋章数据
function loadMedal() {
    // 查询获取数据
	var dba = new entlogic_dba("jdbc/entlogic");
    
    var sql = "select OID as id";
    sql += " ,dbo.hsCodeToText('SVS_TYP', SERVICE_TYPE) as SERVICE_TYPE_TEXT ";
    sql += " ,dbo.hsCodeToText('WKR_MDL', MEDAL_TYPE) as MEDAL_TYPE_TEXT ";
    sql += " ,(select IMAGE_ICON from HS_CODE where  HS_CODE_TYPE = 'WKR_MDL' and CODE = MEDAL_TYPE) as MEDAL_ICON_PATH ";
    sql += " from HS_WORKER_MEDALS";
    sql += " where HS_WORKER = '" + workerOid + "'";
    dba.SQL = sql;
    var result = dba.execQuery(); 
    if(result.getSize() <= 0)
    {
        dba = new entlogic_dba("jdbc/entlogic");
        sql = "select top 4 OID as id";
        sql += " ,CODE_NAME as SERVICE_TYPE_TEXT ";
        sql += " ,'' as MEDAL_TYPE_TEXT ";
        sql += " ,(select IMAGE_ICON from HS_CODE where  HS_CODE_TYPE = 'WKR_MDL' and CODE = '00') as MEDAL_ICON_PATH ";
        sql += " from HS_CODE";
        sql += " where HS_CODE_TYPE = 'SVS_TYP' order by ORDER_CODE";
        dba.SQL = sql;
        result = dba.execQuery(); 
    }
    dtMedal.loadXML(dba.execQuery().toXML());
    dtMedal.synchronizeLayout();
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化
    // 接受传递参数
	workerOid = getUrlParam("workerOid");
	loadWorker();
    loadMedal();
};


// 添加服务人员数据
function btnBack_click() {
	jumpTo("WorkerForm.html");
};

// 编辑服务人员数据
function btnEdit_click() {
	jumpTo("WorkerEditForm.html?workerOid=" + workerOid);
};


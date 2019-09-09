/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 全局应用
var application = parent.application;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

//本页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明  
var dtCodeChgTyp = null;
var dtCodeMsrUnt = null;
var dtCodeCrcTyp = null;
var dboHS_SERVICE_RATE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var dtStartTime = null;
var dtEndTime = null;
var selChargeType = null;
var selUnit = null;
var selCurrency = null;
var numRate = null;
var numPrepay = null;
var txtNote = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var serviceOid = getUrlParam("serviceOid");
var serviceRateOid = getUrlParam("serviceRateOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");
    
    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'CHG_TYP' order by ORDER_CODE";
    dtCodeChgTyp = dba.execQuery(); 
    
    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'MSR_UNT' order by ORDER_CODE";
	dtCodeMsrUnt = dba.execQuery();
    
    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'CRC_TYP' order by ORDER_CODE";
	dtCodeCrcTyp = dba.execQuery();
    
    dboHS_SERVICE_RATE = new entlogic_dbo("HSBOSS", "HS_SERVICE_RATE");
    
   
	// 初始化交互组件
    dtStartTime = new entlogic_ui_datetime("dtStartTime", formControls);
    dtStartTime.setBindingData(dboHS_SERVICE_RATE.dataTable, "START_TIME");
    dtStartTime.setShowTime(true);
   
    dtEndTime = new entlogic_ui_datetime("dtEndTime", formControls);
    dtEndTime.setBindingData(dboHS_SERVICE_RATE.dataTable, "END_TIME");
    dtEndTime.setShowTime(true);
    
    selChargeType = new entlogic_ui_select("selChargeType", formControls);
    selChargeType.setBindingData(dboHS_SERVICE_RATE.dataTable, "CHARGE_TYPE");
    selChargeType.setOptionsData(dtCodeChgTyp);
    
    selUnit = new entlogic_ui_select("selUnit", formControls);
    selUnit.setBindingData(dboHS_SERVICE_RATE.dataTable, "UNIT");
    selUnit.setOptionsData(dtCodeMsrUnt);
    
    selCurrency = new entlogic_ui_select("selCurrency", formControls);
    selCurrency.setBindingData(dboHS_SERVICE_RATE.dataTable, "CURRENCY");
    selCurrency.setOptionsData(dtCodeCrcTyp);
    
    numRate = new entlogic_ui_number("numRate", formControls);
    numRate.setBindingData(dboHS_SERVICE_RATE.dataTable, "RATE");
    
    numPrepay = new entlogic_ui_number("numPrepay", formControls);
    numPrepay.setBindingData(dboHS_SERVICE_RATE.dataTable, "PREPAY");
    
    txtNote = new entlogic_ui_textarea("txtNote", formControls);
    txtNote.setBindingData(dboHS_SERVICE_RATE.dataTable, "NOTE");
   
    $("#btnSave").click(btnSave_click);
    OK = btnSave_click;
};

// 加载编码数据
function loadData() {
	// 查询获取数据
	if (serviceRateOid == null) {
        var dr = dboHS_SERVICE_RATE.execCreate();
        dr.setItem("HS_SERVICE", serviceOid);
        dboHS_SERVICE_RATE.dataTable.addRecord(dr);
        dboHS_SERVICE_RATE.dataTable.setSelectedIndex(0);
	} else {
		dboHS_SERVICE_RATE.whereClause = "where OID='" + serviceRateOid + "'";
        dboHS_SERVICE_RATE.orderByClause = "order by START_TIME";
		dboHS_SERVICE_RATE.execQuery();
   }
};

// 保存数据
function saveData() {
    var dr = dboHS_SERVICE_RATE.dataTable.getRecord(0);
    var oid = dr.getValue("id");
    if (serviceRateOid == null) {
		dr.setItem("OID", oid);
        dr.setItem("HS_SERVICE", serviceOid);
        dboHS_SERVICE_RATE.execInsert();
    } else {
        dboHS_SERVICE_RATE.execUpdate();
    }   
};

// 数据检查
function checkData() {
    // 检查结果
    var result = true;
    var prompt = "错误提示：";
    
    // 检查用户名冲突
    /*
    txtUserName.setErrMessage("");
    txtUserName.setErrMessage("");
    if (txtUserName.getValue() == "") {
        txtUserName.setErrMessage("登陆账号不能为空！！");
        prompt += "\n登陆账号不能为空！！";
        result = result & false;
    }
    var currentUser = dboFW_USER.dataTable.getRecord(0);
    if (currentUser.getValue("OID") == "" && dboFW_USER.getByOid(txtUserName.getValue()) != null) {
        txtUserName.setErrMessage("登录账号已存在！！");
        prompt += "\n登录账号已存在！！";
        result = result & false;
    }
    */
    
    // 弹出提示框
    if (!result) {
        alert(prompt);
    }
    
    return result;
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadData();
};

// 保存按钮单击事件响应
function btnSave_click() {
	// 数据检查
    if (!checkData()) return;
    
    // 保存数据
	saveData();

    // 返回父窗口
	dialogCallBack(serviceRateOid);
    closeDialog();
};

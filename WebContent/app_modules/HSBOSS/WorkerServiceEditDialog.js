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
var dtCodeWKR_TOT = null;
var dboHS_WORKER = null;
var dboHS_SERVICE = null;
var dboHS_SERVICE_RATE = null;
var dboHS_WORKER_SERVICE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lkpWorker = null;
var lkpService = null;
var selPriority = null;
var selTakingType = null;
var numMinRate = null;
var lblRateCurrency = null;
var lblRateUnit = null;
var numMinQuantity = null;
var lblQuantityUnit = null;
var numMaxDistance = null;
var txtNote = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var workerOid = getUrlParam("workerOid");
var serviceOid = getUrlParam("serviceOid");
var workerServiceOid = getUrlParam("workerServiceOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");

    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'WKR_TOT' order by ORDER_CODE";
    dtCodeWKR_TOT = dba.execQuery();

    dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
    dboHS_SERVICE = new entlogic_dbo("HSBOSS", "HS_SERVICE");
    dboHS_SERVICE_RATE = new entlogic_dbo("HSBOSS", "HS_SERVICE_RATE");
    dboHS_WORKER_SERVICE = new entlogic_dbo("HSBOSS", "HS_WORKER_SERVICE");
   
	// 初始化交互组件
    lkpWorker = new entlogic_ui_lookup("lkpWorker", formControls);
    lkpWorker.setBindingData(dboHS_WORKER_SERVICE.dataTable, "HS_WORKER", "HS_WORKER_TEXT");
    lkpWorker.lookupDialogUrl = "../HSBOSS/WorkerLookup.html";
   
    lkpService = new entlogic_ui_lookup("lkpService", formControls);
    lkpService.setBindingData(dboHS_WORKER_SERVICE.dataTable, "HS_SERVICE", "HS_SERVICE_TEXT");
    lkpService.lookupDialogUrl = "../HSBOSS/ServiceLookup.html";
    lkpService.change = function() { loadServiceRate();}
    
	selPriority = new entlogic_ui_select("selPriority", formControls);
    selPriority.setBindingData(dboHS_WORKER_SERVICE.dataTable, "PRIORITY");
    selPriority.setValue("1");
    
	selTakingType = new entlogic_ui_select("selTakingType", formControls);
    selTakingType.setBindingData(dboHS_WORKER_SERVICE.dataTable, "TAKING_TYPE");
    selTakingType.setOptionsData(dtCodeWKR_TOT);
    
	numMinRate = new entlogic_ui_number("numMinRate", formControls);
    numMinRate.setBindingData(dboHS_WORKER_SERVICE.dataTable, "MIN_RATE");
    
    lblRateCurrency = new entlogic_ui_output("lblRateCurrency", formControls);
    lblRateCurrency.setBindingData(dboHS_SERVICE_RATE.dataTable, "CURRENCY_TEXT");
    
    lblRateUnit = new entlogic_ui_output("lblRateUnit", formControls);
    lblRateUnit.setBindingData(dboHS_SERVICE_RATE.dataTable, "UNIT_TEXT");
    
	numMinQuantity = new entlogic_ui_number("numMinQuantity", formControls);
    numMinQuantity.setBindingData(dboHS_WORKER_SERVICE.dataTable, "MIN_QUANTITY");
    
    lblQuantityUnit = new entlogic_ui_output("lblQuantityUnit", formControls);
    lblQuantityUnit.setBindingData(dboHS_SERVICE_RATE.dataTable, "UNIT_TEXT");
    
	numMaxDistance = new entlogic_ui_number("numMaxDistance", formControls);
    numMaxDistance.setBindingData(dboHS_WORKER_SERVICE.dataTable, "MAX_DISTANCE");
   
    txtNote = new entlogic_ui_textarea("txtNote", formControls);
    txtNote.setBindingData(dboHS_WORKER_SERVICE.dataTable, "NOTE");
   
    $("#btnSave").click(btnSave_click);
};

// 加载数据
function loadData() {
    if (workerServiceOid == null) {
      	var drNew = dboHS_WORKER_SERVICE.execCreate();
        drNew.setItem("HS_WORKER", workerOid);
      	drNew.setItem("HS_SERVICE", serviceOid);
      	dboHS_WORKER_SERVICE.dataTable.addRecord(drNew);
      	dboHS_WORKER_SERVICE.dataTable.setSelectedIndex(0);
        if (workerOid != null) {
            var drWorker = dboHS_WORKER.getByOid(workerOid);
            if (drWorker != null) {
                lkpWorker.setValue(drWorker.getValue("OID"));
                lkpWorker.setText(drWorker.getValue("NAME"));
            }
        }
        if (serviceOid != null) {
            var drService = dboHS_WORKER.getByOid(serviceOid);
            if (drService != null) {
                lkpService.setValue(drWorker.getValue("OID"));
                lkpService.setText(drWorker.getValue("ANTHERNAMER"));
            }
        }
    }
    else {
        dboHS_WORKER_SERVICE.whereClause = "where OID = '" + workerServiceOid + "'";
        dboHS_WORKER_SERVICE.execQuery();
        var workerService = dboHS_WORKER_SERVICE.dataTable.getRecord(0);
        serviceOid = workerService.getValue("HS_SERVICE");
        workerOid = workerService.getValue("HS_WORKER");
    }
    
    loadServiceRate();
};

// 加载服务价格
function loadServiceRate() {
    dboHS_SERVICE_RATE.whereClause = "where HS_SERVICE='" + serviceOid + "'";
    dboHS_SERVICE_RATE.orderByClause = "order by START_TIME desc";
    dboHS_SERVICE_RATE.execQuery();
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

// 保存数据
function saveData() {
	if (workerServiceOid == null) {
        var dr = dboHS_WORKER_SERVICE.dataTable.getRecord(0);
        workerServiceOid = dr.getValue("id");
        dr.setItem("OID", workerServiceOid);
		dboHS_WORKER_SERVICE.execInsert();
	} else {
		dboHS_WORKER_SERVICE.execUpdate();
	}
}

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
    // 检查数据合法性
    if (!checkData()) return;
    
    // 保存数据
    saveData();
	
	// 返回父窗口
	dialogCallBack(workerServiceOid);
    closeDialog();
};

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
var dboHS_PROVIDE_CONTRACT = null;
var dboHS_SERVICE_RATE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lkpService = null;
var numServiceRate = null;
var lblRateCurrency = null;
var lblRateUnit = null;
var numEnterpriseComm = null;
var lblECCurrency = null;
var lblECUnit = null;
var numPlatformComm = null;
var lblPCCurrency = null;
var lblPCUnit = null;
var dtStartTime = null;
var dtEndTime = null;
var txtNote = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var enterpriseOid = getUrlParam("enterpriseOid");
var provideContractOid = getUrlParam("provideContractOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    dboHS_SERVICE_RATE = new entlogic_dbo("HSBOSS", "HS_SERVICE_RATE");
   
	// 初始化交互组件
    lkpService = new entlogic_ui_lookup("lkpService", formControls);
    lkpService.setBindingData(dboHS_PROVIDE_CONTRACT.dataTable, "HS_SERVICE", "SERVICE_NAME");
	lkpService.lookupDialogUrl = "../HSBOSS/ServiceLookup.html";    
    lkpService.changed = lkpService_changed;
    
    numServiceRate = new entlogic_ui_number("numServiceRate", formControls);
    numServiceRate.setBindingData(dboHS_SERVICE_RATE.dataTable, "RATE");
    
    lblRateCurrency = new entlogic_ui_output("lblRateCurrency", formControls);
    lblRateCurrency.setBindingData(dboHS_SERVICE_RATE.dataTable, "CURRENCY_TEXT");
    
    lblRateUnit = new entlogic_ui_output("lblRateUnit", formControls);
    lblRateUnit.setBindingData(dboHS_SERVICE_RATE.dataTable, "UNIT_TEXT");
    
    numEnterpriseComm = new entlogic_ui_number("numEnterpriseComm", formControls);
    numEnterpriseComm.setBindingData(dboHS_PROVIDE_CONTRACT.dataTable, "ENTERPRISE_COMM");
    
    lblECCurrency = new entlogic_ui_output("lblECCurrency", formControls);
    lblECCurrency.setBindingData(dboHS_SERVICE_RATE.dataTable, "CURRENCY_TEXT");
    
    lblECUnit = new entlogic_ui_output("lblECUnit", formControls);
    lblECUnit.setBindingData(dboHS_SERVICE_RATE.dataTable, "UNIT_TEXT");
    
    numPlatformComm = new entlogic_ui_number("numPlatformComm", formControls);
    numPlatformComm.setBindingData(dboHS_PROVIDE_CONTRACT.dataTable, "PLATFORM_COMM");
    
    lblPCCurrency = new entlogic_ui_output("lblPCCurrency", formControls);
    lblPCCurrency.setBindingData(dboHS_SERVICE_RATE.dataTable, "CURRENCY_TEXT");
    
    lblPCUnit = new entlogic_ui_output("lblPCUnit", formControls);
    lblPCUnit.setBindingData(dboHS_SERVICE_RATE.dataTable, "UNIT_TEXT");
    
    dtStartTime = new entlogic_ui_datetime("dtStartTime", formControls);
    dtStartTime.setBindingData(dboHS_PROVIDE_CONTRACT.dataTable, "START_TIME");
    
    dtEndTime = new entlogic_ui_datetime("dtEndTime", formControls);
    dtEndTime.setBindingData(dboHS_PROVIDE_CONTRACT.dataTable, "END_TIME");
    
    txtNote = new entlogic_ui_text("txtNote", formControls);
    txtNote.setBindingData(dboHS_PROVIDE_CONTRACT.dataTable, "NOTE");
   
    $("#btnSave").click(btnSave_click);
};

// 加载数据
function loadData() {
    if (provideContractOid == null) {
      	var drNew = dboHS_PROVIDE_CONTRACT.execCreate();
      	dboHS_PROVIDE_CONTRACT.dataTable.addRecord(drNew);
      	dboHS_PROVIDE_CONTRACT.dataTable.setSelectedIndex(0);
    } else {
        dboHS_PROVIDE_CONTRACT.whereClause = "where OID = '" + provideContractOid + "'";
        dboHS_PROVIDE_CONTRACT.execQuery();
    }
    
    if (provideContractOid != null) {
        var drProvideContract = dboHS_PROVIDE_CONTRACT.dataTable.getRecord(0);
        dboHS_SERVICE_RATE.whereClause = "where HS_SERVICE = '" + drProvideContract.getValue("HS_SERVICE") + "'";
        dboHS_SERVICE_RATE.orderByClause = "order by START_TIME desc";
        dboHS_SERVICE_RATE.execQuery();
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

// 保存数据
function saveData() {
	if (provideContractOid == null) {
        var dr = dboHS_PROVIDE_CONTRACT.dataTable.getRecord(0);
        provideContractOid = dr.getValue("id");
        dr.setItem("OID", provideContractOid);
        dr.setItem("HS_ENTERPRISE", enterpriseOid);
		dboHS_PROVIDE_CONTRACT.execInsert();
	} else {
		dboHS_PROVIDE_CONTRACT.execUpdate();
	}
    return true;
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

// 选定服务变更
function lkpService_changed() {
    var serviceOid = lkpService.getValue();
    dboHS_SERVICE_RATE.whereClause = "where HS_SERVICE = '" + serviceOid + "'";
    dboHS_SERVICE_RATE.orderByClause = "order by START_TIME desc";
    dboHS_SERVICE_RATE.execQuery();  
};

// 保存按钮单击事件响应
function btnSave_click() { 
    // 保存数据
    saveData();
    
    // 检查数据合法性
    if (!checkData()) return;
	
	// 返回父窗口
	dialogCallBack(provideContractOid);
    closeDialog();
};

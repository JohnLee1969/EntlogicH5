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
var dtCodeSVS_TYP = null;
var dboHS_SERVICE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lkpServiceType = null;
var txtAnotherNamer = null;
var dtStartTime = null;
var dtEndTime = null;
var txtServiceDesc = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var pageScale = 1;
var serviceType = getUrlParam("serviceType");
var serviceOid = getUrlParam("serviceOid");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");
   
    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'SVS_TYP' order by ORDER_CODE";
    dtCodeSVS_TYP = dba.execQuery();

    dboHS_SERVICE = new entlogic_dbo("HSBOSS", "HS_SERVICE");
	
	// 初始化交互组件
    selServiceType = new entlogic_ui_select("selServiceType", formControls);
    selServiceType.setBindingData(dboHS_SERVICE.dataTable, "SERVICE_TYPE");
    selServiceType.setOptionsData(dtCodeSVS_TYP);
    
    txtAnotherNamer = new entlogic_ui_text("txtAnotherNamer", formControls);
    txtAnotherNamer.setBindingData(dboHS_SERVICE.dataTable, "ANOTHER_NAMER");
    
	dtStartTime = new entlogic_ui_datetime("dtStartTime", formControls);
    dtStartTime.setShowTime(true);
    dtStartTime.setBindingData(dboHS_SERVICE.dataTable, "START_TIME");
   
	dtEndTime = new entlogic_ui_datetime("dtEndTime", formControls);
    dtEndTime.setShowTime(true);
    dtEndTime.setBindingData(dboHS_SERVICE.dataTable, "END_TIME");
           
    txtServiceDesc = new entlogic_ui_textarea("txtServiceDesc", formControls);
    txtServiceDesc.setBindingData(dboHS_SERVICE.dataTable, "SERVICE_DESC");
    
	$("#btnRestore").click(btnRestore_click);
	$("#btnZoomUp").click(btnZoomUp_click);
	$("#btnZoomDown").click(btnZoomDown_click);
	$("#btnFixHeight").click(btnFixHeight_click);
	$("#btnFixWidth").click(btnFixWidth_click);
	//setDraggable($("#divPage"), pageScale);
    
    $("#btnSave").click(btnSave_click);
};

// 加载服务数据
function loadService() {
    // 查询获取数据
	if (serviceOid == null) {
        var dr = dboHS_SERVICE.execCreate();
        dr.setItem("SERVICE_TYPE", serviceType);
        dboHS_SERVICE.dataTable.addRecord(dr);
        dboHS_SERVICE.dataTable.setSelectedIndex(0);
	} else {
		dboHS_SERVICE.whereClause = "where OID = '" + serviceOid + "'";
		dboHS_SERVICE.execQuery();
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

    // 加载数据
	loadService();
};

// 保存档案
function btnSave_click() {
	// 数据检查
    if (!checkData()) return;
    
    // 保存数据
    var dr = dboHS_SERVICE.dataTable.getRecord(0);
    if (serviceOid == null) {
		dr.setItem("OID", dr.getValue("id"));
        dboHS_SERVICE.execInsert();
    } else {
        dboHS_SERVICE.execUpdate();
    }   
    
    popUpMessage("数据保存成功！");
    if (typeof(parent.setDocTitle) != "undefined") parent.setDocTitle();
};


////////////////////////////////////////////////////////
// 档案页视图控制函数：系统自带建议用户不要自行更改。 //       
////////////////////////////////////////////////////////

// 页面放大
function btnZoomUp_click() {
	var page = $("#divPage");
	
	pageScale += 0.1;
	page.css("transform", "scale(" + pageScale + ")");
};

/**
 * 页面缩小
 */
function btnZoomDown_click() {
	var page = $("#divPage");
	
	pageScale -= 0.1;
	page.css("transform", "scale(" + pageScale + ")");
};

// 适应页高
function btnFixHeight_click() {
	var pageView = $("#divPageView");
	var page = $("#divPage");
    
	var pageWidth = page.width();
	var pageHeight = page.height();
	var pageViewWidth = pageView.width();
	var pageViewHeight = pageView.height();
	
	pageScale = (pageViewHeight * 0.90) / pageHeight;
	page.css("transform", "scale(" + pageScale + ")");
};

// 适应页宽
function btnFixWidth_click() {
	var pageView = $("#divPageView");
	var page = $("#divPage");
    
	var pageWidth = page.width();
	var pageHeight = page.height();
	var pageViewWidth = pageView.width();
	var pageViewHeight = pageView.height();
	
	pageScale = (pageView.width() * 0.90) / page.width();
	page.css("transform", "scale(" + pageScale + ")");
};

// 页面还原
function btnRestore_click() {
	var pageView = $("#divPageView");
	var page = $("#divPage");

	pageScale = 1;
	page.css("transform", "scale(" + pageScale + ")");
};

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
var dtCodeSEX = null;
var dtCodeCT = null;
var dtCodeNC = null;
var dtCodeCN_AD = null;
var dtCodeWS = null;
var dtCodeWL = null;

var dboHS_CUSTOMER = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtName = null;
var selSex = null;
var dtBirthday = null;
var selCertType = null;
var txtCertCode = null;
var lkpNationality = null;
var lkpNativeArea = null;
var txtNativeAddress = null;
var lkpWorkplaceNation = null;
var lkpWorkplaceArea = null;
var txtWorkplaceAddress = null;
var txtPhone = null;
var txtNote = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var pageScale = 1;
var customerOid = getUrlParam("customerOid");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");

    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'SEX' order by ORDER_CODE";
    dtCodeSEX = dba.execQuery();
    
    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'CT' order by ORDER_CODE";
	dtCodeCT = dba.execQuery();
    
    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'NC' order by ORDER_CODE";
	dtCodeNC = dba.execQuery();
    
    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'CN_AD' order by ORDER_CODE";
    dtCodeCN_AD = dba.execQuery();
    
    dba.SQL = "select CODE as id, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'WKR_SKL' order by ORDER_CODE";
	dtCodeWS = dba.execQuery();
    
    dba.SQL = "select CODE as id, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'WKR_LAN' order by ORDER_CODE";
	dtCodeWL = dba.execQuery();
    
	dboHS_CUSTOMER = new entlogic_dbo("HSBOSS", "HS_CUSTOMER");

	
	// 初始化交互组件
    txtName = new entlogic_ui_text("txtName", formControls);
    txtName.setBindingData(dboHS_CUSTOMER.dataTable, "NAME");
    
    selSex = new entlogic_ui_select("selSex", formControls);
    selSex.setOptionsData(dtCodeSEX);
    selSex.setBindingData(dboHS_CUSTOMER.dataTable, "SEX");
    
	dtBirthday = new entlogic_ui_datetime("dtBirthday", formControls);
    dtBirthday.setBindingData(dboHS_CUSTOMER.dataTable, "BIRTHDAY");
    
	selCertType = new entlogic_ui_select("selCertType", formControls);
    selCertType.setOptionsData(dtCodeCT);
    selCertType.setBindingData(dboHS_CUSTOMER.dataTable, "CERT_TYPE");
    
	txtCertCode = new entlogic_ui_text("txtCertCode", formControls);
    txtCertCode.setBindingData(dboHS_CUSTOMER.dataTable, "CERT_CODE");
    
	lkpNationality = new entlogic_ui_lookup("lkpNationality", formControls);
    lkpNationality.setBindingData(dboHS_CUSTOMER.dataTable, "NATIONALITY", "NATIONALITY");
    lkpNationality.lookupDialogUrl = "../entlogicSystem/CodeLookup.html?codeTypeOid=NC";
    
	lkpNativeArea = new entlogic_ui_lookup("lkpNativeArea", formControls);
    lkpNativeArea.setBindingData(dboHS_CUSTOMER.dataTable, "NATIVE_AREA", "NATIVE_AREA");
    lkpNativeArea.lookupDialogUrl = "../entlogicSystem/CodeLookup.html?codeTypeOid=CN_AD";
    
	txtNativeAddress = new entlogic_ui_text("txtNativeAddress", formControls);
    txtNativeAddress.setBindingData(dboHS_CUSTOMER.dataTable, "NATIVE_ADDRESS");
    
	lkpWorkplaceNation = new entlogic_ui_lookup("lkpWorkplaceNation", formControls);
    lkpWorkplaceNation.setBindingData(dboHS_CUSTOMER.dataTable, "WORKPLACE_NATION", "WORKPLACE_NATION");
    lkpWorkplaceNation.lookupDialogUrl = "../entlogicSystem/CodeLookup.html?codeTypeOid=NC";
    
	lkpWorkplaceArea = new entlogic_ui_lookup("lkpWorkplaceArea", formControls);
    lkpWorkplaceArea.setBindingData(dboHS_CUSTOMER.dataTable, "WORKPLACE_AREA", "WORKPLACE_AREA");
    lkpWorkplaceArea.lookupDialogUrl = "../entlogicSystem/CodeLookup.html?codeTypeOid=CN_AD";
    
	txtWorkplaceAddress = new entlogic_ui_text("txtWorkplaceAddress", formControls);
    txtWorkplaceAddress.setBindingData(dboHS_CUSTOMER.dataTable, "WORKPLACE_ADDRESS");
   
    txtPhone = new entlogic_ui_text("txtPhone", formControls);
    txtPhone.setBindingData(dboHS_CUSTOMER.dataTable, "WORKPLACE_PHONE");
    
    txtNote = new entlogic_ui_textarea("txtNote", formControls);
    txtNote.setBindingData(dboHS_CUSTOMER.dataTable, "NOTE");
   
    
	$("#btnRestore").click(btnRestore_click);
	$("#btnZoomUp").click(btnZoomUp_click);
	$("#btnZoomDown").click(btnZoomDown_click);
	$("#btnFixHeight").click(btnFixHeight_click);
	$("#btnFixWidth").click(btnFixWidth_click);
	//setDraggable($("#divPage"), pageScale);
    
    $("#btnSave").click(btnSave_click);
};

// 加载数据
function loadData() {
    // 查询获取数据
	if (customerOid == null) {
        var dr = dboHS_CUSTOMER.execCreate();
        dr.setItem("NAME", "新人");
        dboHS_CUSTOMER.dataTable.addRecord(dr);
        dboHS_CUSTOMER.dataTable.setSelectedIndex(0);
	} else {
		dboHS_CUSTOMER.whereClause = "where OID = '" + customerOid + "'";
		dboHS_CUSTOMER.execQuery();
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
    var dr = dboHS_CUSTOMER.dataTable.getRecord(0);
    if (customerOid == null) {
        customerOid = dr.getValue("id")
		dr.setItem("OID", customerOid);
        dboHS_CUSTOMER.execInsert();
    } else {
         dboHS_CUSTOMER.execUpdate();
    }   
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

// 保存档案
function btnSave_click() {
	// 数据检查
    if (!checkData()) return;
    
    // 保存数据
    var dr = dboHS_CUSTOMER.dataTable.getRecord(0);
	saveData();
    
    popUpMessage("数据保存成功！");
    if (typeof(parent.setDocTitle) != "undefined") {
        parent.customerOid = customerOid;
        parent.setDocTitle();
    }
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


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
var dboHS_ENTERPRISE = null;
var dtCodeEntSta = null;
var dtCodeCT = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtCreditCode = null;
var selStatus = null;
var txtName = null;
var numRegisteredCapital = null;
var dtRegistDate = null;
var lkpRegionCode = null;
var txtRegisteredAddress = null;
var txtLegalPerson = null;
var selLpCertType = null;
var txtLpCertCode = null;
var txtTel = null;
var txtEmail = null;
var txtBusinessScope = null;
var txtNote = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var pageScale = 1;
var enterpriseOid = getUrlParam("enterpriseOid");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");
    
    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'ENT_STA' order by ORDER_CODE";
    dtCodeEntSta = dba.execQuery(); 
    
    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'CT' order by ORDER_CODE";
	dtCodeCT = dba.execQuery();
    
    dboHS_ENTERPRISE = new entlogic_dbo("HSBOSS", "HS_ENTERPRISE");
	
	// 初始化交互组件
	txtCreditCode = new entlogic_ui_text("txtCreditCode", formControls);
    txtCreditCode.setBindingData(dboHS_ENTERPRISE.dataTable, "CREDIT_CODE");
    
	selStatus = new entlogic_ui_select("selStatus", formControls);
    selStatus.setBindingData(dboHS_ENTERPRISE.dataTable, "STATUS");
    selStatus.setOptionsData(dtCodeEntSta);
    selStatus.setEnabled(false);
    
	txtName = new entlogic_ui_text("txtName", formControls);
    txtName.setBindingData(dboHS_ENTERPRISE.dataTable, "NAME");
    
	numRegisteredCapital = new entlogic_ui_number("numRegisteredCapital", formControls);
    numRegisteredCapital.setBindingData(dboHS_ENTERPRISE.dataTable, "REGISTERED_CAPITAL");
    
    dtRegistDate = new entlogic_ui_datetime("dtRegistDate", formControls);
    dtRegistDate.setBindingData(dboHS_ENTERPRISE.dataTable, "REGIST_DATE");

	lkpRegionCode = new entlogic_ui_lookup("lkpRegionCode", formControls);
    lkpRegionCode.setBindingData(dboHS_ENTERPRISE.dataTable, "REGION_CODE", "REGION_TEXT");
    lkpRegionCode.lookupDialogUrl = "../entlogicSystem/CodeLookup.html?codeTypeOid=CN_AD";

    txtRegisteredAddress = new entlogic_ui_text("txtRegisteredAddress", formControls);
    txtRegisteredAddress.setBindingData(dboHS_ENTERPRISE.dataTable, "REGISTERED_ADDRESS");

	txtLegalPerson = new entlogic_ui_text("txtLegalPerson", formControls);
    txtLegalPerson.setBindingData(dboHS_ENTERPRISE.dataTable, "LEGAL_PERSON");

	selLpCertType = new entlogic_ui_select("selLpCertType", formControls);
    selLpCertType.setOptionsData(dtCodeCT);
    selLpCertType.setBindingData(dboHS_ENTERPRISE.dataTable, "LP_CERT_TYPE");

	txtLpCertCode = new entlogic_ui_text("txtLpCertCode", formControls);
    txtLpCertCode.setBindingData(dboHS_ENTERPRISE.dataTable, "LP_CERT_CODE");

    txtTel = new entlogic_ui_text("txtTel", formControls);
    txtTel.setBindingData(dboHS_ENTERPRISE.dataTable, "TEL");

    txtEmail = new entlogic_ui_text("txtEmail", formControls);
    txtEmail.setBindingData(dboHS_ENTERPRISE.dataTable, "EMAIL");

    txtBusinessScope = new entlogic_ui_textarea("txtBusinessScope", formControls);
    txtBusinessScope.setBindingData(dboHS_ENTERPRISE.dataTable, "BUSINESS_SCOPE");

    txtNote = new entlogic_ui_textarea("txtNote", formControls);
    txtNote.setBindingData(dboHS_ENTERPRISE.dataTable, "NOTE");
    
	$("#btnRestore").click(btnRestore_click);
	$("#btnZoomUp").click(btnZoomUp_click);
	$("#btnZoomDown").click(btnZoomDown_click);
	$("#btnFixHeight").click(btnFixHeight_click);
	$("#btnFixWidth").click(btnFixWidth_click);
	//setDraggable($("#divPage"), pageScale);
    
    $("#btnSave").click(btnSave_click);
};

// 加载数据
function loadEnterprise() {
    // 查询获取数据
	if (enterpriseOid == null) {
        var dr = dboHS_ENTERPRISE.execCreate();
        dr.setItem("CREDIT_CODE", "新企业编码");
        dr.setItem("NAME", "新企业");
        dboHS_ENTERPRISE.dataTable.addRecord(dr);
        dboHS_ENTERPRISE.dataTable.setSelectedIndex(0);
        dboHS_ENTERPRISE.dataTable.synchronizeLayout();
	} else {
		dboHS_ENTERPRISE.whereClause = "where OID='" + enterpriseOid + "'";
        dboHS_ENTERPRISE.orderByClause = "order by NAME";
		dboHS_ENTERPRISE.execQuery();
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
    loadEnterprise();
};

// 保存档案
function btnSave_click() {
	// 数据检查
    if (!checkData()) return;
    
    // 保存数据
    var dr = dboHS_ENTERPRISE.dataTable.getRecord(0);
    if (enterpriseOid == null) {
        enterpriseOid = txtCreditCode.getValue();
		dr.setItem("OID", enterpriseOid);
        dboHS_ENTERPRISE.execInsert();
    } else {
        dboHS_ENTERPRISE.execUpdate();
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

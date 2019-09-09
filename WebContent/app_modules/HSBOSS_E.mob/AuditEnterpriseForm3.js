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
var dboHS_ENTERPRISE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var enterpriseOid = null;
var drEnterprise = null;

/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_ENTERPRISE = new entlogic_dbo("HSBOSS", "HS_ENTERPRISE");
	
	// 初始化交互组件
    $("#btnBack").click(btnBack_click);
    $("#btnOK").click(btnOK_click);
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化
    enterpriseOid = getUrlParam("enterpriseOid");
	drEnterprise = dboHS_ENTERPRISE.getByOid(enterpriseOid);
    $("#lblPrompt").html("审核结果会发送短信到手机：" + drEnterprise.getValue("TEL"));
};

// 提交按钮单击事件
function btnBack_click() {
    var url = encodeURI("AuditEnterpriseForm2.html?enterpriseOid=" + enterpriseOid);
    jumpTo(url);    
};

// 提交按钮单击事件
function btnOK_click() {
    var url = encodeURI("MainForm.html?enterpriseOid=" + enterpriseOid);
    jumpTo(url);
};

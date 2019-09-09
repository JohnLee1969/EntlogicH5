/////////////////////////////////////////////////////////////////////////////////////////////////
//  常量声明  

// 全局应用
var application = parent.application;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

// 页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
// 数据声明    
var dtTemplates = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 组件声明   
var selPageType = {};
var txtPageName = {};


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量
var appName = parent.appName;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部函数


/**
 * 组件初始化
 */ 
function initComponents() {
	// 初始化数据组件
	dtTemplates = new entlogic_data_table();
	
	// 初始化数据组件
	selPageType = new entlogic_ui_select("selPageType", formControls);
	
	txtPageName =new entlogic_ui_text("txtPageName", formControls);
	
	$("#btnOK").click( btnOK_onClick);
    OK = btnOK_onClick;
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//页面事件响应

/**
 * 父页面打开事件处理
 */ 
function bodyOnload() {
	// 初始化表单组件
    initKeys();
	initComponents();
	
	var parameters = new entlogic_data_record();
	parameters.addItem("appName", appName);
	var dataPackage = postBpForm("com.entlogic.h5.builder.forms.AddPageDialog", "getPageTemplates", formControls, parameters);
	dataPackage.fillDataTable(dtTemplates, "dtTemplates");
	selPageType.setOptionsData(dtTemplates);
};

/**
 * 
 */
function btnOK_onClick() {
	var parameters = new entlogic_data_record();
	parameters.addItem("appName", appName);
	var dataPackage = postBpForm("com.entlogic.h5.builder.forms.AddPageDialog", "addPage", formControls, parameters);
	var modulePath = dataPackage.getReturn("modulePath");
	dialogCallBack(modulePath);
	closeDialog();
};

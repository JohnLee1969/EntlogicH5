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



/////////////////////////////////////////////////////////////////////////////////////////////////
// 组件声明   
var selModuleType = {};
var txtModuleName = {};


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部函数


/**
 * 组件初始化
 */ 
function initComponents() {
	// 初始化数据组件
	selModuleType = new entlogic_ui_select("selModuleType", formControls);
	txtModuleName =new entlogic_ui_text("txtModuleName", formControls);
	
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
};

/**
 * 
 */
function btnOK_onClick() {
	var dataPackage = postBpForm("com.entlogic.h5.builder.forms.AddModuleDialog", "addModule", formControls);
	var modulePath = dataPackage.getReturn("modulePath");
	dialogCallBack(modulePath);
	closeDialog();
};

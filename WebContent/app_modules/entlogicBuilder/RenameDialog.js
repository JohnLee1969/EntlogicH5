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
var txtOldModuleName = {};
var txtNewModuleName = {};

/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量
var appName = parent.appName;
var formName = parent.formName;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部函数


/**
 * 组件初始化
 */ 
function initComponents() {
	// 初始化数据组件
	txtOldModuleName = new entlogic_ui_text("txtOldModuleName", formControls);
	txtOldModuleName.setEnabled(false);
	txtNewModuleName =new entlogic_ui_text("txtNewModuleName", formControls);
	
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
	
	// 接受参数
	if (formName == "*") {
		txtOldModuleName.setValue(appName);
	} else {
		txtOldModuleName.setValue(formName);
	}
};

/**
 * 确定按钮单击事件
 */
function btnOK_onClick() {
	var parameters = new entlogic_data_record();
	parameters.addItem("appName", appName);
	parameters.addItem("formName", formName);
	var dataPackage = postBpForm("com.entlogic.h5.builder.forms.RenameDialog", "rename", formControls, parameters);
	var modulePath = dataPackage.getReturn("modulePath");
	dialogCallBack(modulePath);
	closeDialog();
};

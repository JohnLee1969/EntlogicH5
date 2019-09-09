/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 全局应用
var application = parent.application;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

// 页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    
var dboFW_PARAMETER = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var dgrParameter = null;
var txtOrderCode = null;
var txtParamGroup = null;
var txtParamKey = null;
var txtParamValue = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明




/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	dboFW_PARAMETER = new entlogic_dbo("entlogicSystem", "FW_PARAMETER");
  
	// 初始化交互组件
	dgrParameter = new entlogic_ui_datagrid("dgrParameter", formControls);
  	dgrParameter.setBindingData(dboFW_PARAMETER.dataTable);
  
  	txtOrderCode = new entlogic_ui_text("txtOrderCode", formControls);
  	txtOrderCode.setBindingData(dboFW_PARAMETER.dataTable, "ORDER_CODE");
  
  	txtParamGroup = new entlogic_ui_text("txtParamGroup", formControls);
  	txtParamGroup.setBindingData(dboFW_PARAMETER.dataTable, "PARAM_GROUP");
  
  	txtParamKey = new entlogic_ui_text("txtParamKey", formControls);
	txtParamKey.setBindingData(dboFW_PARAMETER.dataTable, "PARAM_KEY");
  
  	txtParamValue = new entlogic_ui_text("txtParamValue", formControls);
	txtParamValue.setBindingData(dboFW_PARAMETER.dataTable, "PARAM_VALUE");

  	$("#btnExit").click(btnExit_click);
	$("#btnSave").click(btnSave_click);
    
    // 去掉文字选择
    document.onselectstart = function(){return false;};
};

// 加载参数列表
function loadParameters() {
  dboFW_PARAMETER.orderByClause = "order by PARAM_GROUP, ORDER_CODE";
  dboFW_PARAMETER.execQuery();
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadParameters();
};

// 退出按钮单击事件响应
function btnExit_click() {
	window.location.href = applicationRoot + "/app_modules/entlogicSystem/Desktop.html";
	return;
};

// 保存参数
function btnSave_click() {
  	dboFW_PARAMETER.execUpdate();
  	dgrParameter.draw();
};


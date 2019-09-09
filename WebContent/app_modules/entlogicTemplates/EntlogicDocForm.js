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




/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   




/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明

var pageScale = 1;
var pageDragObject = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	
	// 初始化交互组件
	$("#btnRestore").click(btnRestore_click);
	$("#btnZoomUp").click(btnZoomUp_click);
	$("#btnZoomDown").click(btnZoomDown_click);
	$("#btnFixHeight").click(btnFixHeight_click);
	$("#btnFixWidth").click(btnFixWidth_click);
	//setDraggable($("#divPage"), pageScale);
    
    $("#btnSave").click(btnSave_click);
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
	
};

// 页面还原
function btnRestore_click() {
	var pageView = $("#divPageView");
	var page = $("#divPage");

	pageScale = 1;
	page.css("transform", "scale(" + pageScale + ")");
	setDraggable(page, pageScale);
		
	var pageWidth = page.width();
	var pageHeight = page.height();
	var pageViewWidth = pageView.width();
	var pageViewHeight = pageView.height();
	var left = (pageViewWidth - pageWidth) / 2 + 6;
	var top = (pageViewHeight - pageHeight) / 2 + 6;
	page.css({
		"left" : left + "px",
		"top" : top + "px"
	});
};

// 页面放大
function btnZoomUp_click() {
	var page = $("#divPage");
	
	pageScale += 0.1;
	page.css("transform", "scale(" + pageScale + ")");
	setDraggable(page, pageScale);
};

/**
 * 页面缩小
 */
function btnZoomDown_click() {
	var page = $("#divPage");
	
	pageScale -= 0.1;
	page.css("transform", "scale(" + pageScale + ")");
	setDraggable(page, pageScale);
};

// 适应页高
function btnFixHeight_click() {
	var pageView = $("#divPageView");
	var page = $("#divPage");
	
	pageScale = pageView.height() / page.height();
	page.css("transform", "scale(" + pageScale + ")");
	setDraggable(page, pageScale);
	
	var pageWidth = page.width();
	var pageHeight = page.height();
	var pageViewWidth = pageView.width();
	var pageViewHeight = pageView.height();
	var left = 0;
	var top = 0;
	if (pageWidth > pageHeight) {
		left = (pageWidth * pageScale - pageWidth) / 2 + 6;
		top = (pageViewHeight - pageHeight) / 2 + 6;
	} else {
		left = (pageViewWidth - pageWidth) / 2 + 6;
		top = (pageViewHeight - pageHeight) / 2 + 6;
	}
	page.css({
		"left" : left + "px",
		"top" : top + "px"
	});
};

// 适应页宽
function btnFixWidth_click() {
	var pageView = $("#divPageView");
	var page = $("#divPage");
	
	pageScale = pageView.width() / page.width();
	page.css("transform", "scale(" + pageScale + ")");
	setDraggable(page, pageScale);
	
	var pageWidth = page.width();
	var pageHeight = page.height();
	var pageViewWidth = pageView.width();
	var pageViewHeight = pageView.height();
	var left = 0;
	var top = 0;
	if (pageWidth > pageHeight) {
		left = (pageViewWidth - pageWidth) / 2 + 6;
		top = (pageViewHeight - pageHeight) / 2 + 6;
	} else {
		left = (pageViewWidth - pageWidth) / 2 + 6;
		top = (pageHeight * pageScale - pageHeight) / 2 + 6;
	}
	page.css({
		"left" : left + "px",
		"top" : top + "px"
	});
};

// 保存档案
function btnSave_click() {
	// 数据检查
    
    // 保存数据
    
};



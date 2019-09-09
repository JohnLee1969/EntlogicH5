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
var imgPic = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var picUrl = getUrlParam("picUrl");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	
	// 初始化交互组件
    imgPic = new entlogic_ui_image("imgPic", formControls);
    imgPic.displayMode = "FitWidth";
    imgPic.onLoad = btnMiddle_click;
    
    $("#btnFitWidth").click(btnFitWidth_click);
    $("#btnFitHeight").click(btnFitHeight_click);
    $("#btnZoomUp").click(btnZoomUp_click);
    $("#btnZoomDown").click(btnZoomDown_click);
    $("#btnMiddle").click(btnMiddle_click);    
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化	
    if (picUrl == null) {
         imgPic.setValue("");
    } else {
    	imgPic.setValue(picUrl);
    }
};

// 适应宽度
function btnFitWidth_click() {
    var boxWidth = $("#divViewBox").width();
    imgPic.setWidth(boxWidth - 8);
    btnMiddle_click();
};

// 适应高度
function btnFitHeight_click() {
    var boxHeight = $("#divViewBox").height();
    imgPic.setHeight(boxHeight - 8);
    btnMiddle_click();
};

// 放大
function btnZoomUp_click() {
    var imgObj = $("#imgPic");
    var width = imgObj.width() + 20;
    var height = imgObj.height() * width / imgObj.width();
    imgObj.width(width);
    imgObj.height(height);
    btnMiddle_click();
};

// 缩小
function btnZoomDown_click() {
    var imgObj = $("#imgPic");
    var width = imgObj.width() - 20;
    if (width <= 0) return;
    var height = imgObj.height() * width / imgObj.width();
    imgObj.width(width);
    imgObj.height(height);
    btnMiddle_click();
};

// 居中
function btnMiddle_click() {
    var imgObj = $("#imgPic");
    var viewBox = $("#divViewBox");
    var top = (viewBox.height() - imgObj.height()) / 2;
    var left = (viewBox.width() - imgObj.width()) / 2;
	imgObj.css({
		"left" : left + "px",
		"top" : top + "px"
	});   
};
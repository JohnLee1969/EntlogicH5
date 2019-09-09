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


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明 
var imgLicencePic = null;
var imgLpCertPicA = null;
var imgLpCertPicB = null;
var imgPic = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var enterpriseOid = getUrlParam("enterpriseOid");
var picName = null;
var pageScale = 1;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_ENTERPRISE = new entlogic_dbo("HSBOSS", "HS_ENTERPRISE");
	
	// 初始化交互组件
    imgLicencePic = new entlogic_ui_image("imgLicencePic", formControls);
    imgLicencePic.displayMode = "FitWidth";
    imgLicencePic.setBindingData(dboHS_ENTERPRISE.dataTable, "LICENCE_PIC");
    $("#imgLicencePic").click(function() {
        imgPic.setValue(imgLicencePic.getValue()); 
        picName = "LICENCE_PIC";
        
        $("#lblLicencePic").css("color", "red");
		$("#lblLpCertPicA").css("color", "gray");
		$("#lblLpCertPicB").css("color", "gray");
    });
    
    imgLpCertPicA = new entlogic_ui_image("imgLpCertPicA", formControls);
    imgLpCertPicA.displayMode = "FitWidth";
    imgLpCertPicA.setBindingData(dboHS_ENTERPRISE.dataTable, "LP_CERT_PIC_A");
    $("#imgLpCertPicA").click(function() {
        imgPic.setValue(imgLpCertPicA.getValue()); 
        picName = "LP_CERT_PIC_A";
        
        $("#lblLicencePic").css("color", "gray");
		$("#lblLpCertPicA").css("color", "red");
		$("#lblLpCertPicB").css("color", "gray");
    });
    
    imgLpCertPicB = new entlogic_ui_image("imgLpCertPicB", formControls);
    imgLpCertPicB.displayMode = "FitWidth";
    imgLpCertPicB.setBindingData(dboHS_ENTERPRISE.dataTable, "LP_CERT_PIC_B");
    $("#imgLpCertPicB").click(function() {
        imgPic.setValue(imgLpCertPicB.getValue()); 
        picName = "LP_CERT_PIC_B";
        
        $("#lblLicencePic").css("color", "gray");
		$("#lblLpCertPicA").css("color", "gray");
		$("#lblLpCertPicB").css("color", "red");
    });
    
    imgPic = new entlogic_ui_image("imgPic", formControls);
    imgPic.displayMode = "FitWidth";

    $("#btnImportFile").click(btnImportFile_click);
    $("#btnTakePhoto").click(btnTakePhoto_click);
    $("#btnDelete").click(btnDelete_click);
    
	$("#btnRestore").click(btnRestore_click);
	$("#btnZoomUp").click(btnZoomUp_click);
	$("#btnZoomDown").click(btnZoomDown_click);
	$("#btnFixHeight").click(btnFixHeight_click);
	$("#btnFixWidth").click(btnFixWidth_click);
};

// 加载数据
function loadData() {
    dboHS_ENTERPRISE.whereClause = "where OID = '" + enterpriseOid + "'";
    dboHS_ENTERPRISE.execQuery();
    imgPic.setValue(imgLicencePic.getValue());
    picName = "LICENCE_PIC";
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

// 导入文件按钮单击事件响应
function btnImportFile_click() {
    var url = "../entlogicCommon/UploadBigFileDialog.html?appName=HSBOSS";
	popUpDialog(url, 200, 150, "上传图片文件", function(imgUrl, ft) {       
        if (picName == "LICENCE_PIC") {
            imgLicencePic.setValue(imgUrl);
        }else if (picName == "LP_CERT_PIC_A") {
            imgLpCertPicA.setValue(imgUrl);
        }else if (picName == "LP_CERT_PIC_B") {
            imgLpCertPicB.setValue(imgUrl);
        }
        dboHS_ENTERPRISE.execUpdate(dr);
    }); 
};

// 拍照按钮单击事件响应
function btnTakePhoto_click() {
	popUpDialog("../entlogicCommon/CameraDialog.html", 200, 150, "拍照获取图片", CameraDialog_close); 
};

// 拍照返回
function CameraDialog_close() {
};

// 删除按钮单击事件响应
function btnDelete_click() {
    var path = imgAccessory.getValue();
    deleteFile(path);
    
    var index = lstPreview.getSelectedIndex();
    dboHS_ACCESSORY.execDelete();
    loadData();
    if (index >= lstPreview.getSize()) index--;
    lstPreview.setValue(index);
};


////////////////////////////////////////////////////////
// 档案页视图控制函数：系统自带建议用户不要自行更改。 
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



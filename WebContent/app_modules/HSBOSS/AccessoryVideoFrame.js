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
var dboHS_ACCESSORY = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var imgAccessory = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var pageScale = 1;
var bizOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_ACCESSORY = new entlogic_dbo("HSBOSS", "HS_ACCESSORY");
	
	// 初始化交互组件
    video = document.getElementById("videoBox");
    video.controls = "controls";
    video.postor = "";
    video.src = "../../common/videos/test.mp4";
    
    lstPreview = new entlogic_ui_list("lstPreview", formControls);
    lstPreview.setBindingData(dboHS_ACCESSORY.dataTable);

    $("#btnImportFile").click(btnImportFile_click);
    $("#btnDelete").click(btnDelete_click);
    
	$("#btnRestore").click(btnRestore_click);
	$("#btnZoomUp").click(btnZoomUp_click);
	$("#btnZoomDown").click(btnZoomDown_click);
	$("#btnFixHeight").click(btnFixHeight_click);
	$("#btnFixWidth").click(btnFixWidth_click);
	//setDraggable($("#divPage"), pageScale);
};

// 加载数据
function loadData() {
    dboHS_ACCESSORY.whereClause = "where BIZ_OID = '" + bizOid + "'";
    dboHS_ACCESSORY.whereClause += "and FILE_TYPE in ('mp4', 'rm')";
    dboHS_ACCESSORY.orderByClause = "order by SN";
    dboHS_ACCESSORY.execQuery();
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	bizOid = getUrlParam("bizOid");
    fileType = getUrlParam("fileType");
    
    loadData();
};

// 导入文件按钮单击事件响应
function btnImportFile_click() {
	popUpDialog("../entlogicCommon/UploadBigFileDialog.html", 200, 150, "上传图片文件", function(imgUrl, ft) {
        var sn = parseInt(dboHS_ACCESSORY.getMax("SN")) + 1;
        var dr = dboHS_ACCESSORY.execCreate();
        var oid = dr.getValue("id");
        dr.setItem("OID", oid);
        dr.setItem("BIZ_OID", bizOid);
        dr.setItem("SN", sn);
        dr.setItem("FILE_TYPE", ft);
        dr.setItem("FILE_PATH", imgUrl);
        dboHS_ACCESSORY.execInsert(dr);

        loadData();
        lstPreview.setValue(oid);        
    }); 
};

// 导入文件按钮单击事件响应
function btnImportFile_click() {
    $("#fileImport").click();
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

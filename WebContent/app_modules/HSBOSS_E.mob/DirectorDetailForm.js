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
var dboHS_DIRECTOR = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明
var imgHeadPic = null;
var lblName = null;
var lblSex = null;
var lblAge = null;
var lblNativeArea = null;
var lblCertCode = null;

var lstWorker = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var enterpriseOid = getUserSessionItem("enterpriseOid");
var directorOid = getUserSessionItem("directorOid");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	dboHS_DIRECTOR = new entlogic_dbo("HSBOSS", "HS_DIRECTOR");
	dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
	
	// 初始化交互组件   
    imgHeadPic = new entlogic_mui_image("imgHeadPic", formControls);
    imgHeadPic.setBindingData(dboHS_DIRECTOR.dataTable, "HEAD_PIC");
    
    lblName = new entlogic_mui_output("lblName", formControls);
    lblName.setBindingData(dboHS_DIRECTOR.dataTable, "NAME");

    lblSex = new entlogic_mui_output("lblSex", formControls);
    lblSex.setBindingData(dboHS_DIRECTOR.dataTable, "SEX_TEXT");
    
    lblAge = new entlogic_mui_output("lblAge", formControls);
    lblAge.setBindingData(dboHS_DIRECTOR.dataTable, "AGE");

    lblNativeArea = new entlogic_mui_output("lblNativeArea", formControls);
    lblNativeArea.setBindingData(dboHS_DIRECTOR.dataTable, "NATIVE_AREA_TEXT");
    
    lblCertCode = new entlogic_mui_output("lblCertCode", formControls);
    lblCertCode.setBindingData(dboHS_DIRECTOR.dataTable, "CERT_CODE");

    lstWorker = new entlogic_mui_list("lstWorker", formControls);
    lstWorker.setBindingData(dboHS_WORKER.dataTable);
    lstWorker.itemClick = lstWorker_itemClick;
    
	// 初始化交互组件
    $("#btnBack").click(btnBack_click);
    $("#btnEdit").click(btnEdit_click);
    $("#btnCallDirector").click(btnCallDirector_click);
};

// 加载服务人员数据
function loadData() {
    // 查询获取数据
	dboHS_DIRECTOR.whereClause = "where OID = '" + directorOid + "'";
	dboHS_DIRECTOR.execQuery();
};

// 加载工作人员列表数据
function loadWorker() {
    var whereClause = "where HS_ENTERPRISE = '" + enterpriseOid + "' ";
    whereClause += "and HS_DIRECTOR = '" + directorOid + "' ";
    
	dboHS_WORKER.whereClause = whereClause;
    dboHS_WORKER.execQuery();
    if (lstWorker.getSize() > 0) {
    	$(".btnCallWorker").click(btnCallWorker_click);
        lstWorker.setSelectedIndex(0);
    }
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
    	
	// 用户定义初始化
	loadData();
    loadWorker();
};


// 添加服务人员数据
function btnBack_click() {
	jumpTo("DirectorForm.html");
};

// 编辑服务人员数据
function btnEdit_click() {
	jumpTo("DirectorEditForm.html?directorOid=" + directorOid);
};

// 拨打老师电话
function btnCallDirector_click() {
    var director = dboHS_DIRECTOR.dataTable.getRecord(0);
    var mobile = director.getValue("MOBILE");
    device.openCall(mobile);
};

// 阿姨列表项点击事件
function lstWorker_itemClick() {
    var workerOid = lstWorker.getValue();
    var worker = dboHS_WORKER.dataTable.getRecord(lstWorker.getSelectedIndex());
    if (lstWorker.itemClickTrigger == "btnCallWorkr") {
        var mobile = worker.getValue("ACCOUNT");
        device.openCall(mobile);
    }
    lstWorker.itemClickTrigger = "";
};

// 拨打阿姨电话
function btnCallWorker_click() {
    lstWorker.itemClickTrigger = "btnCallWorkr";
};

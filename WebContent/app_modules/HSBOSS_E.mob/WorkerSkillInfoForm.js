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
var dtCodeWKR_SKL = null;
var dtCodeWKR_LAN = null;
var dboHS_WORKER_LICENCE = null;
var dboHS_WORKER = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lstSkill = null;
var lstLanguage = null;
var lstLicence = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var workerOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");
    
    dba.SQL = "select CODE as id, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'WKR_SKL' order by ORDER_CODE";
	drCodeWKR_SKL = dba.execQuery();
    
    dba.SQL = "select CODE as id, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'WKR_LAN' order by ORDER_CODE";
	dtCodeWKR_LAN = dba.execQuery();
     
    dboHS_WORKER_LICENCE = new entlogic_dbo("HSBOSS", "HS_WORKER_LICENCE");
    
	dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
	
	// 初始化交互组件  
	lstSkill = new entlogic_mui_list("lstSkill", formControls);
    lstSkill.setMultiselected(true);
    lstSkill.setBindingData(drCodeWKR_SKL);
    lstSkill.itemClick = saveData;
    
	lstLanguage = new entlogic_mui_list("lstLanguage", formControls);
    lstLanguage.setMultiselected(true);
    lstLanguage.setBindingData(dtCodeWKR_LAN);
    lstLanguage.itemClick = saveData;

	lstLicence = new entlogic_mui_list("lstLicence", formControls);
    lstLicence.setBindingData(dboHS_WORKER_LICENCE.dataTable);
    lstLicence.itemClick = lstLicence_itemClick;
    
    $("#btnBack").click(btnBack_click);
    $("#btnNext").click(btnNext_click);
    
    $("#tabBaseInfo").click(tabBaseInfo_click);
    $("#tabServiceInfo").click(tabServiceInfo_click);
    $("#tabMediaInfo").click(tabMediaInfo_click);
    
    $("#btnAddLicence").click(btnAddLicence_click);
    
};

// 加载数据
function loadData() {
    dboHS_WORKER.whereClause = "where OID = '" + workerOid + "'";
    dboHS_WORKER.execQuery();
    
    var dr = dboHS_WORKER.dataTable.getRecord(0);
    lstSkill.setValues(dr.getValue("SKILL").split(","));
    lstLanguage.setValues(dr.getValue("LANGUAGE").split(","));
    
    dboHS_WORKER_LICENCE.whereClause = "where HS_WORKER='" + workerOid + "'";
    dboHS_WORKER_LICENCE.execQuery();
    $(".btnEditLicence").click(btnEditLicence_click);
    $(".btnDeleteLicence").click(btnDeleteLicence_click);
};

// 保存数据
function saveData() {
    var dr = dboHS_WORKER.dataTable.getRecord(0);
    dr.setItem("SKILL", lstSkill.getValues().toString());
    dr.setItem("LANGUAGE", lstLanguage.getValues().toString());    
    dboHS_WORKER.execUpdate();
    //popUpMessage("数据保存成功！");
    return true;
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
    
    // 接收参数
    workerOid = getUrlParam("workerOid");
	
	// 用户定义初始化
	loadData();
};

// 返回按钮点击事件
function btnBack_click() {
    jumpTo("WorkerForm.html");
};

// 保存按钮单击事件
function btnNext_click() {
     var url = encodeURI("WorkerServiceInfoForm.html?workerOid=" + workerOid);
    jumpTo(url);
};

// 基本信息标签单击事件
function tabBaseInfo_click() {
     var url = encodeURI("WorkerBaseInfoForm.html?workerOid=" + workerOid);
    jumpTo(url);
};

// 签约服务标签单击事件
function tabServiceInfo_click() {
     var url = encodeURI("WorkerServiceInfoForm.html?workerOid=" + workerOid);
    jumpTo(url);
};

// 照片视频标签单击事件
function tabMediaInfo_click() {
     var url = encodeURI("WorkerMediaInfoForm.html?workerOid=" + workerOid);
    jumpTo(url);
};

// 添加资质证书按钮单击事件
function btnAddLicence_click() {
    var url = encodeURI("WorkerLicenceEditForm.html?workerOid=" + workerOid);
    popUpSubForm(url, WorkLicenceEditForm_close);
};

// 编辑资质证书按钮点击事件
function btnEditLicence_click() {
    lstLicence.itemClickTrigger = "btnEditLicence";
};

// 删除资质证书按钮单击事件
function btnDeleteLicence_click() {
    lstLicence.itemClickTrigger = "btnDeleteLicence"
};

// 资质证书列表数据项点击事件
function lstLicence_itemClick() {    
    if (lstLicence.itemClickTrigger === "btnEditLicence") {
        var workerLicenceOid = lstLicence.getValue();
    	var url = encodeURI("WorkerLicenceEditForm.html?workerLicenceOid=" + workerLicenceOid);
    	popUpSubForm(url, WorkLicenceEditForm_close);
    }   
    else if (lstLicence.itemClickTrigger === "btnDeleteLicence") {
        dboHS_WORKER_LICENCE.execDelete();
    	loadData();
    }
};

// 证书编辑窗口返回
function WorkLicenceEditForm_close(oid) {
    loadData();
};
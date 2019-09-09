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
var dtCatalog = null;
var dboHS_WORKER_RELATIVES = null;
var dboHS_WORKER_LICENCE = null;
var dboHS_LABOUR_CONTRACT = null;
var dboHS_WORKER_SERVICE = null;
var dboHS_WORKER_MER = null;
var dboHS_WORKER_ILLEGAL = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明  
var lblDocTitle = null;
var tvwCatalog = null;
var lblSubDataTitle = null;
var dgrRelatives = null;
var dgrLicence = null;
var dgrLabourContract = null;
var dgrWorkerService = null;
var dgrWorkerMer = null;
var dgrWorkerIllegal = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var workerOid = getUrlParam("workerOid");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dtCatalog = new entlogic_data_table();
    dboHS_WORKER_RELATIVES = new entlogic_dbo("HSBOSS", "HS_WORKER_RELATIVES");
    dboHS_WORKER_LICENCE = new entlogic_dbo("HSBOSS", "HS_WORKER_LICENCE");
    dboHS_LABOUR_CONTRACT = new entlogic_dbo("HSBOSS", "HS_LABOUR_CONTRACT");
    dboHS_WORKER_SERVICE = new entlogic_dbo("HSBOSS", "HS_WORKER_SERVICE");
    dboHS_WORKER_MER = new entlogic_dbo("HSBOSS", "HS_WORKER_MER");
    dboHS_WORKER_ILLEGAL = new entlogic_dbo("HSBOSS", "HS_WORKER_ILLEGAL");
	
	// 初始化交互组件
    lblDocTitle = new entlogic_ui_output("lblDocTitle", formControls);
    
    tvwCatalog = new entlogic_ui_treeview("tvwCatalog", formControls);
    tvwCatalog.setBindingData(dtCatalog);
    tvwCatalog.nodeClick = tvwCatalog_nodeClick;
    
    lblSubDataTitle = new entlogic_ui_output("lblSubDataTitle", formControls);
    
    dgrRelatives = new entlogic_ui_datagrid("dgrRelatives", formControls);
    dgrRelatives.setBindingData(dboHS_WORKER_RELATIVES.dataTable);
    dgrRelatives.rowDbclick = btnEdit_click;
    
    dgrLicence = new entlogic_ui_datagrid("dgrLicence", formControls);
    dgrLicence.setBindingData(dboHS_WORKER_LICENCE.dataTable);
    dgrLicence.rowDbclick = btnEdit_click;
    
    dgrLabourContract = new entlogic_ui_datagrid("dgrLabourContract", formControls);
    dgrLabourContract.setBindingData(dboHS_LABOUR_CONTRACT.dataTable);
    dgrLabourContract.rowDbclick = btnEdit_click;

    dgrWorkerService = new entlogic_ui_datagrid("dgrWorkerService", formControls);
    dgrWorkerService.setBindingData(dboHS_WORKER_SERVICE.dataTable);
    dgrWorkerService.rowDbclick = btnEdit_click;

    dgrWorkerMer = new entlogic_ui_datagrid("dgrWorkerMer", formControls);
    dgrWorkerMer.setBindingData(dboHS_WORKER_MER.dataTable);
    dgrWorkerMer.rowDbclick = btnEdit_click;
    
    dgrWorkerIllegal = new entlogic_ui_datagrid("dgrWorkerIllegal", formControls);
    dgrWorkerIllegal.setBindingData(dboHS_WORKER_ILLEGAL.dataTable);
    dgrWorkerIllegal.rowDbclick = btnEdit_click;
        
    $("#btnSearch").click(btnSearch_click);
    $("#btnAdd").click(btnAdd_click);
    $("#btnEdit").click(btnEdit_click);
    $("#btnDelete").click(btnDelete_click);
};

// 设置档案标题
function setDocTitle() {
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "select NAME from HS_WORKER where OID='" + workerOid + "'";
    var dt = dba.execQuery();
    if (dt.getSize() > 0) {
        var dr = dt.getRecord(0);
        lblDocTitle.setValue("档案目录（" + dr.getValue("NAME") + "）");
    } else {
        lblDocTitle.setValue("档案目录（新服务产品）");
    }
};

// 初始化档案目录
function loadCatalog() {
    // 清空当前记录
    dtCatalog.clear();
    
    // 基本信息项
    var docForm = "WorkerDoc.html";
    if (workerOid != null) docForm += "?workerOid=" + workerOid;
    var dr = new entlogic_data_record();
    dr.addItem("id", "1");
    dr.addItem("lv", "0");
    dr.addItem("text", "1.基本信息");
    dtCatalog.addRecord(dr);
    
    // 亲友信息
    dr = new entlogic_data_record();
    dr.addItem("id", "2");
    dr.addItem("lv", "0");
    dr.addItem("text", "2.亲友信息");
    dtCatalog.addRecord(dr);
    
    // 工作资质
    dr = new entlogic_data_record();
    dr.addItem("id", "3");
    dr.addItem("lv", "0");
    dr.addItem("text", "3.工作资质");
    dtCatalog.addRecord(dr);
     
    // 签约产品
    dr = new entlogic_data_record();
    dr.addItem("id", "4");
    dr.addItem("lv", "0");
    dr.addItem("text", "4.接单产品");
    dtCatalog.addRecord(dr);
    
    // 个人图片
    dr = new entlogic_data_record();
    dr.addItem("id", "5");
    dr.addItem("lv", "0");
    dr.addItem("text", "5.个人图片");
    dtCatalog.addRecord(dr);
    
    // 个人视频
    dr = new entlogic_data_record();
    dr.addItem("id", "6");
    dr.addItem("lv", "0");
    dr.addItem("text", "6.个人视频");
    dtCatalog.addRecord(dr);
   
    // 体检记录
    dr = new entlogic_data_record();
    dr.addItem("id", "7");
    dr.addItem("lv", "0");
    dr.addItem("text", "7.体检记录");
    dtCatalog.addRecord(dr);
    
    // 违纪记录
    dr = new entlogic_data_record();
    dr.addItem("id", "8");
    dr.addItem("lv", "0");
    dr.addItem("text", "8.违纪记录");
    dtCatalog.addRecord(dr);

    // 业务统计
    dr = new entlogic_data_record();
    dr.addItem("id", "9");
    dr.addItem("lv", "0");
    dr.addItem("text", "9.业务统计");
    dtCatalog.addRecord(dr);

    // 同步显示
    dtCatalog.synchronizeLayout();
};

// 加载亲友数据项
function loadWorkerRelatives() {
    dboHS_WORKER_RELATIVES.whereClause = "where HS_WORKER = '" + workerOid + "'";
    dboHS_WORKER_RELATIVES.orderByClause = "order by RELATIONSHIP";
    dboHS_WORKER_RELATIVES.execQuery();
};

// 加载职业资质数据项
function loadWorkerLicence() {
    dboHS_WORKER_LICENCE.whereClause = "where HS_WORKER = '" + workerOid + "'";
    dboHS_WORKER_LICENCE.orderByClause = "order by ISSUING_DATE";
    dboHS_WORKER_LICENCE.execQuery();
};

// 加载接单产品数据项
function loadWorkerService() {
    dboHS_WORKER_SERVICE.whereClause = "where HS_WORKER = '" + workerOid + "'";
    dboHS_WORKER_SERVICE.orderByClause = "order by PRIORITY";
    dboHS_WORKER_SERVICE.execQuery();
};

// 加载体检数据项
function loadWorkerMer() {
    dboHS_WORKER_MER.whereClause = "where HS_WORKER = '" + workerOid + "'";
    dboHS_WORKER_MER.orderByClause = "order by ME_DATE";
    dboHS_WORKER_MER.execQuery();
};

// 加载违纪数据项
function loadWorkerIllegal() {
    dboHS_WORKER_ILLEGAL.whereClause = "where HS_WORKER = '" + workerOid + "'";
    dboHS_WORKER_ILLEGAL.orderByClause = "order by ILLEGAL_DATE";
    dboHS_WORKER_ILLEGAL.execQuery();
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
    setDocTitle();    
	loadCatalog();
    tvwCatalog_nodeClick();
};

// 档案节点单击事件响应
function tvwCatalog_nodeClick() {
    var catalogId = tvwCatalog.getValue();
    if (catalogId == "1") {
        $("#divDocView").show();
        $("#divSubData").hide();
        var url = encodeURI("../HSBOSS/WorkerDoc.html?workerOid=" + workerOid);
        if (workerOid == null) url = "../HSBOSS/WorkerDoc.html";
        $("#iframeDoc").attr("src", url);
    } else if (catalogId == "2") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divWorkerRelativesList").show();
        $("#divWorkerLicenceList").hide();
        $("#divWorkerServiceList").hide();
        $("#divWorkerMerList").hide();
         $("#divWorkerIllegalList").hide();
        lblSubDataTitle.setValue("亲友信息列表");
        loadWorkerRelatives();
    } else if (catalogId == "3") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divWorkerRelativesList").hide();
        $("#divWorkerLicenceList").show();
        $("#divWorkerServiceList").hide();
        $("#divWorkerMerList").hide();
         $("#divWorkerIllegalList").hide();
        lblSubDataTitle.setValue("工作资质列表");
        loadWorkerLicence();
    } else if (catalogId == "4") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divWorkerRelativesList").hide();
        $("#divWorkerLicenceList").hide();
        $("#divWorkerServiceList").show();
        $("#divWorkerMerList").hide();
        $("#divWorkerIllegalList").hide();
        lblSubDataTitle.setValue("接单产品列表");
        loadWorkerService();
    } else if (catalogId == "5") {
        $("#divDocView").show();
        $("#divSubData").hide();
        var url = encodeURI("AccessoryImageFrame.html?bizOid=" + workerOid);
        if (workerOid == null) url = "../HSBOSS/WorkerDoc.html";
        $("#iframeDoc").attr("src", url);
    } else if (catalogId == "6") {
        $("#divDocView").show();
        $("#divSubData").hide();
        var url = encodeURI("AccessoryVideoFrame.html?bizOid=" + workerOid);
        if (workerOid == null) url = "../HSBOSS/WorkerDoc.html";
        $("#iframeDoc").attr("src", url);
    } else if (catalogId == "7") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divWorkerRelativesList").hide();
        $("#divWorkerLicenceList").hide();
        $("#divWorkerServiceList").hide();
        $("#divWorkerMerList").show();
        $("#divWorkerIllegalList").hide();
        lblSubDataTitle.setValue("体检记录列表");
        loadWorkerMer();
    } else if (catalogId == "8") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divWorkerRelativesList").hide();
        $("#divWorkerLicenceList").hide();
        $("#divWorkerServiceList").hide();
        $("#divWorkerMerList").hide();
        $("#divWorkerIllegalList").show();
        lblSubDataTitle.setValue("违规记录列表");
        loadWorkerIllegal();
    }
};


// 查找按钮单击事件响应
function btnSearch_click() {
};

// 添加按钮单击事件响应
function btnAdd_click() {
    var catalogId = tvwCatalog.getValue();
	if (catalogId == "2") {
        var url = encodeURI("WorkerRelativesEditDialog.html?workerOid=" + workerOid);
        popUpDialog(url, 200, 150, "添加亲友信息", WorkerRelativesEditDialog_close); 
    } else if (catalogId == "3") {
        var url = encodeURI("WorkerLicenceEditDialog.html?workerOid=" + workerOid);
        popUpDialog(url, 200, 150, "添加工作资质", WorkerLicenceEditDialog_close); 
    } else if (catalogId == "4") {
        var url = encodeURI("WorkerServiceEditDialog.html?workerOid=" + workerOid);
        popUpDialog(url, 200, 150, "添加接单产品", WorkerServiceEditDialog_close); 
    } else if (catalogId == "7") {
        var url = encodeURI("WorkerMerEditDialog.html?workerOid=" + workerOid);
        popUpDialog(url, 200, 150, "添加体检记录", WorkerMerEditDialog_close); 
    } else if (catalogId == "8") {
        var url = encodeURI("WorkerIllegalEditDialog.html?workerOid=" + workerOid);
        popUpDialog(url, 200, 150, "添加违规记录", WorkerIllegalEditDialog_close); 
    }
};

// 编辑按钮单击事件响应
function btnEdit_click() {
    var catalogId = tvwCatalog.getValue();
	if (catalogId == "2") {
        var workerRelativesOid = dgrRelatives.getValue();
        var url = encodeURI("WorkerRelativesEditDialog.html?workerRelativesOid=" + workerRelativesOid);
        popUpDialog(url, 200, 150, "编辑亲友信息", WorkerRelativesEditDialog_close); 
    } else if (catalogId == "3") {
       var workerLicenceOid = dgrLicence.getValue();
       var url = encodeURI("WorkerLicenceEditDialog.html?workerLicenceOid=" + workerLicenceOid);
        popUpDialog(url, 200, 150, "编辑工作资质", WorkerLicenceEditDialog_close); 
    } else if (catalogId == "4") {
        var workerServiceOid = dgrWorkerService.getValue();
        var url = encodeURI("WorkerServiceEditDialog.html?workerServiceOid=" + workerServiceOid);
        popUpDialog(url, 200, 150, "编辑接单产品", WorkerServiceEditDialog_close); 
    } else if (catalogId == "7") {
        var workerMerOid = dgrWorkerMer.getValue();
        var url = encodeURI("WorkerMerEditDialog.html?workerMerOid=" + workerMerOid);
        popUpDialog(url, 200, 150, "编辑体检记录", WorkerMerEditDialog_close); 
    } else if (catalogId == "8") {
        var workerIllegalOid = dgrWorkerIllegal.getValue();
        var url = encodeURI("WorkerIllegalEditDialog.html?workerIllegalOid=" + workerIllegalOid);
        popUpDialog(url, 200, 150, "编辑违规记录", WorkerIllegalEditDialog_close); 
    }
};

// 删除按钮单击事件响应
function btnDelete_click() {
    var catalogId = tvwCatalog.getValue();
	if (catalogId == "2") {
        dboHS_WORKER_RELATIVES.execDelete();
        loadWorkerRelatives();
    } else if (catalogId == "3") {
        dboHS_WORKER_LICENCE.execDelete();
        loadWorkerLicence();
    } else if (catalogId == "4") {
        dboHS_WORKER_SERVICE.execDelete();
        loadWorkerService();        
    } else if (catalogId == "7") {
        dboHS_WORKER_MER.execDelete();
        loadWorkerMer();       
    } else if (catalogId == "8") {
        dboHS_WORKER_ILLEGAL.execDelete();
        loadWorkerIllegal();       
    }
};

// 亲友编辑对话框关闭
function WorkerRelativesEditDialog_close(oid) {
    loadWorkerRelatives();
    dgrRelatives.setValue(oid);
};

// 工作资质编辑对话框关闭
function WorkerLicenceEditDialog_close(oid) {
    loadWorkerLicence();
    dgrLicence.setValue(oid);
};

// 劳务合同编辑对话框关闭
function LabourContractEditDialog_close(oid) {
    loadLabourContract();
    dgrLabourContract.setValue(oid);
};

// 接单产品编辑对话框关闭
function WorkerServiceEditDialog_close(oid) {
    loadWorkerService();
    dgrWorkerService.setValue(oid);
};

// 体检记录编辑对话框关闭
function WorkerMerEditDialog_close(oid) {
    loadWorkerMer();
    dgrWorkerMer.setValue(oid);
};

// 违规记录编辑对话框关闭
function WorkerIllegalEditDialog_close(oid) {
    loadWorkerIllegal();
    dgrWorkerIllegal.setValue(oid);
};
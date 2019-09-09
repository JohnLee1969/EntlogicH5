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
var dboHS_ENTERPRISE = null;
var dboHS_PROVIDE_CONTRACT = null;
var dboHS_WORKER = null;
var dboHS_ENTERPRISE_ILLEGAL = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明  
var lblDocTitle = null;
var tvwCatalog = null;
var lblSuubDataTitle = null;
var dgrService = null;
var dgrWorker = null;
var dgrIllegal = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var enterpriseOid = getUrlParam("enterpriseOid");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    lblDocTitle = new entlogic_ui_output("lblDocTitle", formControls);
    
    dtCatalog = new entlogic_data_table();
    dboHS_ENTERPRISE = new entlogic_dbo("HSBOSS", "HS_ENTERPRISE");
	dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
	dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
	dboHS_ENTERPRISE_ILLEGAL = new entlogic_dbo("HSBOSS", "HS_ENTERPRISE_ILLEGAL");
    
	// 初始化交互组件
    tvwCatalog = new entlogic_ui_treeview("tvwCatalog", formControls);
    tvwCatalog.setBindingData(dtCatalog);
    tvwCatalog.nodeClick = tvwCatalog_click;
    
    lblSubDataTitle = new entlogic_ui_output("lblSubDataTitle", formControls);
    
    dgrService = new entlogic_ui_datagrid("dgrService", formControls);
    dgrService.setBindingData(dboHS_PROVIDE_CONTRACT.dataTable);
    dgrService.rowDbclick = btnEdit_click;
    
    dgrWorker = new entlogic_ui_datagrid("dgrWorker", formControls);
    dgrWorker.setBindingData(dboHS_WORKER.dataTable);
    dgrWorker.rowDbclick = btnEdit_click;
    
    dgrIllegal = new entlogic_ui_datagrid("dgrIllegal", formControls);
    dgrIllegal.setBindingData(dboHS_ENTERPRISE_ILLEGAL.dataTable);
    dgrIllegal.rowDbclick = btnEdit_click;
        
    $("#btnAuditSuccess").click(btnAuditSuccess_click);
    $("#btnAuditFaild").click(btnAuditFaild_click);
    $("#btnStopBiz").click(btnStopBiz_click);
    $("#btnRestoreBiz").click(btnRestoreBiz_click);
    $("#btnDeleteAll").click(btnDeleteAll_click);
    
    $("#btnSearch").click(btnSearch_click);
    $("#btnAdd").click(btnAdd_click);
    $("#btnEdit").click(btnEdit_click);
    $("#btnDelete").click(btnDelete_click);
};

// 初始化目录
function initCatalog() {
    // 添加目录数据
    var dr = new entlogic_data_record();
    dr.addItem("id", "1");
    dr.addItem("lv", "0");
    dr.addItem("text", "1.基本信息");
    dtCatalog.addRecord(dr);
    
    dr = new entlogic_data_record();
    dr.addItem("id", "2");
    dr.addItem("lv", "0");
    dr.addItem("text", "2.经营证照");
    dtCatalog.addRecord(dr);
    
    dr = new entlogic_data_record();
    dr.addItem("id", "3");
    dr.addItem("lv", "0");
    dr.addItem("text", "3.服务产品");
    dtCatalog.addRecord(dr);
    
    dr = new entlogic_data_record();
    dr.addItem("id", "4");
    dr.addItem("lv", "0");
    dr.addItem("text", "4.服务人员");
    dtCatalog.addRecord(dr);
    
    dr = new entlogic_data_record();
    dr.addItem("id", "5");
    dr.addItem("lv", "0");
    dr.addItem("text", "5.违规记录");
    dtCatalog.addRecord(dr);
    
    dr = new entlogic_data_record();
    dr.addItem("id", "5");
    dr.addItem("lv", "0");
    dr.addItem("text", "6.业务统计");
    dtCatalog.addRecord(dr);
    
    // 同步显示
    dtCatalog.synchronizeLayout();
};

// 加载企业数据
function loadEnterprise() {
    if (enterpriseOid != null) {
        var enterprise = dboHS_ENTERPRISE.getByOid(enterpriseOid);
       	lblDocTitle.setValue("档案目录（" + enterprise.getValue("NAME") + "）");
        
        var status = enterprise.getValue("STATUS");
        if (status == "4") {
            $("#btnAuditSuccess").hide();
            $("#btnAuditFaild").hide();
            $("#btnStopBiz").show();
            $("#btnRestoreBiz").hide();
            $("#btnDeleteAll").hide();            
        } else if (status == "9") {
            $("#btnAuditSuccess").hide();
            $("#btnAuditFaild").hide();
            $("#btnStopBiz").hide();
            $("#btnRestoreBiz").show();
            $("#btnDeleteAll").hide();            
        } else {
            $("#btnAuditSuccess").show();
            $("#btnAuditFaild").show();
            $("#btnStopBiz").hide();
            $("#btnRestoreBiz").hide();
            $("#btnDeleteAll").show();            
        }
      } else {
        lblDocTitle.setValue("档案目录（新家政企业）");
        
        $("#btnAuditSuccess").hide();
        $("#btnAuditFaild").hide();
        $("#btnStopBiz").hide();
        $("#btnRestoreBiz").hide();
        $("#btnDeleteAll").hide();            
    }
};

// 加载服务产品数据
function loadService() {
    dboHS_PROVIDE_CONTRACT.whereClause = "where HS_ENTERPRISE = '" + enterpriseOid + "'";
    dboHS_PROVIDE_CONTRACT.execQuery();
}

// 加载服务人员数据
function loadWorker() {
    dboHS_WORKER.whereClause = "where HS_ENTERPRISE = '" + enterpriseOid + "'";
    dboHS_WORKER.orderByClause = "order by CREATE_TIME desc";
    dboHS_WORKER.execQuery();
}

// 加载违规记录数据
function loadIllegal() {
    dboHS_ENTERPRISE_ILLEGAL.whereClause = "where HS_ENTERPRISE = '" + enterpriseOid + "'";
    dboHS_ENTERPRISE_ILLEGAL.orderByClause = "order by ILLEGAL_DATE desc";
    dboHS_ENTERPRISE_ILLEGAL.execQuery();
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
    
	// 用户定义初始化
	initCatalog();
    loadEnterprise();
    tvwCatalog_click();
};

// 目录节点单击事件响应
function tvwCatalog_click() {
    var catalogId = tvwCatalog.getValue();
    if (catalogId == "1") {
        $("#divDocView").show();
        $("#divSubData").hide();
        var url = encodeURI("EnterpriseDoc.html?enterpriseOid=" + enterpriseOid);
        if (enterpriseOid == null) url = "EnterpriseDoc.html";
        $("#iframeDoc").attr("src", url);
    } else if (catalogId == "2") {
        $("#divDocView").show();
        $("#divSubData").hide();
        $("#iframeDoc").attr("src", encodeURI("EnterprisePicturesForm.html?enterpriseOid=" + enterpriseOid));
    } else if (catalogId == "3") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divServiceList").show();
        $("#divWorkerList").hide();
        $("#divIllegalList").hide();
        lblSubDataTitle.setValue("服务产品列表");
        loadService();
    } else if (catalogId == "4") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divServiceList").hide();
        $("#divWorkerList").show();
        $("#divIllegalList").hide();
        lblSubDataTitle.setValue("服务人员列表");
        loadWorker();
    } else if (catalogId == "5") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divServiceList").hide();
        $("#divWorkerList").hide();
        $("#divIllegalList").show();
        lblSubDataTitle.setValue("违规记录列表");
        loadIllegal();
    } else if (catalogId == "6") {
        $("#divDocView").show();
        $("#divSubData").hide();
        $("#iframeDoc").attr("src", "");
    }
};

// 企业审核通过
function btnAuditSuccess_click() {
    var url = encodeURI("../HSBOSS/BizLogDialog.html?logType=001&bizOid=" + enterpriseOid);
    popUpDialog(url, 200, 150, "企业注册审核通过", btnAuditSuccess_retrun);
};
function btnAuditSuccess_retrun() {
    var enterprise = dboHS_ENTERPRISE.getByOid(enterpriseOid);
    enterprise.setItem("STATUS", "4");
    dboHS_ENTERPRISE.execUpdate(enterprise);
   	loadEnterprise();
    tvwCatalog_click();
};

// 企业审核不过
function btnAuditFaild_click() {
    var url = encodeURI("../HSBOSS/BizLogDialog.html?logType=002&bizOid=" + enterpriseOid);
    popUpDialog(url, 200, 150, "企业注册审核失败", btnAuditFaild_retrun);
};
function btnAuditFaild_retrun() {
    var enterprise = dboHS_ENTERPRISE.getByOid(enterpriseOid);
    enterprise.setItem("STATUS", "3");
    dboHS_ENTERPRISE.execUpdate(enterprise);
    tvwCatalog_click();
};

// 暂停企业业务
function btnStopBiz_click() {
    var url = encodeURI("../HSBOSS/BizLogDialog.html?logType=004&bizOid=" + enterpriseOid);
    popUpDialog(url, 200, 150, "暂停企业业务", btnStopBiz_retrun);
};
function btnStopBiz_retrun() {
    var enterprise = dboHS_ENTERPRISE.getByOid(enterpriseOid);
    enterprise.setItem("STATUS", "9");
    dboHS_ENTERPRISE.execUpdate(enterprise);
   	loadEnterprise();
    tvwCatalog_click();
};

// 恢复企业业务
function btnRestoreBiz_click() {
    var url = encodeURI("../HSBOSS/BizLogDialog.html?logType=005&bizOid=" + enterpriseOid);
    popUpDialog(url, 200, 150, "恢复企业业务", btnRestoreBiz_retrun);
};
function btnRestoreBiz_retrun() {
    var enterprise = dboHS_ENTERPRISE.getByOid(enterpriseOid);
    enterprise.setItem("STATUS", "4");
    dboHS_ENTERPRISE.execUpdate(enterprise);
   	loadEnterprise();
    tvwCatalog_click();
};

// 删除企业资料
function btnDeleteAll_click() {
    var url = encodeURI("../HSBOSS/BizLogDialog.html?logType=003&bizOid=" + enterpriseOid);
    popUpDialog(url, 200, 150, "删除企业资料", btnDeleteAll_retrun);
};
function btnDeleteAll_retrun() {
	var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "delete HS_PROVIDE_CONTRACT where HS_ENTERPRISE = '" + enterpriseOid + "'";
    dba.execUpdate();
    
    dba.SQL = "update HS_WORKER set HS_ENTERPRISE = null, HS_DIRECTOR = null where HS_ENTERPRISE = '" + enterpriseOid + "'";
    dba.execUpdate();
    
    dba.SQL = "delete HS_ENTERPRISE where OID = '" + enterpriseOid + "'";
	dba.execUpdate();
    
    parent.mdiContainer.closePage(parent.mdiContainer.getSelectedIndex());    
};

// 查找按钮单击事件响应
function btnSearch_click() {
};

// 添加按钮单击事件响应
function btnAdd_click() {
    var catalogId = tvwCatalog.getValue();
	if (catalogId == "3") {
        var url = encodeURI("ProvideContractEditDialog.html?enterpriseOid=" + enterpriseOid);
        popUpDialog(url, 200, 150, "添加服务产品", ProvideContractEditDialog_close);
    } else if (catalogId == "4") {
        var url = encodeURI("../HSBOSS/WorkerEditForm.html?enterpriseOid=" + enterpriseOid);
        parent.mdiContainer.addPage("新服务人员档案", url);
    } else if (catalogId == "5") {
        var url = encodeURI("EnterpriseIllegalEditDialog.html?enterpriseOid=" + enterpriseOid);
        popUpDialog(url, 200, 150, "添加违规记录", EnterpriseIllegalEditDialog_close); 
    }
};

// 编辑按钮单击事件响应
function btnEdit_click() {
    var catalogId = tvwCatalog.getValue();
	if (catalogId == "3") {
        var provideContractOid = dgrService.getValue();
        var url = encodeURI("ProvideContractEditDialog.html?provideContractOid=" + provideContractOid);
        popUpDialog(url, 200, 150, "编辑服务产品", ProvideContractEditDialog_close);
    } else if (catalogId == "4") {
        var workerOid = dgrWorker.getValue();
        var url = encodeURI("../HSBOSS/WorkerEditForm.html?workerOid=" + workerOid);
       	parent.mdiContainer.addPage("服务人员档案", url);
    } else if (catalogId == "5") {
        var enterpriseIllegalOid = dgrIllegal.getValue();
        var url = encodeURI("EnterpriseIllegalEditDialog.html?enterpriseIllegalOid=" + enterpriseIllegalOid);
        popUpDialog(url, 200, 150, "编辑违规记录", EnterpriseIllegalEditDialog_close); 
    }
};

// 签约服务对话框返回
function ProvideContractEditDialog_close(oid) {
    loadService();
    dgrService.setValue(oid);
};

// 违规记录编辑窗口关闭事件响应
function EnterpriseIllegalEditDialog_close(oid) {
    loadIllegal();
    dgrIllegal.setValue(oid);
};

// 服务产品列表单击事件响应
function dgrService_dbclick() {
    btnEdit_click();
};

// 服务人员列表单击事件响应
function dgrWorker_dbclick() {
    btnEdit_click();
};


// 服务产品列表单击事件响应
function dgrIllegal_dbclick() {
    btnEdit_click()
};

// 删除按钮单击事件响应
function btnDelete_click() {
};

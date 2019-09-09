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
var dboHS_SERVICE_RATE = null;
var dboHS_FAVOURABLE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明  
var lblDocTitle = null;
var tvwCatalog = null;
var lblSuubDataTitle = null;
var dgrServiceRate = null;
var dgrFavourable = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var enterpriseOid = getUrlParam("enterpriseOid");
var serviceType = getUrlParam("serviceType");
var serviceOid = getUrlParam("serviceOid");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");
    dtCatalog = new entlogic_data_table();
	dboHS_SERVICE_RATE = new entlogic_dbo("HSBOSS", "HS_SERVICE_RATE");
	dboHS_FAVOURABLE = new entlogic_dbo("HSBOSS", "HS_FAVOURABLE");
	
	// 初始化交互组件
    lblDocTitle = new entlogic_ui_output("lblDocTitle", formControls);
    
    tvwCatalog = new entlogic_ui_treeview("tvwCatalog", formControls);
    tvwCatalog.setBindingData(dtCatalog);
    tvwCatalog.nodeClick = tvwCatalog_click;
    
    lblSubDataTitle = new entlogic_ui_output("lblSubDataTitle", formControls);
    
    dgrServiceRate = new entlogic_ui_datagrid("dgrServiceRate", formControls);
    dgrServiceRate.setBindingData(dboHS_SERVICE_RATE.dataTable);
    dgrServiceRate.rowDbclick = btnEdit_click;
    
    dgrFavourable = new entlogic_ui_datagrid("dgrFavourable", formControls);
    dgrFavourable.setBindingData(dboHS_FAVOURABLE.dataTable);
    dgrFavourable.rowDbclick = btnEdit_click;
    
    $("#btnSearch").click(btnSearch_click);
    $("#btnAdd").click(btnAdd_click);
    $("#btnEdit").click(btnEdit_click);
    $("#btnDelete").click(btnDelete_click);
};

// 设置档案标题
function setDocTitle() {
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "select ANOTHER_NAMER from HS_SERVICE where OID='" + serviceOid + "'";
    var dt = dba.execQuery();
    if (dt != null && dt.getSize() > 0) {
        var dr = dt.getRecord(0);
        lblDocTitle.setValue("档案目录（" + dr.getValue("ANOTHER_NAMER") + "）");
    } else {
        lblDocTitle.setValue("档案目录（新服务产品）");
    }
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
    dr.addItem("text", "2.产品报价");
    dtCatalog.addRecord(dr);
    
    dr = new entlogic_data_record();
    dr.addItem("id", "3");
    dr.addItem("lv", "0");
    dr.addItem("text", "3.优惠政策");
    dtCatalog.addRecord(dr);
    
    dr = new entlogic_data_record();
    dr.addItem("id", "4");
    dr.addItem("lv", "0");
    dr.addItem("text", "4.业务统计");
    dtCatalog.addRecord(dr);
    
    dr = new entlogic_data_record();
    dr.addItem("id", "5");
    dr.addItem("lv", "0");
    dr.addItem("text", "5.图片资源");
    dtCatalog.addRecord(dr);
    
    // 同步显示
    dtCatalog.synchronizeLayout();
};

// 加载产品报价数据
function loadServiceRate() {
    dboHS_SERVICE_RATE.whereClause = "where HS_SERVICE = '" + serviceOid + "'";
    dboHS_SERVICE_RATE.orderByClause = "order by START_TIME desc";
    dboHS_SERVICE_RATE.execQuery();
}

// 加载优惠政策数据
function loadFavourable() {
    dboHS_FAVOURABLE.whereClause = "where HS_SERVICE = '" + serviceOid + "'";
    dboHS_FAVOURABLE.orderByClause = "order by START_TIME desc";
    dboHS_FAVOURABLE.execQuery();
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
    setDocTitle();
    initCatalog();
    tvwCatalog_click();
};

// 目录节点单击事件响应
function tvwCatalog_click() {
    var catalogId = tvwCatalog.getValue();
    if (catalogId == "1") {
        $("#divDocView").show();
        $("#divSubData").hide();
        if (serviceOid != null) {
            var url = encodeURI("ServiceDoc.html?serviceOid=" + serviceOid);
        	$("#iframeDoc").attr("src", url);
        } else if (serviceType != null) {
            var url = encodeURI("ServiceDoc.html?serviceType=" + serviceType);
        	$("#iframeDoc").attr("src", url);
        } else if (enterpriseOid != null) {
            var url = encodeURI("ServiceDoc.html?enterpriseOid=" + enterpriseOid);
        	$("#iframeDoc").attr("src", url);
        }
    } else if (catalogId == "2") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divRate").show();
        $("#divFavourable").hide();
        lblSubDataTitle.setValue("产品报价列表");
        loadServiceRate();
    } else if (catalogId == "3") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divRate").hide();
        $("#divFavourable").show();
        lblSubDataTitle.setValue("优惠政策列表");
        loadFavourable();
    } else if (catalogId == "4") {
        $("#divDocView").show();
        $("#divSubData").hide();
        $("#iframeDoc").attr("src", "");
    } else if (catalogId == "5") {
        $("#divDocView").show();
        $("#divSubData").hide();
        var url = encodeURI("AccessoryImageFrame.html?bizOid=" + serviceOid);
        $("#iframeDoc").attr("src", url);
    }
};


// 产品报价列表单击事件响应
function dgrServiceRate_dbclick() {
};


// 优惠政策列表单击事件响应
function dgrFavourable_dbclick() {
};

// 查找按钮单击事件响应
function btnSearch_click() {
};

// 添加按钮单击事件响应
function btnAdd_click() {
    var catalogId = tvwCatalog.getValue();
	if (catalogId == "2") {
        var url = encodeURI("ServiceRateEditDialog.html?serviceOid=" + serviceOid);
        popUpDialog(url, 600, 676, "添加产品报价", ServiceRateEditDialog_close); 
    } else if (catalogId == "3") {
        var url = encodeURI("FavourableEditDialog.html?serviceOid=" + serviceOid);
        popUpDialog(url, 600, 676, "添加优惠政策", FavourableEditDialog_close); 
    }
};

// 编辑按钮单击事件响应
function btnEdit_click() {
    var catalogId = tvwCatalog.getValue();
	if (catalogId == "2") {
        var serviceRateOid = dgrServiceRate.getValue();
        var url = encodeURI("ServiceRateEditDialog.html?serviceRateOid=" + serviceRateOid);
        popUpDialog(url, 600, 676, "修改产品报价", ServiceRateEditDialog_close); 
    } else if (catalogId == "3") {
        var favourableOid = dgrFavourable.getValue();
        var url = encodeURI("FavourableEditDialog.html?favourableOid=" + favourableOid);
        popUpDialog(url, 600, 676, "修改优惠政策", FavourableEditDialog_close); 
    }
};

// 删除按钮单击事件响应
function btnDelete_click() {
    var dba = new entlogic_dba("jdbc/entlogic");
    
    var catalogId = tvwCatalog.getValue();
	if (catalogId == "2") {
        var serviceRateOid = dgrServiceRate.getValue();
        dba.SQL = "delete HS_SERVICE_RATE where OID = '" + serviceRateOid + "'";
        dba.execUpdate();
        loadServiceRate();
    } else if (catalogId == "3") {
        var favourableOid = dgrFavourable.getValue();
        dba.SQL = "delete HS_FAVOURABLE where OID = '" + favourableOid + "'";
        dba.execUpdate();
        loadFavourable();
    }
};

// 产品报价编辑窗口关闭事件响应
function ServiceRateEditDialog_close(oid) {
    loadServiceRate();
    dgrServiceRate.setValue(oid);
};

// 优惠政策编辑窗口关闭事件响应
function FavourableEditDialog_close(oid) {
    loadFavourable();
    dgrFavourable.setValue(oid);
};

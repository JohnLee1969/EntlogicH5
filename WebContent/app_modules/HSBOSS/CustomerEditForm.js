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


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明  
var lblDocTitle = null;
var tvwCatalog = null;
var lblSubDataTitle = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var customerOid = getUrlParam("customerOid");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dtCatalog = new entlogic_data_table();
 	
	// 初始化交互组件
    lblDocTitle = new entlogic_ui_output("lblDocTitle", formControls);
    
    tvwCatalog = new entlogic_ui_treeview("tvwCatalog", formControls);
    tvwCatalog.setBindingData(dtCatalog);
    tvwCatalog.nodeClick = tvwCatalog_nodeClick;
    
    lblSubDataTitle = new entlogic_ui_output("lblSubDataTitle", formControls);
};

// 设置档案标题
function setDocTitle() {
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "select NAME from HS_CUSTOMER where OID='" + customerOid + "'";
    var dt = dba.execQuery();
    if (dt.getSize() > 0) {
        var dr = dt.getRecord(0);
        lblDocTitle.setValue("档案目录（" + dr.getValue("NAME") + "）");
    } else {
        lblDocTitle.setValue("档案目录（新客户）");
    }
};

// 初始化档案目录
function loadCatalog() {
    // 清空当前记录
    dtCatalog.clear();
    
    // 基本信息项
    var dr = new entlogic_data_record();
    dr.addItem("id", "1");
    dr.addItem("lv", "0");
    dr.addItem("text", "1.基本信息");
    dtCatalog.addRecord(dr);
    
    // 服务地址
    dr = new entlogic_data_record();
    dr.addItem("id", "2");
    dr.addItem("lv", "0");
    dr.addItem("text", "2.服务地址");
    dtCatalog.addRecord(dr);
    
    // 银行卡号
    dr = new entlogic_data_record();
    dr.addItem("id", "3");
    dr.addItem("lv", "0");
    dr.addItem("text", "3.银行卡号");
    dtCatalog.addRecord(dr);
    
    // 消费记录
    dr = new entlogic_data_record();
    dr.addItem("id", "4");
    dr.addItem("lv", "0");
    dr.addItem("text", "4.消费记录");
    dtCatalog.addRecord(dr);
    
    // 投诉记录
    dr = new entlogic_data_record();
    dr.addItem("id", "5");
    dr.addItem("lv", "0");
    dr.addItem("text", "5.投诉记录");
    dtCatalog.addRecord(dr);
    
    // 失信记录
    dr = new entlogic_data_record();
    dr.addItem("id", "6");
    dr.addItem("lv", "0");
    dr.addItem("text", "6.失信记录");
    dtCatalog.addRecord(dr);
    
    // 综合统计
    dr = new entlogic_data_record();
    dr.addItem("id", "7");
    dr.addItem("lv", "0");
    dr.addItem("text", "7.综合统计");
    dtCatalog.addRecord(dr);


    // 同步显示
    dtCatalog.synchronizeLayout();
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
        var url = encodeURI("../HSBOSS/CustomerDoc.html?customerOid=" + customerOid);
        if (customerOid == null) url = "../HSBOSS/CustomerDoc.html";
        $("#iframeDoc").attr("src", url);
    } else if (catalogId == "2") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divLocationList").show();
        $("#divCardList").hide();
        $("#divOrderList").hide();
        $("#divComplainlList").hide();
        $("#divIllegalList").hide();
        lblSubDataTitle.setValue("服务地址列表");
        //loadWorkerRelatives();
    } else if (catalogId == "3") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divLocationList").hide();
        $("#divCardList").show();
        $("#divOrderList").hide();
        $("#divComplainlList").hide();
        $("#divIllegalList").hide();
        lblSubDataTitle.setValue("银行卡列表");
        //loadWorkerLicence();
    } else if (catalogId == "4") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divLocationList").hide();
        $("#divCardList").hide();
        $("#divOrderList").show();
        $("#divComplainlList").hide();
        $("#divIllegalList").hide();
        lblSubDataTitle.setValue("消费记录列表");
        //loadLabourContract();
    } else if (catalogId == "5") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divLocationList").hide();
        $("#divCardList").hide();
        $("#divOrderList").hide();
        $("#divComplainlList").show();
        $("#divIllegalList").hide();
        lblSubDataTitle.setValue("维权投诉列表");
        //loadLabourContract();
  } else if (catalogId == "6") {
        $("#divDocView").hide();
        $("#divSubData").show();
        $("#divLocationList").hide();
        $("#divCardList").hide();
        $("#divOrderList").hide();
        $("#divComplainlList").hide();
        $("#divIllegalList").show();
        lblSubDataTitle.setValue("失信记录列表");
        //loadLabourContract();
   }
};

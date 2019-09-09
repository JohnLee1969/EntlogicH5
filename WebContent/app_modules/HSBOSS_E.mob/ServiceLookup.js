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
var dboHS_CODE = null;
var dboHS_SERVICE = null;
var dboHS_SERVICE_RATE = null;
var dboHS_FAVOURABLE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lstServiceType = null;
var lstService = null;

var txtAnotherNamer = null;
var txtServiceDesc = null;
var numRate = null;

var lstFavourable = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var serviceType = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_CODE = new entlogic_dbo("HSBOSS", "HS_CODE");
    dboHS_SERVICE = new entlogic_dbo("HSBOSS", "HS_SERVICE");
    dboHS_SERVICE_RATE = new entlogic_dbo("HSBOSS", "HS_SERVICE_RATE");
    dboHS_FAVOURABLE = new entlogic_dbo("HSBOSS", "HS_FAVOURABLE");
	
	// 初始化交互组件
    lstServiceType = new entlogic_mui_list("lstServiceType", formControls);
    lstServiceType.itemCssNormal = "lstServiceType-item-normal";
    lstServiceType.itemCssSelected = "lstServiceType-item-selected";
    lstServiceType.setBindingData(dboHS_CODE.dataTable);
    lstServiceType.itemClick = lstServiceType_click;

    lstService = new entlogic_mui_list("lstService", formControls);
    lstService.itemCssNormal = "lstService-item-normal";
    lstService.itemCssSelected = "lstService-item-selected";
    lstService.setBindingData(dboHS_SERVICE.dataTable);
    lstService.itemClick = lstService_click;
    
    txtAnotherNamer = new entlogic_mui_text("txtAnotherNamer", formControls);
    txtAnotherNamer.setBindingData(dboHS_SERVICE.dataTable, "ANOTHER_NAMER");
    
    txtServiceDesc = new entlogic_mui_textarea("txtServiceDesc", formControls);
    txtServiceDesc.setBindingData(dboHS_SERVICE.dataTable, "SERVICE_DESC");
    
    numRate = new entlogic_mui_number("numRate", formControls);
    numRate.setBindingData(dboHS_SERVICE_RATE.dataTable, "RATE");
       
    lstFavourable = new entlogic_mui_list("lstFavourable", formControls);
    lstFavourable.setBindingData(dboHS_FAVOURABLE.dataTable);
    
    $("#btnExit").click(btnExit_click);
    $("#btnSelect").click(btnSelect_click);
};

// 加载服务类别标签
function loadServiceType() {
    if (serviceType != null) {
        dboHS_CODE.whereClause = "where HS_CODE_TYPE = 'SVS_TYP' and CODE = '" + serviceType + "'";
    } else {
    	dboHS_CODE.whereClause = "where HS_CODE_TYPE = 'SVS_TYP'";
    	dboHS_CODE.orderByClause = "order by ORDER_CODE";
    }
    dboHS_CODE.execQuery();
};

// 加载服务产品列表
function loadService() {
    var drServiceType = dboHS_CODE.dataTable.getRecord(lstServiceType.getSelectedIndex());
    var serviceTypeCode = drServiceType.getValue("CODE");
    dboHS_SERVICE.whereClause = "where SERVICE_TYPE = '" + serviceTypeCode + "'";
	dboHS_SERVICE.execQuery();    
};

// 加载服务产品价格
function loadRate() {   
    var serviceOid = lstService.getValue();
    dboHS_SERVICE_RATE.whereClause = "where HS_SERVICE='" + serviceOid + "'";
    dboHS_SERVICE_RATE.execQuery();
    dboHS_SERVICE_RATE.dataTable.setSelectedIndex(0);
};

// 加载服务产品优惠
function loadFavourable() {   
    var serviceOid = lstService.getValue();
    dboHS_FAVOURABLE.whereClause = "where HS_SERVICE='" + serviceOid + "'";
    dboHS_FAVOURABLE.execQuery();
    dboHS_FAVOURABLE.dataTable.setSelectedIndex(0);
};



/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
    
    // 接收参数
    serviceType = getUrlParam("serviceType");
	
	// 用户定义初始化
	loadServiceType();
    loadService();
    loadRate();
    loadFavourable();
};

// 服务类型标签点击事件
function lstServiceType_click() {
    loadService();
    loadRate();
    loadFavourable();
};

// 服务产品选择事件
function lstService_click() {
    loadRate();
    loadFavourable();
}

// 选择产品
function btnSelect_click() {
    var drService = dboHS_SERVICE.dataTable.getRecord(lstService.getSelectedIndex());
    if (drService != null) {       
        var value = drService.getValue("OID");
        var text = drService.getValue("ANOTHER_NAME");
        lookupCallBack(value, text);
        dialogCallBack(value, text);
        subFormCallBack(value, text);
    }
    closeLookup();
    closeDialog();
    closeSubForm();
};

function btnExit_click() {
    closeLookup();
    closeDialog();
    closeSubForm();
};
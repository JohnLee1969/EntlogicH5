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
var dboHS_CODE = null;
var dboHS_SERVICE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lstServiceType = null;
var dgrService = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_CODE = new entlogic_dbo("HSBOSS", "HS_CODE");
    dboHS_SERVICE = new entlogic_dbo("HSBOSS", "HS_SERVICE");
	
	// 初始化交互组件
    lstServiceType = new entlogic_ui_list("lstServiceType", formControls);
    lstServiceType.setBindingData(dboHS_CODE.dataTable);
    lstServiceType.itemClick = lstServiceType_itemClick;
     
    dgrService = new entlogic_ui_datagrid("dgrService",formControls);
    dgrService.setBindingData(dboHS_SERVICE.dataTable);
    dgrService.rowDbclick = btnOk_click;
 
    $("#btnOk").click(btnOk_click);
};

// 加载服务类型数据
function loadServiceType() {
	var dba = new entlogic_dba("jdbc/entlogic");    
	dboHS_CODE.whereClause = "where HS_CODE_TYPE = 'SVS_TYP'";
	dboHS_CODE.orderByClause = "order by ORDER_CODE";   
	dboHS_CODE.execQuery();    
};

// 加载服务数据
function loadService() {
    var drServiceType = dboHS_CODE.dataTable.getRecord(lstServiceType.getSelectedIndex());
    var serviceTypeCode = drServiceType.getValue("CODE");
    dboHS_SERVICE.whereClause = "where SERVICE_TYPE='" + serviceTypeCode + "'";
    dboHS_SERVICE.execQuery();
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadServiceType();
    loadService();
};

// 刷新页面接口
function refresh() {
    loadService();    
};

// 服务分类别节点单击事件响应
function lstServiceType_itemClick() {
    loadService();
};

// 确定按钮单击事件响应
function btnOk_click() {
    // 获取当前选项
    var dr = dboHS_SERVICE.dataTable.getRecord(dgrService.getSelectedIndex());
    var value = "";
    var text = "";
    if (dr != null) {
        value = dr.getValue("OID");
        text = dr.getValue("ANOTHER_NAMER");
    }
	
	// 返回父窗口
	dialogCallBack(value, text);
    closeDialog();
};


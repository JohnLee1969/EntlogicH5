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
var dgrEnterprise = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_ENTERPRISE = new entlogic_dbo("HSBOSS", "HS_ENTERPRISE");
	
	// 初始化交互组件
    dgrEnterprise = new entlogic_ui_datagrid("dgrEnterprise", formControls);
    dgrEnterprise.setBindingData(dboHS_ENTERPRISE.dataTable);
    dgrEnterprise.rowDbclick = btnEdit_click;
    
    $("#btnSearch").click(btnSearch_click);
    $("#btnAdd").click(btnAdd_click);
    $("#btnEdit").click(btnEdit_click);
    $("#btnDelete").click(btnDelete_click);
};

// 刷新页面接口实现
function refresh() {
    loadEnterprise();
};

// 加载数据
function loadEnterprise() {
    dboHS_ENTERPRISE.whereClause = "where 1=1";
    dboHS_ENTERPRISE.orderByClause = "order by REGIST_DATE";
    dboHS_ENTERPRISE.execQuery();
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadEnterprise();
};

// 查找按钮单击事件响应
function btnSearch_click() {
	loadEnterprise();
};

// 添加按钮单击事件响应
function btnAdd_click() {
	parent.mdiContainer.addPage("添加家政企业", "../HSBOSS/EnterpriseEditForm.html");
};

// 编辑按钮单击事件响应
function btnEdit_click() {
    var enterpriseOid = dgrEnterprise.getValue();
    var url = encodeURI("../HSBOSS/EnterpriseEditForm.html?enterpriseOid=" + enterpriseOid);
    parent.mdiContainer.addPage("家政企业档案", url);
};

// 删除按钮单击事件响应
function btnDelete_click() {
    var enterpriseOid = dgrEnterprise.getValue();
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "delete HS_ENTERPRISE where OID = '" + enterpriseOid + "'";
    if (!dba.execUpdate()) {
        alert("请先删除该企业下属的关联数据后，才能删除成功！！");
        return;
    }
    loadEnterprise();
};



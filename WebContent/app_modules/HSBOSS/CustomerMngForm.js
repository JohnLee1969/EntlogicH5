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
var dboHS_CUSTOMER = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var dgrCustomer = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明



/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_CUSTOMER = new entlogic_dbo("HSBOSS", "HS_CUSTOMER");
	
	// 初始化交互组件
    dgrCustomer = new entlogic_ui_datagrid("dgrCustomer", formControls);
    dgrCustomer.setBindingData(dboHS_CUSTOMER.dataTable);
    dgrCustomer.rowDbclick = btnEdit_click;
    
    $("#btnSearch").click(btnSearch_click);
    $("#btnAdd").click(btnAdd_click);
    $("#btnEdit").click(btnEdit_click);
    $("#btnDelte").click(btnDelete_click);
};

// 刷新借口
function refresh() {
    loadCustomer();
};

// 加载数据
function loadCustomer() {
    dboHS_CUSTOMER.orderByClause = "order by OID";
    dboHS_CUSTOMER.execQuery();
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadCustomer();
};

// 查找按钮单击事件响应
function btnSearch_click() {
};

// 添加按钮单击事件响应
function btnAdd_click() {
    var url = encodeURI("../HSBOSS/CustomerEditForm.html");
    parent.mdiContainer.addPage("添加客户资料", url);
};

// 编辑按钮单击事件响应
function btnEdit_click() {
    var customerOid = dgrCustomer.getValue();
    var url = encodeURI("../HSBOSS/CustomerEditForm.html?customerOid=" + customerOid);
    parent.mdiContainer.addPage("编辑客户资料", url);
};

// 删除按钮单击事件响应
function btnDelete_click() {
    var dba = new entlogic_dba("jdbc/entlogic");
    
    var customerOid = dgrCustomer.getVaue();   
    dba.SQL = "delete HS_CUSTOMER where OID = '" + customerOid + "'";
    if (!dba.execUpdate()) {
        alert("请先删除该客户下属的关联数据后，再删除主档案！！");
        return;
    }
    loadCustomer();
};

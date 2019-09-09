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
var dboBD_MODULE = null;
var dboBD_TEST_CASE = null;
var dboBD_BUG = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtModuleName = null;
var txtUpdateUser = null;
var txtUpdateTime = null;
var txtModuleDesc = null;
var numWorkload = null;
var lstTestCase = null;
var lstBug = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var userOid = parent.userOid;
var moduleOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboBD_MODULE = new entlogic_dbo("entlogicBuilder", "BD_MODULE");            
    dboBD_TEST_CASE = new entlogic_dbo("entlogicBuilder", "BD_TEST_CASE");            
    dboBD_BUG = new entlogic_dbo("entlogicBuilder", "BD_BUG");            
	
	// 初始化交互组件
    txtModuleName = new entlogic_ui_text("txtModuleName", formControls);
    txtModuleName.setBindingData(dboBD_MODULE.dataTable, "MODULE_NAME");
    
    txtUpdateUser = new entlogic_ui_text("txtUpdateUser", formControls);
    txtUpdateUser.setBindingData(dboBD_MODULE.dataTable, "UPDATE_USER");
    txtUpdateUser.setEnabled(false);
    
    txtUpdateTime = new entlogic_ui_text("txtUpdateTime", formControls);
    txtUpdateTime.setBindingData(dboBD_MODULE.dataTable, "UPDATE_TIME");
    txtUpdateTime.setEnabled(false);
    
    txtModuleDesc = new entlogic_ui_textarea("txtModuleDesc", formControls);
    txtModuleDesc.setBindingData(dboBD_MODULE.dataTable, "MODULE_DESC");
     
    numWorkload = new entlogic_ui_number("numWorkload", formControls);
    numWorkload.setBindingData(dboBD_MODULE.dataTable, "WORKLOAD");
   
    lstTestCase = new entlogic_ui_list("lstTestCase", formControls);
    lstTestCase.setBindingData(dboBD_TEST_CASE.dataTable);
    lstTestCase.itemDbclick = btnEditTestCase_click;
    
    lstBug = new entlogic_ui_list("lstBug", formControls);
    lstBug.setBindingData(dboBD_BUG.dataTable);
    lstBug.itemDbclick = btnEditBug_click;
    
	$("#btnSave").click(btnSave_click);
	$("#btnAddTestCase").click(btnAddTestCase_click);
	$("#btnEditTestCase").click(btnEditTestCase_click);
	$("#btnDeleteTestCase").click(btnDeleteTestCase_click);
	$("#btnAddBug").click(btnAddBug_click);
	$("#btnEditBug").click(btnEditBug_click);
	$("#btnDeleteBug").click(btnDeleteBug_click);
};

// 加载模块数据
function loadModule() {
   	moduleOid = parent.appName + "_" + parent.formName;
    dboBD_MODULE.whereClause = "where OID = '" + moduleOid + "'";
    dboBD_MODULE.execQuery();
}

// 加载测试用例
function loadTestCase() {
    dboBD_TEST_CASE.whereClause = "where MODULE = '" + moduleOid + "'";
    dboBD_TEST_CASE.orderByClause = "order by SN";
    dboBD_TEST_CASE.execQuery();
}

// 加载错误
function loadBug() {
    dboBD_BUG.whereClause = "where MODULE = '" + moduleOid + "'";
    dboBD_BUG.orderByClause = "order by PRIORITY, TEST_TIME";
    dboBD_BUG.execQuery();
}


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadModule();
    loadTestCase();
    loadBug();
};

// 退出按钮单击事件响应
function btnSave_click() {
	dboBD_MODULE.execUpdate();
    popUpMessage("保存成功！");
	return;
};

// 添加测试用例按钮点击
function btnAddTestCase_click() {
    var url = "TestCaseEditDialog.html?moduleOid=" + moduleOid;
    popUpDialog(url, 200, 150, "添加测试用例", function(oid) {
        loadTestCase();
        lstTestCase.setValue(oid);
    });
};


// 编辑测试用例按钮点击
function btnEditTestCase_click() {
    var testCaseOid = lstTestCase.getValue();
    var url = "TestCaseEditDialog.html?testCaseOid=" + testCaseOid;
    popUpDialog(url, 200, 150, "修改测试用例", function(oid) {
        loadTestCase();
        lstTestCase.setValue(oid);
    });
};

// 删除测试用例按钮点击
function btnDeleteTestCase_click() {
	if (!confirm("确实要删除该用例吗？")) return;

    var testCaseOid = lstTestCase.getValue();
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "delete BD_TEST_CASE where OID = '" + testCaseOid + "'";
    dba.execUpdate();
    loadTestCase();
};


// 添加测试错误按钮点击
function btnAddBug_click() {
    var url = "BugEditDialog.html?moduleOid=" + moduleOid;
    popUpDialog(url, 200, 150, "添加错误记录", function(oid) {
        loadBug();
        lstBug.setValue(oid);
    });
};


// 编辑测试错误按钮点击
function btnEditBug_click() {
    var bugOid = lstBug.getValue();
    var url = "BugEditDialog.html?bugOid=" + bugOid;
    popUpDialog(url, 200, 150, "编辑错误记录", function(oid) {
        loadBug();
        lstBug.setValue(oid);
    });
};

// 删除测试错误按钮点击
function btnDeleteBug_click() {
	if (!confirm("确实要删除该错误记录吗？")) return;

    var bugOid = lstBug.getValue();
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "delete BD_BUG where OID = '" + bugOid + "'";
    dba.execUpdate();
    loadTestCase();
};


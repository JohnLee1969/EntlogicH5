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
var dboBD_USER = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lstUser = null;
var selUserType = null;
var txtUserName = null;
var txtPassword = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    dboBD_USER = new entlogic_dbo("entlogicBuilder", "BD_USER");
   
	// 初始化交互组件
    lstUser = new entlogic_ui_list("lstUser", formControls);
    lstUser.setBindingData(dboBD_USER.dataTable);
    
    selUserType = new entlogic_ui_select("selUserType", formControls);
    selUserType.setBindingData(dboBD_USER.dataTable, "USER_TYPE");
    
    txtUserName = new entlogic_ui_text("txtUserName", formControls);
    txtUserName.setBindingData(dboBD_USER.dataTable, "USER_NAME");
    
    txtPassword = new entlogic_ui_text("txtPassword", formControls);
    txtPassword.setBindingData(dboBD_USER.dataTable, "PASSWORD");
   
    $("#btnAdd").click(btnAdd_click);
    $("#btnDelete").click(btnDelete_click);
    $("#btnSave").click(btnSave_click);
};

// 加载数据
function loadData() {
    dboBD_USER.orderByClause = "order by USER_NAME";
    dboBD_USER.execQuery();
};

// 数据检查
function checkData() {
    // 检查结果
    var result = true;
    var prompt = "错误提示：";
    
    // 检查用户名冲突
    txtUserName.setErrMessage("");
    if (txtUserName.getValue() == "") {
        txtUserName.setErrMessage("登录账号不能为空！！");
        prompt += "\n登录账号不能为空！！";
        result = result & false;
    }
    var dbo = new entlogic_dbo("entlogicBuilder", "BD_USER");
    dbo.whereClause = "where USER_NAME = '" + txtUserName.getValue() + "'";
    var n = dbo.count();
    if (n > 1) {
        txtUserName.setErrMessage("该登录账号已存在！！");
        prompt += "\n该登录账号已存在！！";
        result = result & false;
    }
    
    // 检查用户名冲突
    txtPassword.setErrMessage("");
    if (txtPassword.getValue() == "") {
        txtPassword.setErrMessage("登录密码不能为空！！");
        prompt += "\n登录密码不能为空！！";
        result = result & false;
    }
    
    // 弹出提示框
    if (!result) {
        alert(prompt);
    }
    
    return result;
};

// 添加数据
function addData() {
    var drNewUser = dboBD_USER.execCreate();
    drNewUser.setItem("OID", drNewUser.getValue("id"));
	dboBD_USER.execInsert(drNewUser);
    
    loadData();
    lstUser.setValue(drNewUser.getValue("OID"));
};

// 添加数据
function deleteData() {
    var drNewUser = dboBD_USER.execDelete();    
    loadData();
};

// 保存数据
function saveData() {
    var drUser = dboBD_USER.dataTable.getRecord(lstUser.getSelectedIndex());
	var userOid = txtUserName.getValue();
    drUser.setItem("OID", userOid);
	dboBD_USER.execUpdate();
    
    loadData();
    lstUser.setValue(userOid);
    
    popUpMessage("保存成功！");
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadData();
};

// 添加按钮单击时间响应
function btnAdd_click() {
    addData();
};

// 删除按钮单击时间响应
function btnDelete_click() {
	if (!confirm("确实要删除该用户吗？")) return;    
    deleteData();
};

// 保存按钮单击事件响应
function btnSave_click() {
    // 检查数据合法性
    if (!checkData()) return;
    
    // 保存数据
    saveData();
};

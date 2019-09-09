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
    txtUserName = new entlogic_ui_text("txtUserName", formControls);
    txtPassword = new entlogic_ui_text("txtPassword", formControls);
   
    $("#btnLogin").click(btnLogin_click);
    OK = btnLogin_click;
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
    initKeys();
	initComponents();
};

// 保存按钮单击事件响应
function btnLogin_click() {
    // 登录验证
    dboBD_USER.whereClause = "where USER_NAME = '" + txtUserName.getValue() + "' and PASSWORD = '" + txtPassword.getValue() + "'";
    dboBD_USER.execQuery();
    if (dboBD_USER.dataTable.getSize() == 0) {
        alert( "用户名或口令错误！！！");
        return;
    }
    var drUser = dboBD_USER.dataTable.getRecord(0);
    var userOid = drUser.getValue("OID");
    var userType = drUser.getValue("USER_TYPE");
    
	// 进入IDE主页
    jumpTo("IDEForm.html?userOid=" + userOid + "&userType=" + userType);
};

/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 应用全局对象
var application = parent.application;

// 应用的根目录
var applicationRoot = localStorage.getItem("applicationRoot");

//本页面控件容器
 var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    
var dboHS_ENTERPRISE = null;
var dboHS_DIRECTOR = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtUserName = null;
var txtPassword = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var loginType = "E" // E：企业登录， D：导师登录
var userName = null;

/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_ENTERPRISE = new entlogic_dbo("HSBOSS", "HS_ENTERPRISE");
    dboHS_DIRECTOR = new entlogic_dbo("HSBOSS", "HS_DIRECTOR");
	
	// 初始化交互组件
    txtUserName = new entlogic_mui_text("txtUserName", formControls);   
    txtUserName.setValue("18607816066");
    
    txtPassword = new entlogic_mui_text("txtPassword", formControls);
    txtPassword.setValue("123");
   
    $("#btnEnterpriseLogin").click(btnEnterpriseLogin_click);
    $("#btnDirectorLogin").click(btnDirectorLogin_click);
    $("#btnLogin").click(btnLogin_click);
    $("#btnGotoRegisterEnterprise").click(btnGotoRegisterEnterprise_click);
    $("#btnFindBackPassword").click(btnFindBackPassword_click);
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化
    userName=localStorage.getItem("userName");
    if(userName!==null)
    {
        txtUserName.setValue(userName);
    }
};

// 切换至企业企业按钮单击事件
function btnEnterpriseLogin_click() {
    loginType = "E";
    $("#btnEnterpriseLogin").attr("class", "button login-type-selected");
    $("#btnDirectorLogin").attr("class", "button login-type");
    $("#btnGotoRegisterEnterprise").show();
};

// 切换至导师登录按钮单击事件
function btnDirectorLogin_click() {
    loginType = "D";
    $("#btnEnterpriseLogin").attr("class", "button login-type");
    $("#btnDirectorLogin").attr("class", "button login-type-selected");
    $("#btnGotoRegisterEnterprise").hide();
};

// 登录按钮单击事件
function btnLogin_click() {
    dboHS_ENTERPRISE.whereClause = "where ACCOUNT='" + txtUserName.getValue() + "' and PASSWORD='new'";
	dboHS_ENTERPRISE.execQuery();
    if (dboHS_ENTERPRISE.dataTable.getSize() > 0) {
    	var enterpriseOid = dboHS_ENTERPRISE.dataTable.getRecord(0).getValue("OID");
        application.popUpErrorTips("错误提示", "您还没有完成新企业账户注册，请继续设置密码！！");
        application.jumpTo("RegisterEnterpriseForm1.html?enterpriseOid=" + enterpriseOid);
        return;
    }
    if (loginType == "E") {
        dboHS_ENTERPRISE.whereClause = "where ACCOUNT='" + txtUserName.getValue() + "' and PASSWORD='" + txtPassword.getValue() + "'";
        dboHS_ENTERPRISE.execQuery();
        if (dboHS_ENTERPRISE.dataTable.getSize() > 0) {
            var enterpriseOid = dboHS_ENTERPRISE.dataTable.getRecord(0).getValue("OID");           
           	localStorage.setItem("enterpriseOid", enterpriseOid);         
           	localStorage.setItem("userName", txtUserName.getValue());
            localStorage.removeItem("directorOid");
            application.jumpTo("MainForm.html");
            return;
        } else {
            application.popUpErrorTips("错误提示", "登录账号或密码错误！！");
            txtPassword.setValue("");
            return;
        }
    } else {
        dboHS_DIRECTOR.whereClause = "where ACCOUNT='" + txtUserName.getValue() + "' and PASSWORD='" + txtPassword.getValue() + "'";
        dboHS_DIRECTOR.execQuery();
        if (dboHS_DIRECTOR.dataTable.getSize() > 0) {
            var enterpriseOid = dboHS_DIRECTOR.dataTable.getRecord(0).getValue("HS_ENTERPRISE");
            var directorOid = dboHS_DIRECTOR.dataTable.getRecord(0).getValue("OID");
           	localStorage.setItem("enterpriseOid", enterpriseOid);
            localStorage.setItem("directorOid", directorOid);  
           	localStorage.setItem("userName", txtUserName.getValue());
            application.jumpTo("MainForm.html");
            return;
        } else {
            application.popUpErrorTips("错误提示", "登录账号或密码错误！！");
            txtPassword.setValue("");
            return;
        }
    }
};

// 注册新用户按钮单击事件
function btnGotoRegisterEnterprise_click() {
    application.jumpTo("RegisterEnterpriseForm0.html");
};

// 找回密码按钮单击事件
function btnFindBackPassword_click() {
    application.jumpTo("FindBackPasswordForm0.html");
};

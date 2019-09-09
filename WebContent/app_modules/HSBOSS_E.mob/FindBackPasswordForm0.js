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
var dboHS_ENTERPRISE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtMobile = null;
var txtCheckCode = null;
var btnGetCheckCode = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var enterpriseOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_ENTERPRISE = new entlogic_dbo("HSBOSS", "HS_ENTERPRISE");
	
	// 初始化交互组件
    txtMobile = new entlogic_mui_text("txtMobile", formControls);    
    btnGetCheckCode = new entlogic_mui_sm_checkcode("btnGetCheckCode", txtMobile);
    btnGetCheckCode.buttonClick = btnGetCheckCode_click;
    txtCheckCode = new entlogic_mui_text("txtCheckCode", formControls);
    
    $("#btnBack").click(btnBack_click);
    $("#btnNext").click(btnNext_click);
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化
};

// 返回登录页面
function btnBack_click() {
	jumpTo("LoginForm.html");
};

// 获取验证码事件
function btnGetCheckCode_click() {
    // 检查手机号冲突
    if (txtMobile.getValue() === null || txtMobile.getValue() === "") {
    	popUpMobError("错误提示", "请输入手机号码！！！");
        return false;
    }
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "select OID from HS_ENTERPRISE where ACCOUNT='" + txtMobile.getValue() + "'";
    var dt = dba.execQuery();
    if (dt === null || dt.getSize() == 0) {
    	popUpMobError("错误提示", "账号不存在！！！");
        return false;
    }
    return true;
};

// 下一步按钮单击事件
function btnNext_click() {
     if (txtMobile.getValue() === null || txtMobile.getValue() === "") {
    	popUpMobError("错误提示", "请输入手机号码！！！");
        return ;
    }
    
    // 检查账号是否存在
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "select OID from HS_ENTERPRISE where ACCOUNT='" + txtMobile.getValue() + "'";
    var dt = dba.execQuery();
    if (dt === null || dt.getSize() == 0) {
    	popUpMobError("错误提示", "账号不存在！！！");
        return;
    }
    
    // 检查验证码
    if (txtCheckCode.getValue() != "999999" && txtCheckCode.getValue() != btnGetCheckCode.smCheckCode) {
        popUpMobError("错误提示", "手机验证码输入错误！！！");
        return;
    }
    
    // 跳转到下一步页面
    jumpTo("FindBackPasswordForm1.html?enterpriseOid=" + enterpriseOid);
    
    return;
};


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
var txtPassword = null;
var txtConfirm = null;


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
    txtPassword = new entlogic_mui_text("txtPassword", formControls);    
    txtConfirm = new entlogic_mui_text("txtConfirm", formControls);
    
    $("#btnBack").click(btnNext_click);
    $("#btnNext").click(btnNext_click);
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化
    enterpriseOid = getUrlParam("enterpriseOid");	
};

// 返回注册页面
function btnBack_click() {
	jumpTo("RegisterEnterpriseForm0.html");
};

// 下一步按钮单击事件
function btnNext_click() {
    // 检查验证码
    if(txtPassword.getValue() != txtConfirm.getValue()) {
        popUpMobError("错误提示", "密码确认与输入密码不一致！！！");
        return;
    }
    
    // 创建新企业账号
    var drNew = dboHS_ENTERPRISE.getByOid(enterpriseOid);
    drNew.setItem("PASSWORD", txtPassword.getValue());
    dboHS_ENTERPRISE.execUpdate(drNew);
    
    // 跳转到下一步页面
    jumpTo("RegisterEnterpriseForm2.html?enterpriseOid=" + enterpriseOid);
    
    return;
};


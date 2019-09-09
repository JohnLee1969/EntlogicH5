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
var dboFW_USER = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtOilPassword = null;
var txtNewPassword = null;
var txtConfirmPassword = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var deviceID = "123456";
var drUser = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboFW_USER = new entlogic_dbo("entlogicSystem", "FW_USER");
	
	// 初始化交互组件
    txtOilPassword = new entlogic_mui_text("txtOilPassword", formControls);
    txtNewPassword = new entlogic_mui_text("txtNewPassword", formControls);
    txtConfirmPassword = new entlogic_mui_text("txtConfirmPassword", formControls);
    
    $("#btnOk").click(btnOk_click);
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化
	dboFW_USER.whereClause = "where BINDING_DEVICES like '%" + deviceID + "%'";
    dboFW_USER.execQuery();
    if (dboFW_USER.dataTable.getSize() > 0) {
       	drUser =  dboFW_USER.dataTable.getRecord(0);
        var passsword = drUser.getValue("PASSWORD");
       	txtOilPassword.setValue(passsword);
        if (passsword == "null" || passsword == "") {
            $("#divOldPassword").hide();
        }
    }   
};

// 确认按钮点击事件
function btnOk_click() {
    if (txtNewPassword.getValue() != txtConfirmPassword.getValue()) {
        popUpMobError(400, 400, "错误提示", "密码确认错误！！");
        return;
    }
    drUser.setItem("PASSWORD", txtNewPassword.getValue());
    dboFW_USER.execUpdate(drUser);
    
    jumpTo("LoginForm.html");
};


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
var txtNewPassword = null;
var txtConfirm = null;



/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var userOid = getUrlParam("userOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    dboBD_USER = new entlogic_dbo("entlogicBuilder", "BD_USER");
   
	// 初始化交互组件
    txtNewPassword = new entlogic_ui_text("txtNewPassword", formControls);
    txtConfirm = new entlogic_ui_text("txtConfirm", formControls);
   
    $("#btnSave").click(btnSave_click);
    OK = btnSave_click;
};

// 数据检查
function checkData() {
    // 检查结果
    var result = true;
    var prompt = "错误提示：";
    
    txtNewPassword.setErrMessage("");
    if (txtNewPassword.getValue() == "") {
        txtNewPassword.setErrMessage("新设密码不能为空！！");
        prompt += "\新设密码不能为空！！";
        result = result & false;
    }
    
    txtConfirm.setErrMessage("");
    if (txtConfirm.getValue() == "") {
        txtConfirm.setErrMessage("密码确认不能为空！！");
        prompt += "\密码确认不能为空！！";
        result = result & false;
    }    
    if (txtConfirm.getValue() != txtNewPassword.getValue()) {
        prompt += "\密码确认与新密码不一致！！";
        result = result & false;
    }
    
    // 弹出提示框
    if (!result) {
        alert(prompt);
    }
    
    return result;
};

// 保存数据
function saveData() {
    var drUser = dboBD_USER.getByOid(userOid);
    drUser.setItem("PASSWORD", txtNewPassword.getValue());
    dboBD_USER.execUpdate(drUser);
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
function btnSave_click() {
    // 检查数据合法性
    if (!checkData()) return;
    
    // 保存数据
    saveData();
	
	// 返回父窗口
    closeDialog();
};

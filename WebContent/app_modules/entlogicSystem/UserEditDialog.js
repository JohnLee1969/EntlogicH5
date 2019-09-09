/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 全局应用
var application = parent.application;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

// 页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    
var dboFW_ROLE = null;
var dboFW_USER_AUTHORIZATION = null;
var dboFW_USER = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtUserCode = {};
var txtUserName = {};
var txtPassword = {};
var txtRealName = {};
var selSex = {};
var txtMob = {};
var txtTel = {};
var txtEMail = {};
var selIsActive = {};
var lstRole = {};


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明

var groupOid = null;
var userOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	dboFW_ROLE = new entlogic_dbo("entlogicSystem", "FW_ROLE");
	dboFW_USER_AUTHORIZATION = new entlogic_dbo("entlogicSystem", "FW_USER_AUTHORIZATION");
	dboFW_USER = new entlogic_dbo("entlogicSystem", "FW_USER");
    
	// 初始化交互组件
	txtUserCode = new entlogic_ui_text("txtUserCode", formControls);
	txtUserCode.setBindingData(dboFW_USER.dataTable,"USER_CODE");
	
	txtUserName = new entlogic_ui_text("txtUserName", formControls);
	txtUserName.setBindingData(dboFW_USER.dataTable,"USER_NAME");
	
	txtPassword = new entlogic_ui_text("txtPassword", formControls);
	txtPassword.setBindingData(dboFW_USER.dataTable,"PASSWORD");
	
	txtRealName = new entlogic_ui_text("txtRealName", formControls);
	txtRealName.setBindingData(dboFW_USER.dataTable,"REAL_NAME");
	
	selSex = new entlogic_ui_select("selSex", formControls);
	selSex.setBindingData(dboFW_USER.dataTable,"SEX");
	
	txtMob = new entlogic_ui_text("txtMob", formControls);
	txtMob.setBindingData(dboFW_USER.dataTable,"MOB");
	
	txtTel = new entlogic_ui_text("txtTel", formControls);
	txtTel.setBindingData(dboFW_USER.dataTable,"TEL");
	
	txtEMail = new entlogic_ui_text("txtEMail", formControls);
	txtEMail.setBindingData(dboFW_USER.dataTable,"EMAIL");
	
	selIsActive = new entlogic_ui_select("selIsActive", formControls);
	selIsActive.setBindingData(dboFW_USER.dataTable,"IS_ACTIVE");
	
	lstUserAuth = new entlogic_ui_list("lstUserAuth", formControls);
	lstUserAuth.setBindingData(dboFW_ROLE.dataTable);
	lstUserAuth.setMultiselected(true);
	
	imgUserPic = new entlogic_ui_image("imgUserPic", formControls);
    imgUserPic.setBindingData(dboFW_USER.dataTable,"PIC");
    
    $("#filePic").hide();
    $("#filePic").val("");  
    $("#filePic").change(filePic_change);
    $("#btnUploadPic").click(btnUploadPic_click);
    $("#btnTakePic").click(btnTakePic_click);
	$("#btnSave").click(btnSave_click);
};

// 加载组织类型数据
function loadUser() {
    if (userOid == null) {
        var currentUser = dboFW_USER.execCreate();
        currentUser.setItem("USER_NAME", "新用户");
        
        dboFW_USER.dataTable.addRecord(currentUser);
      	dboFW_USER.dataTable.setSelectedIndex(0);
    } else {
        dboFW_USER.whereClause = "where OID = '" + userOid + "'";
        dboFW_USER.execQuery();
    }
    
    loadUserAuth();
};

// 加载用户角色授权数据
function loadUserAuth() {
    dboFW_ROLE.whereClause = "where 1 = 1";
    dboFW_ROLE.execQuery();
           
    dboFW_USER_AUTHORIZATION.whereClause = "where USER_OID = '" + userOid + "'";
    dboFW_USER_AUTHORIZATION.execQuery();
    
    var dt = dboFW_USER_AUTHORIZATION.dataTable;
    var values = dt.columnToStringArray("ROLE_OID");
    lstUserAuth.setValues(values);
};


// 数据合法行检查
function checkData() {
    // 检查结果
    var result = true;
    var prompt = "错误提示：";
    
    // 检查用户名冲突
    txtUserName.setErrMessage("");
    txtUserName.setErrMessage("");
    if (txtUserName.getValue() == "") {
        txtUserName.setErrMessage("登陆账号不能为空！！");
        prompt += "\n登陆账号不能为空！！";
        result = result & false;
    }
    var currentUser = dboFW_USER.dataTable.getRecord(0);
    if (currentUser.getValue("OID") == "" && dboFW_USER.getByOid(txtUserName.getValue()) != null) {
        txtUserName.setErrMessage("登录账号已存在！！");
        prompt += "\n登录账号已存在！！";
        result = result & false;
    }
    // 检查用户口令合法性
    txtPassword.setErrMessage("");
    if (txtPassword.getValue() == "") {
        txtPassword.setErrMessage("登录口令不能为空！！");
        prompt += "\n登录口令不能为空！！";
        result = result & false;
    }
    // 检查用户实名合法性
    txtRealName.setErrMessage("");
    if (txtRealName.getValue() == "") {
        txtRealName.setErrMessage("真实姓名不能为空！！");
        prompt += "\n真实姓名不能为空！！";
        result = result & false;
    }
    
    // 弹出提示框
    if (!result) {
        alert(prompt);
    }
    
    return result;
};

// 保存数据
function saveUser() {
    // 保存主记录数据
    if (userOid == null) {
    	var currentUser = dboFW_USER.dataTable.getRecord(0);
        userOid = txtUserName.getValue();       
        currentUser.setItem("OID", userOid);
        currentUser.setItem("GROUP_OID", groupOid);      
        dboFW_USER.execInsert();
        txtUserName.setEnabled(false);
    } else {
        dboFW_USER.execUpdate();
    }
    
    // 更新用户授权
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "delete FW_USER_AUTHORIZATION where USER_OID = '" + userOid + "'";
    dba.execUpdate();
      
    var values = lstUserAuth.getValues();
    for(var i = 0; i < values.length; i++) {
        var newDr = dboFW_USER_AUTHORIZATION.execCreate();
        newDr.setItem("OID", newDr.getValue("id"));
        newDr.setItem("ROLE_OID", values[i]);
        newDr.setItem("USER_OID", userOid);
        dboFW_USER_AUTHORIZATION.execInsert(newDr)
    } 
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
    initKeys();
	initComponents();
	
	// 接收参数
    groupOid = getUrlParam("groupOid");
	userOid = getUrlParam("userOid");
    
    // 加载数据
    loadUser();
};

// 保存按钮单击事件响应
function btnSave_click() {
    // 检查数据
    if (!checkData()) return;
    
    // 保存数据
    saveUser();
    
    // 返回主页面
    dialogCallBack(userOid);
    closeDialog();
};  

// 上传照片文件
function filePic_change() {
    // 检查数据
    if (!checkData()) return;
    
    // 保存数据
    saveUser();
    
    // 上传照片
    var file = $("#filePic")[0].files[0]; 
    var fileName = file.name;
    var fileType = getFileExt(fileName);
    var imgUrl = uploadFile(applicationRoot, "entlogicSystem", userOid, file, imgUserPic.getValue());
    
	var dr = dboFW_USER.dataTable.getRecord(0);    
    dr.setItem("PIC", imgUrl);
	dboFW_USER.execUpdate();
    
    $("#filePic").val("");  
    imgUserPic.setValue(imgUrl);
};

// 上传照片按钮点击事件
function btnUploadPic_click() {
    $("#filePic").click();
};

// 拍摄照片按钮点击事件
function btnTakePic_click() {
	popUpDialog("../entlogicCommon/CameraDialog.html", 200, 150, "拍摄用户照片", {}); 
};

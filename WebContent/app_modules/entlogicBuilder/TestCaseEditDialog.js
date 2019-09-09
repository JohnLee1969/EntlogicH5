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
var dboBD_TEST_CASE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtCaseName = null;
var txtUpdateUser = null;
var txtUpdateTime = null;
var txtCaseDesc = null;



/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var userOid = parent.userOid;
var moduleOid = getUrlParam("moduleOid");
var testCaseOid = getUrlParam("testCaseOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    dboBD_TEST_CASE = new entlogic_dbo("entlogicBuilder", "BD_TEST_CASE");
   
	// 初始化交互组件
    txtCaseName = new entlogic_ui_text("txtCaseName", formControls);
    txtCaseName.setBindingData(dboBD_TEST_CASE.dataTable, "CASE_NAME");
    
    txtUpdateUser = new entlogic_ui_text("txtUpdateUser", formControls);
    txtUpdateUser.setBindingData(dboBD_TEST_CASE.dataTable, "UPDATE_USER");
    txtUpdateUser.setEnabled(false);
    
    txtUpdateTime = new entlogic_ui_text("txtUpdateTime", formControls);
    txtUpdateTime.setBindingData(dboBD_TEST_CASE.dataTable, "UPDATE_TIME");
    txtUpdateTime.setEnabled(false);
    
    txtCaseDesc = new entlogic_ui_textarea("txtCaseDesc", formControls);
    txtCaseDesc.setBindingData(dboBD_TEST_CASE.dataTable, "CASE_DESC");
   
    $("#btnSave").click(btnSave_click);
    OK = btnSave_click;
};

// 加载数据
function loadData() {
    if (testCaseOid == null) {
      	var drNew = dboBD_TEST_CASE.execCreate();
        drNew.setItem("CASE_NAME", "新用例");
        drNew.setItem("UPDATE_USER", userOid);
      	dboBD_TEST_CASE.dataTable.addRecord(drNew);
      	dboBD_TEST_CASE.dataTable.setSelectedIndex(0);
    }
    else {
        dboBD_TEST_CASE.whereClause = "where OID = '" + testCaseOid + "'";
        dboBD_TEST_CASE.execQuery();
    }
};

// 数据检查
function checkData() {
    // 检查结果
    var result = true;
    var prompt = "错误提示：";
    
    // 检查用户名冲突
    /*
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
    */
    
    // 弹出提示框
    if (!result) {
        alert(prompt);
    }
    
    return result;
};

// 保存数据
function saveData() {
	if (testCaseOid == null) {
        var sn = parseInt(dboBD_TEST_CASE.getMax("SN")) + 1;
        var dr = dboBD_TEST_CASE.dataTable.getRecord(0);
        testCaseOid = dr.getValue("id");
        dr.setItem("OID", testCaseOid);
        dr.setItem("MODULE", moduleOid);
        dr.setItem("SN", sn);
        dr.setItem("UPDATE_USER", userOid);
		dboBD_TEST_CASE.execInsert();
	} else {
        txtUpdateUser.setValue(userOid);
		dboBD_TEST_CASE.execUpdate();
	}
}

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

// 保存按钮单击事件响应
function btnSave_click() {
    // 检查数据合法性
    if (!checkData()) return;
    
    // 保存数据
    saveData();
	
	// 返回父窗口
	dialogCallBack(testCaseOid);
    closeDialog();
};

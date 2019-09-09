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
var dtCodeFvrMod = null;
var dboHS_FAVOURABLE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明
var dtStartTime = null;
var dtEndTime = null;
var selFavourableType = null;
var txtDescription = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var serviceOid = getUrlParam("serviceOid");
var favourableOid = getUrlParam("favourableOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");
    
    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'FVR_MOD' order by ORDER_CODE";
    dtCodeFvrMod = dba.execQuery(); 
    
    dboHS_FAVOURABLE = new entlogic_dbo("HSBOSS", "HS_FAVOURABLE");
   
	// 初始化交互组件
    dtStartTime = new entlogic_ui_datetime("dtStartTime", formControls);
    dtStartTime.setBindingData(dboHS_FAVOURABLE.dataTable, "START_TIME");
    dtStartTime.setShowTime(true);
   
    dtEndTime = new entlogic_ui_datetime("dtEndTime", formControls);
    dtEndTime.setBindingData(dboHS_FAVOURABLE.dataTable, "END_TIME");
    dtEndTime.setShowTime(true);
    
    selFavourableType = new entlogic_ui_select("selFavourableType", formControls);
    selFavourableType.setBindingData(dboHS_FAVOURABLE.dataTable, "FAVOURABLE_TYPE");
    selFavourableType.setOptionsData(dtCodeFvrMod);
    
    txtDescription = new entlogic_ui_textarea("txtDescription", formControls);
    txtDescription.setBindingData(dboHS_FAVOURABLE.dataTable, "DESCRITION");
    
    $("#btnSave").click(btnSave_click);
};

// 加载数据
function loadData() {
    if (favourableOid == null) {
      	var drNew = dboHS_FAVOURABLE.execCreate();
        drNew.setItem("HS_SERVICE", serviceOid);
       
      	dboHS_FAVOURABLE.dataTable.addRecord(drNew);
      	dboHS_FAVOURABLE.dataTable.setSelectedIndex(0);
      	dboHS_FAVOURABLE.dataTable.synchronizeLayout();
    }
    else {
        dboHS_FAVOURABLE.whereClause = "where OID = '" + favourableOid + "'";
        dboHS_FAVOURABLE.orderByClause = "order by OID";
        dboHS_FAVOURABLE.execQuery();
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
	if (favourableOid == null) {
        var dr = dboHS_FAVOURABLE.dataTable.getRecord(0);
        favourableOid = dr.getValue("id");
        dr.setItem("OID", favourableOid);
		dboHS_FAVOURABLE.execInsert();
	} else {
		dboHS_FAVOURABLE.execUpdate();
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
	dialogCallBack(serviceOid);
    closeDialog();
};

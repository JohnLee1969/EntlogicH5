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
var dtCodeMER_RST = null;
var dboHS_WORKER_MER = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtMec = null;
var dtMeDate = null;
var selResult = null;
var txtNote = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var workerOid = getUrlParam("workerOid");
var workerMerOid = getUrlParam("workerMerOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");

    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'MER_RST' order by ORDER_CODE";
    dtCodeMER_RST = dba.execQuery();

    dboHS_WORKER_MER = new entlogic_dbo("HSBOSS", "HS_WORKER_MER");
   
	// 初始化交互组件   
    txtMec = new entlogic_ui_text("txtMec", formControls);
    txtMec.setBindingData(dboHS_WORKER_MER.dataTable, "MEC");
    
	dtMeDate = new entlogic_ui_datetime("dtMeDate", formControls);
    dtMeDate.setShowTime(false);
    dtMeDate.setBindingData(dboHS_WORKER_MER.dataTable, "ME_DATE");

    selResult = new entlogic_ui_select("selResult", formControls);
    selResult.setBindingData(dboHS_WORKER_MER.dataTable, "RESULT");
    selResult.setOptionsData(dtCodeMER_RST);
   
    txtNote = new entlogic_ui_textarea("txtNote", formControls);
    txtNote.setBindingData(dboHS_WORKER_MER.dataTable, "NOTE");

    $("#btnSave").click(btnSave_click);
};

// 加载数据
function loadData() {
    if (workerMerOid == null) {
      	var drNew = dboHS_WORKER_MER.execCreate();
        drNew.setItem("HS_WORKER", workerOid);
      	dboHS_WORKER_MER.dataTable.addRecord(drNew);
      	dboHS_WORKER_MER.dataTable.setSelectedIndex(0);
      	dboHS_WORKER_MER.dataTable.synchronizeLayout();
    }
    else {
        dboHS_WORKER_MER.whereClause = "where OID = '" + workerMerOid + "'";
        dboHS_WORKER_MER.execQuery();
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
	if (workerMerOid == null) {
        var dr = dboHS_WORKER_MER.dataTable.getRecord(0);
        workerMerOid = dr.getValue("id");
        dr.setItem("OID", workerMerOid);
		dboHS_WORKER_MER.execInsert();
	} else {
		dboHS_WORKER_MER.execUpdate();
	}
    return true;
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
	dialogCallBack(workerMerOid);
    closeDialog();
};

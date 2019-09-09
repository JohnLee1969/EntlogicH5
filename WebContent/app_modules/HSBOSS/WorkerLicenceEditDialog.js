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
var dtCodeLCS_TYP = null;
var dboHS_WORKER_LICENCE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var selCertType = null;
var txtCertCode = null;
var dtEffectiveDate = null;
var dtExpiryDate = null;
var txtNote = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var workerOid = getUrlParam("workerOid");
var workerLicenceOid = getUrlParam("workerLicenceOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");

    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'LCS_TYP' order by ORDER_CODE";
    dtCodeLCS_TYP = dba.execQuery();

    dboHS_WORKER_LICENCE = new entlogic_dbo("HSBOSS", "HS_WORKER_LICENCE");
   
	// 初始化交互组件
	selCertType = new entlogic_ui_select("selCertType", formControls);
    selCertType.setBindingData(dboHS_WORKER_LICENCE.dataTable, "CERT_TYPE");
    selCertType.setOptionsData(dtCodeLCS_TYP);
    
    txtCertCode = new entlogic_ui_text("txtCertCode", formControls);
    txtCertCode.setBindingData(dboHS_WORKER_LICENCE.dataTable, "CERT_CODE");
    
	dtEffectiveDate = new entlogic_ui_datetime("dtEffectiveDate", formControls);
    dtEffectiveDate.setShowTime(false);
    dtEffectiveDate.setBindingData(dboHS_WORKER_LICENCE.dataTable, "EFFECTIVE_DATE");
     
	dtExpiryDate = new entlogic_ui_datetime("dtExpiryDate", formControls);
    dtExpiryDate.setShowTime(false);
    dtExpiryDate.setBindingData(dboHS_WORKER_LICENCE.dataTable, "EXPIRY_DATE");
   
    txtNote = new entlogic_ui_textarea("txtNote", formControls);
    txtNote.setBindingData(dboHS_WORKER_LICENCE.dataTable, "NOTE");
   
    $("#btnSave").click(btnSave_click);
};

// 加载数据
function loadData() {
    if (workerLicenceOid == null) {
      	var drNew = dboHS_WORKER_LICENCE.execCreate();
      	dboHS_WORKER_LICENCE.dataTable.addRecord(drNew);
      	dboHS_WORKER_LICENCE.dataTable.setSelectedIndex(0);
    }
    else {
        dboHS_WORKER_LICENCE.whereClause = "where OID = '" + workerLicenceOid + "'";
        dboHS_WORKER_LICENCE.execQuery();
    }
    $("#iframeDoc").attr("src", encodeURI("AccessoryDoc.html?bizOid=" + workerLicenceOid));
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
	if (workerLicenceOid == null) {
        var drNew = dboHS_WORKER_LICENCE.dataTable.getRecord(0);
        workerLicenceOid = drNew.getValue("id");
        drNew.setItem("OID", workerLicenceOid);
        drNew.setItem("HS_WORKER", workerOid);
		dboHS_WORKER_LICENCE.execInsert();
	} else {
		dboHS_WORKER_LICENCE.execUpdate();
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
	dialogCallBack(workerLicenceOid);
    closeDialog();
};

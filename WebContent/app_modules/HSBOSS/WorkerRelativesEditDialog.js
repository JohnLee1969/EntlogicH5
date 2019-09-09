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
var dtCodeSEX = null;
var dtCodeCT = null;
var dtCodePRS_TYP = null;
var dboHS_WORKER_RELATIVES = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var selRelationship = null;
var txtName = null;
var selSex = null;
var dtBirthday = null;
var selCertType = null;
var txtCertNumber = null;
var txtPhone = null;
var txtAddress = null;
var txtNote = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var workerOid = getUrlParam("workerOid");
var workerRelativesOid = getUrlParam("workerRelativesOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");

    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'PRS_TYP' order by ORDER_CODE";
    dtCodePRS_TYP = dba.execQuery();

    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'SEX' order by ORDER_CODE";
    dtCodeSEX = dba.execQuery();
    
    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'CT' order by ORDER_CODE";
	dtCodeCT = dba.execQuery();

    dboHS_WORKER_RELATIVES = new entlogic_dbo("HSBOSS", "HS_WORKER_RELATIVES");
   
	// 初始化交互组件
	selRelationship = new entlogic_ui_select("selRelationship", formControls);
    selRelationship.setBindingData(dboHS_WORKER_RELATIVES.dataTable, "RELATIONSHIP");
    selRelationship.setOptionsData(dtCodePRS_TYP);
    
    txtName = new entlogic_ui_text("txtName", formControls);
    txtName.setBindingData(dboHS_WORKER_RELATIVES.dataTable, "NAME");
       
    selSex = new entlogic_ui_select("selSex", formControls);
    selSex.setOptionsData(dtCodeSEX);
    selSex.setBindingData(dboHS_WORKER_RELATIVES.dataTable, "SEX");
    
	dtBirthday = new entlogic_ui_datetime("dtBirthday", formControls);
    dtBirthday.setShowTime(false);
    dtBirthday.setBindingData(dboHS_WORKER_RELATIVES.dataTable, "BIRTHDAY");
    
	selCertType = new entlogic_ui_select("selCertType", formControls);
    selCertType.setOptionsData(dtCodeCT);
    selCertType.setBindingData(dboHS_WORKER_RELATIVES.dataTable, "CERT_TYPE");
    
	txtCertNumber = new entlogic_ui_text("txtCertNumber", formControls);
    txtCertNumber.setBindingData(dboHS_WORKER_RELATIVES.dataTable, "CERT_NUMBER");

    txtPhone = new entlogic_ui_text("txtPhone", formControls);
    txtPhone.setBindingData(dboHS_WORKER_RELATIVES.dataTable, "PHONE");
    
    txtAddress = new entlogic_ui_text("txtAddress", formControls);
    txtAddress.setBindingData(dboHS_WORKER_RELATIVES.dataTable, "ADDRESS");
    
    txtNote = new entlogic_ui_textarea("txtNote", formControls);
    txtNote.setBindingData(dboHS_WORKER_RELATIVES.dataTable, "NOTE");
   
    $("#btnSave").click(btnSave_click);
};

// 加载数据
function loadData() {
    if (workerRelativesOid == null) {
      	var drNew = dboHS_WORKER_RELATIVES.execCreate();
        drNew.setItem("HS_WORKER", workerOid);      
      	dboHS_WORKER_RELATIVES.dataTable.addRecord(drNew);
      	dboHS_WORKER_RELATIVES.dataTable.setSelectedIndex(0);
      	dboHS_WORKER_RELATIVES.dataTable.synchronizeLayout();
    }
    else {
        dboHS_WORKER_RELATIVES.whereClause = "where OID = '" + workerRelativesOid + "'";
        dboHS_WORKER_RELATIVES.execQuery();
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
	if (workerRelativesOid == null) {
        var dr = dboHS_WORKER_RELATIVES.dataTable.getRecord(0);
        workerRelativesOid = dr.getValue("id");
        dr.setItem("OID", workerRelativesOid);
		dboHS_WORKER_RELATIVES.execInsert();
	} else {
		dboHS_WORKER_RELATIVES.execUpdate();
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
	dialogCallBack(workerRelativesOid);
    closeDialog();
};

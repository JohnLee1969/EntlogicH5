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
var dboHS_ENTERPRISE = null;
var dboHS_WORKER = null;
var dboHS_LABOUR_CONTRACT = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lkpEnterprise = null;
var lkpWorker = null;
var dtStartDate = null;
var dtEndDate = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var enterpriseOid = getUrlParam("enterpriseOid");
var workerOid = getUrlParam("workerOid");
var labourContractOid = getUrlParam("labourContractOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    dboHS_ENTERPRISE = new entlogic_dbo("HSBOSS", "HS_ENTERPRISE");
    dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
    dboHS_LABOUR_CONTRACT = new entlogic_dbo("HSBOSS", "HS_LABOUR_CONTRACT");
   
	// 初始化交互组件
    lkpEnterprise = new entlogic_ui_lookup("lkpEnterprise", formControls);
    lkpEnterprise.setBindingData(dboHS_LABOUR_CONTRACT.dataTable, "HS_ENTERPRISE", "HS_ENTERPRISE_TEXT");
    lkpEnterprise.lookupDialogUrl = "../HSBOSS/EnterpriseLookup.html";

    lkpWorker = new entlogic_ui_lookup("lkpWorker", formControls);
    lkpWorker.setBindingData(dboHS_LABOUR_CONTRACT.dataTable, "HS_WORKER", "HS_WORKER_TEXT");
    lkpWorker.lookupDialogUrl = "../HSBOSS/WorkerLookup.html";
    
	dtStartDate = new entlogic_ui_datetime("dtStartDate", formControls);
    dtStartDate.setShowTime(false);
    dtStartDate.setBindingData(dboHS_LABOUR_CONTRACT.dataTable, "START_DATE");
    
	dtEndDate = new entlogic_ui_datetime("dtEndDate", formControls);
    dtEndDate.setShowTime(false);
    dtEndDate.setBindingData(dboHS_LABOUR_CONTRACT.dataTable, "END_DATE");
 
    txtNote = new entlogic_ui_textarea("txtNote", formControls);
    txtNote.setBindingData(dboHS_LABOUR_CONTRACT.dataTable, "NOTE");

    $("#btnSave").click(btnSave_click);
};

// 加载数据
function loadData() {
    if (labourContractOid == null) {
      	var drNew = dboHS_LABOUR_CONTRACT.execCreate();
        labourContractOid = drNew.getValue("id");
        drNew.setItem("OID", labourContractOid);
        drNew.setItem("HS_ENTERPRISE", enterpriseOid);
        drNew.setItem("HS_WORKER", workerOid);       
      	dboHS_LABOUR_CONTRACT.dataTable.addRecord(drNew);
      	dboHS_LABOUR_CONTRACT.dataTable.setSelectedIndex(0);
        if (enterpriseOid != null) {
            var drEnterprise = dboHS_ENTERPRISE.getByOid(enterpriseOid);
            if (drEnterprise != null) {
                lkpEnterprise.setValue(drEnterprise.getValue("OID"));
                lkpEnterprise.setText(drEnterprise.getValue("NAME"));
            }
        }
        if (workerOid != null) {
            var drWorker = dboHS_WORKER.getByOid(workerOid);
            if (drWorker != null) {
                lkpWorker.setValue(drWorker.getValue("OID"));
                lkpWorker.setText(drWorker.getValue("NAME"));
            }
        }
    }
    else {
        dboHS_LABOUR_CONTRACT.whereClause = "where OID = '" + labourContractOid + "'";
        dboHS_LABOUR_CONTRACT.execQuery();
    }
    $("#iframeDoc").attr("src", encodeURI("AccessoryDoc.html?bizOid=" + labourContractOid));
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
	if (labourContractOid == null) {
        var dr = dboHS_LABOUR_CONTRACT.dataTable.getRecord(0);
		dboHS_LABOUR_CONTRACT.execInsert();
	} else {
		dboHS_LABOUR_CONTRACT.execUpdate();
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
	dialogCallBack(labourContractOid);
    closeDialog();
};

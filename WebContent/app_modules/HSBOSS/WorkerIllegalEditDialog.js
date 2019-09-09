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
var dtCodeWIL_STA = null;
var dtCodeWIL_TYP = null;
var dboHS_WORKER = null;
var dboHS_WORKER_ILLEGAL = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lkpWorker = null;
var selStatus = null;
var selIllegalType = null;
var dtIllegalDate = null;
var txtIllegalBehavior = null;
var txtArbitrator = null;
var dtArbitrateDate = null;
var txtArbitrationResult = null;
var txtExecutor = null;
var dtExecuteDate = null;
var txtExecutionResult = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var workerOid = getUrlParam("workerOid");
var workerIllegalOid = getUrlParam("workerIllegalOid");


 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");

    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'WIL_STA' order by ORDER_CODE";
    dtCodeWIL_STA = dba.execQuery();

    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'WIL_TYP' order by ORDER_CODE";
    dtCodeWIL_TYP = dba.execQuery();
    
    dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
    
    dboHS_WORKER_ILLEGAL = new entlogic_dbo("HSBOSS", "HS_WORKER_ILLEGAL");
   
	// 初始化交互组件
    lkpWorker = new entlogic_ui_lookup("lkpWorker", formControls);
    lkpWorker.setBindingData(dboHS_WORKER_ILLEGAL.dataTable, "HS_WORKER", "HS_WORKER_TEXT");
    lkpWorker.lookupDialogUrl = "../HSBOSS/WorkerLookup.html";
    
	selStatus = new entlogic_ui_select("selStatus", formControls);
    selStatus.setBindingData(dboHS_WORKER_ILLEGAL.dataTable, "STATUS");
    selStatus.setOptionsData(dtCodeWIL_STA);
    
	selIllegalType = new entlogic_ui_select("selIllegalType", formControls);
    selIllegalType.setBindingData(dboHS_WORKER_ILLEGAL.dataTable, "ILLEGAL_TYPE");
    selIllegalType.setOptionsData(dtCodeWIL_TYP);
    
	dtIllegalDate = new entlogic_ui_datetime("dtIllegalDate", formControls);
    dtIllegalDate.setShowTime(false);
    dtIllegalDate.setBindingData(dboHS_WORKER_ILLEGAL.dataTable, "ILLEGAL_DATE");
    
    txtIllegalBehavior = new entlogic_ui_textarea("txtIllegalBehavior", formControls);
    txtIllegalBehavior.setBindingData(dboHS_WORKER_ILLEGAL.dataTable, "ILLEGAL_BEHAVIOR");
    
    txtArbitrator = new entlogic_ui_text("txtArbitrator", formControls);
    txtArbitrator.setBindingData(dboHS_WORKER_ILLEGAL.dataTable, "ARBITRATOR");
            
	dtArbitrateDate = new entlogic_ui_datetime("dtArbitrateDate", formControls);
    dtArbitrateDate.setShowTime(false);
    dtArbitrateDate.setBindingData(dboHS_WORKER_ILLEGAL.dataTable, "ARBITRATE_DATE");
    
    txtArbitrationResult = new entlogic_ui_textarea("txtArbitrationResult", formControls);
    txtArbitrationResult.setBindingData(dboHS_WORKER_ILLEGAL.dataTable, "ARBITRATION_RESULT");
    
    txtExecutor = new entlogic_ui_text("txtExecutor", formControls);
    txtExecutor.setBindingData(dboHS_WORKER_ILLEGAL.dataTable, "EXECUTOR");
            
	dtExecuteDate = new entlogic_ui_datetime("dtExecuteDate", formControls);
    dtExecuteDate.setShowTime(false);
    dtExecuteDate.setBindingData(dboHS_WORKER_ILLEGAL.dataTable, "EXECUTE_DATE");
    
    txtExecutionResult = new entlogic_ui_textarea("txtExecutionResult", formControls);
    txtExecutionResult.setBindingData(dboHS_WORKER_ILLEGAL.dataTable, "EXECUTION_RESULT");

   
    $("#btnSave").click(btnSave_click);
    OK = btnSave_click;
};

// 加载数据
function loadData() {
    if (workerIllegalOid == null) {
      	var drNew = dboHS_WORKER_ILLEGAL.execCreate();
        drNew.setItem("HS_WORKER", workerOid);
      	dboHS_WORKER_ILLEGAL.dataTable.addRecord(drNew);
      	dboHS_WORKER_ILLEGAL.dataTable.setSelectedIndex(0);
      	dboHS_WORKER_ILLEGAL.dataTable.synchronizeLayout();
        if (workerOid != null) {
            var drWorker = dboHS_WORKER.getByOid(workerOid);
            if (drWorker != null) {
                lkpWorker.setValue(drWorker.getValue("OID"));
                lkpWorker.setText(drWorker.getValue("NAME"));
            }
        }
    }
    else {
        dboHS_WORKER_ILLEGAL.whereClause = "where OID = '" + workerIllegalOid + "'";
        dboHS_WORKER_ILLEGAL.execQuery();
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
	if (workerIllegalOid == null) {
        var dr = dboHS_WORKER_ILLEGAL.dataTable.getRecord(0);
        workerIllegalOid = dr.getValue("id");
        dr.setItem("OID", workerIllegalOid);
		dboHS_WORKER_ILLEGAL.execInsert();
	} else {
		dboHS_WORKER_ILLEGAL.execUpdate();
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
	dialogCallBack(workerIllegalOid);
    closeDialog();
};

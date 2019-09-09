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
var dboHS_CODE = null;
var dboHS_SERVICE = null;
var dboHS_WORKER_SERVICE = null;

/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lstServiceType = null;
var lstService = null;

var lkpTakingType = null;
var numMinRate = null;
var numMinQuantiity = null;
var numMaxDistance = null;
var txeNote = null;



/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var workerOid = null;
var workerServiceOid = null;
var serviceOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_CODE = new entlogic_dbo("HSBOSS", "HS_CODE");
    dboHS_SERVICE = new entlogic_dbo("HSBOSS", "HS_SERVICE");
    dboHS_WORKER_SERVICE = new entlogic_dbo("HSBOSS", "HS_WORKER_SERVICE");
	
	// 初始化交互组件
    lstServiceType = new entlogic_mui_list("lstServiceType", formControls);
    lstServiceType.itemCssNormal = "lstServiceType-item-normal";
    lstServiceType.itemCssSelected = "lstServiceType-item-selected";
    lstServiceType.setBindingData(dboHS_CODE.dataTable);
    lstServiceType.itemClick = lstServiceType_click;

    lstService = new entlogic_mui_list("lstService", formControls);
    lstService.setMultiselected(true);
    lstService.setCssActived(true);
    lstService.itemCssNormal = "lstService-item-normal";
    lstService.itemCssSelected = "lstService-item-selected";
    lstService.itemCssActived = "lstService-item-selected";
    lstService.setBindingData(dboHS_SERVICE.dataTable);
    lstService.itemClick = lstService_click;
    
    lkpTakingType = new entlogic_mui_lookup("lkpTakingType", formControls);
    lkpTakingType.setBindingData(dboHS_WORKER_SERVICE.dataTable, "TAKING_TYPE", "TAKING_TYPE_TEXT");
	lkpTakingType.lookupUrl = encodeURI("CodeLookup.html?codeTypeOid=WKR_TOT&title=选择接单方式");
    
	numMinRate = new entlogic_mui_number("numMinRate", formControls);
    numMinRate.setBindingData(dboHS_WORKER_SERVICE.dataTable, "MIN_RATE");
    
	numMinQuantiity = new entlogic_mui_number("numMinQuantiity", formControls);
    numMinQuantiity.setBindingData(dboHS_WORKER_SERVICE.dataTable, "MIN_QUANTITY");
    
	numMaxDistance = new entlogic_mui_number("numMaxDistance", formControls);
    numMaxDistance.setBindingData(dboHS_WORKER_SERVICE.dataTable, "MAX_DISTANCE");
    
	txeNote = new entlogic_mui_textarea("txeNote", formControls);
    txeNote.setBindingData(dboHS_WORKER_SERVICE.dataTable, "NOTE");
    
    $("#btnBack").click(btnBack_click);
    $("#btnNext").click(btnNext_click);
    
    $("#tabBaseInfo").click(tabBaseInfo_click);
    $("#tabSkillInfo").click(tabSkillInfo_click);
    $("#tabMediaInfo").click(tabMediaInfo_click);
    
    $("#btnSaveWorkerService").click(btnSaveWorkerService_click);
    $("#btnDeleteWorkerService").click(btnDeleteWorkerService_click);
};

// 加载服务类别标签
function loadServiceType() {
    dboHS_CODE.whereClause = "where HS_CODE_TYPE = 'SVS_TYP'";
    dboHS_CODE.orderByClause = "order by ORDER_CODE";
    dboHS_CODE.execQuery();
};

// 加载服务产品列表
function loadService() {
    var drServiceType = dboHS_CODE.dataTable.getRecord(lstServiceType.getSelectedIndex());
    var serviceTypeCode = drServiceType.getValue("CODE");
    dboHS_SERVICE.whereClause = "where SERVICE_TYPE = '" + serviceTypeCode + "'";
	dboHS_SERVICE.execQuery();
    
    loadSelectedService(serviceTypeCode);
};

// 加载选择的服务产品列表
function loadSelectedService(serviceTypeCode) {
    var dba = new entlogic_dba("jdbc/entlogic");
    var sql = "select HS_WORKER_SERVICE.OID  as id";
    sql += ",HS_WORKER_SERVICE.HS_SERVICE";
    sql += " from HS_WORKER_SERVICE ";
    sql += " inner join HS_SERVICE on HS_SERVICE.OID = HS_WORKER_SERVICE.HS_SERVICE";
    sql += " where HS_WORKER = '" + workerOid + "'";
    sql += " and SERVICE_TYPE = '" + serviceTypeCode + "'";
    dba.SQL = sql;
	var drWorkerService = dba.execQuery();
    if(drWorkerService.getSize()>0)
    {
    	lstService.setValuesByDataTable(drWorkerService,"HS_SERVICE");
    }
};


// 加载数据
function loadData() {
    serviceOid = lstService.getValue();
    dboHS_WORKER_SERVICE.whereClause = "where HS_WORKER = '" + workerOid + "' and HS_SERVICE = '" + serviceOid + "'";
    dboHS_WORKER_SERVICE.execQuery();
    workerServiceOid = null;
    if (dboHS_WORKER_SERVICE.count() <= 0) {
      	var drNew = dboHS_WORKER_SERVICE.execCreate();
      	dboHS_WORKER_SERVICE.dataTable.addRecord(drNew);
      	dboHS_WORKER_SERVICE.dataTable.setSelectedIndex(0);
    }
    else
    {
        workerServiceOid = dboHS_WORKER_SERVICE.dataTable.getRecord(0).getValue("OID");
    }
};

// 保存数据
function saveData() {
	if (workerServiceOid === null) {
        var dba = new entlogic_dba("jdbc/entlogic");
    
    	dba.SQL = "select PRIORITY from HS_WORKER_SERVICE where HS_WORKER = '" + workerOid + "' order by PRIORITY desc";
		var drPriority = dba.execQuery();
        
        var priority =0;
        if(drPriority.getSize()>0)
        {
            priority = parseInt(drPriority.getRecord(0).getValue("PRIORITY"))+1;
        }
        var drNew = dboHS_WORKER_SERVICE.dataTable.getRecord(0);
        workerServiceOid = drNew.getValue("id");
        drNew.setItem("OID", workerServiceOid);
        drNew.setItem("HS_WORKER", workerOid);
        drNew.setItem("HS_SERVICE", lstService.getValue());
        drNew.setItem("PRIORITY", priority);
		dboHS_WORKER_SERVICE.execInsert();
	} else {
		dboHS_WORKER_SERVICE.execUpdate();
	}
    var drServiceType = dboHS_CODE.dataTable.getRecord(lstServiceType.getSelectedIndex());
    var serviceTypeCode = drServiceType.getValue("CODE");
    
    loadSelectedService(serviceTypeCode);
   
}

// 数据检查
function checkData() {
    // 检查结果
    var result = true;
     var prompt = "";
	var flag = true;
    
	if (lkpTakingType.getValue() === null || lkpTakingType.getValue() === "") {
        prompt += "<br/>请选择接单方式!";
		flag = false;
	}
	if (numMinRate.getValue() === "0") {
        prompt += "<br/>请输入最低单价!";
		flag = false;
	}
	if (numMinQuantiity.getValue() === "0") {
        prompt += "<br/>请输入最低工量!";
		flag = false;
	}
	if (numMaxDistance.getValue() === "0") {
        prompt += "<br/>请输入最远行程!";
		flag = false;
	}
    
    if (!flag) popUpMobError("错误提示", prompt);
	return flag;
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
    
    // 接收参数
    workerOid = getUrlParam("workerOid");
	
	// 用户定义初始化
	loadServiceType();
    loadService();
};

// 返回按钮点击事件
function btnBack_click() {
    jumpTo("WorkerForm.html");
};

// 保存按钮单击事件
function btnNext_click() {
     var url = encodeURI("WorkerMediaInfoForm.html?workerOid=" + workerOid);
    jumpTo(url);
};

// 基本信息标签单击事件
function tabBaseInfo_click() {
     var url = encodeURI("WorkerBaseInfoForm.html?workerOid=" + workerOid);
    jumpTo(url);
};

// 工作技能标签单击事件
function tabSkillInfo_click() {
     var url = encodeURI("WorkerSkillInfoForm.html?workerOid=" + workerOid);
    jumpTo(url);
};

// 照片视频标签单击事件
function tabMediaInfo_click() {
     var url = encodeURI("WorkerMediaInfoForm.html?workerOid=" + workerOid);
    jumpTo(url);
};

// 服务类型标签点击事件
function lstServiceType_click() {
    loadService();
};

// 服务标签点击事件
function lstService_click() {
    $("#lblServiceName").html(dboHS_SERVICE.dataTable.getRecord(lstService.getSelectedIndex()).getValue("ANOTHER_NAMER"));
    loadData();
};

//保存数据
function btnSaveWorkerService_click()
{
    saveData();
    if(checkData()) popUpMobMessage("保存数据成功！");
}

//删除数据
function btnDeleteWorkerService_click()
{
    dboHS_WORKER_SERVICE.execDelete();
    var drServiceType = dboHS_CODE.dataTable.getRecord(lstServiceType.getSelectedIndex());
    var serviceTypeCode = drServiceType.getValue("CODE");
    
    loadSelectedService(serviceTypeCode);
    loadData();
    popUpMobMessage("删除数据成功！");
}

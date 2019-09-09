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
var dtCodeCCT = null;
var dtCodeCMS = null;
var dboCM_CATALOG = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var selColumnType = null;
var txtColumnName = null;
var txtHead = null;
var txtSubhead = null;
var dtStartTime = null;
var dtEndTime = null;
var selStatus = null;
var txtNote = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var parentOid = getUrlParam("parentOid");
var catalogOid = getUrlParam("catalogOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");

    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'CCT' order by ORDER_CODE";
    dtCodeCCT = dba.execQuery();

    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'CMS' order by ORDER_CODE";
    dtCodeCMS = dba.execQuery();

    dboCM_CATALOG = new entlogic_dbo("entlogicSystem", "CM_CATALOG");
   
	// 初始化交互组件
	selColumnType = new entlogic_ui_select("selColumnType", formControls);
    selColumnType.setBindingData(dboCM_CATALOG.dataTable, "COLUMN_TYPE");
    selColumnType.setOptionsData(dtCodeCCT);
    
	txtColumnName = new entlogic_ui_text("txtColumnName", formControls);
    txtColumnName.setBindingData(dboCM_CATALOG.dataTable, "COLUMN_NAME");
    
	txtHead = new entlogic_ui_text("txtHead", formControls);
    txtHead.setBindingData(dboCM_CATALOG.dataTable, "HEAD");
    
	txtSubhead = new entlogic_ui_text("txtSubhead", formControls);
    txtSubhead.setBindingData(dboCM_CATALOG.dataTable, "SUBHEAD");
    
	dtStartTime = new entlogic_ui_datetime("dtStartTime", formControls);
    dtStartTime.setBindingData(dboCM_CATALOG.dataTable, "START_TIME");
    dtStartTime.setShowTime(true);
    
	dtEndTime = new entlogic_ui_datetime("dtEndTime", formControls);
    dtEndTime.setBindingData(dboCM_CATALOG.dataTable, "END_TIME");
    dtEndTime.setShowTime(true);

	selStatus = new entlogic_ui_select("selStatus", formControls);
    selStatus.setBindingData(dboCM_CATALOG.dataTable, "STATUS");
    selStatus.setOptionsData(dtCodeCMS);

	txtNote = new entlogic_ui_textarea("txtNote", formControls);
    txtNote.setBindingData(dboCM_CATALOG.dataTable, "NOTE");
   
    $("#btnSave").click(btnSave_click);
};

// 加载数据
function loadData() {
    if (catalogOid == null) {
      	var drNew = dboCM_CATALOG.execCreate();
        drNew.setItem("PARENT_OID", parentOid);       
      	dboCM_CATALOG.dataTable.addRecord(drNew);
      	dboCM_CATALOG.dataTable.setSelectedIndex(0);
    }
    else {
        dboCM_CATALOG.whereClause = "where OID = '" + catalogOid + "'";
        dboCM_CATALOG.execQuery();
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
	if (catalogOid == null) {
        var parentDr = dboCM_CATALOG.getByOid(parentOid);
        var parentOrderCode = parentDr.getValue("ORDER_CODE");
        
        var dr = dboCM_CATALOG.dataTable.getRecord(0);
        catalogOid = dr.getValue("id");
        dr.setItem("OID", catalogOid);
        dr.setItem("PARENT_OID", parentOid);
        dr.setItem("ORDER_CODE", parentOrderCode + "999");
		dboCM_CATALOG.execInsert();
	} else {
		dboCM_CATALOG.execUpdate();
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
	dialogCallBack(catalogOid);
    closeDialog();
};

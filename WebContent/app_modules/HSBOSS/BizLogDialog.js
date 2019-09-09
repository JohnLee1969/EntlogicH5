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
var dtCodeBLG_TYP = null;
var dboFW_GROUP = null;
var dboFW_USER = null;
var dboHS_BIZ_LOG = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var selLogType = null;
var txtUserGroupName = null;
var txtUserName = null;
var txtLogMessage = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var logType = getUrlParam("logType");
var bizOid = getUrlParam("bizOid");
var bizLogOid = getUrlParam("bizLogOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");
    
    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'BLG_TYP' order by ORDER_CODE";
    dtCodeBLG_TYP = dba.execQuery();
        
    dboFW_GROUP = new entlogic_dbo("entlogicSystem", "FW_GROUP");
    dboFW_USER = new entlogic_dbo("entlogicSystem", "FW_USER");
    dboHS_BIZ_LOG = new entlogic_dbo("HSBOSS", "HS_BIZ_LOG");
   
	// 初始化交互组件
    selLogType = new entlogic_ui_select("selLogType", formControls);
    selLogType.setBindingData(dboHS_BIZ_LOG.dataTable, "LOG_TYPE");
    selLogType.setOptionsData(dtCodeBLG_TYP);
    selLogType.setEnabled(false);
   
    txtUserGroupName = new entlogic_ui_text("txtUserGroupName", formControls);
    txtUserGroupName.setBindingData(dboHS_BIZ_LOG.dataTable, "USER_GROUP_NAME");
    txtUserGroupName.setEnabled(false);
   
    txtUserName = new entlogic_ui_text("txtUserName", formControls);
    txtUserName.setBindingData(dboHS_BIZ_LOG.dataTable, "USER_NAME");
    txtUserGroupName.setEnabled(false);
   
    txtLogMessage = new entlogic_ui_textarea("txtLogMessage", formControls);
    txtLogMessage.setBindingData(dboHS_BIZ_LOG.dataTable, "LOG_MESSAGE");
   
    $("#btnSave").click(btnSave_click);
};

// 加载数据
function loadData() {    
    if (bizLogOid == null) {
     	var groupOid = getCurrentUserOrganization();
        var group = dboFW_GROUP.getByOid(groupOid);
        
    	var userOid = getCurrentUser();
        var user = dboFW_USER.getByOid(userOid);
        
     	var drNew = dboHS_BIZ_LOG.execCreate();
      	drNew.setItem("LOG_TYPE", logType);
        drNew.setItem("BIZ_OID", bizOid);
      	drNew.setItem("USER_GROUP_NAME", group.getValue("GROUP_NAME"));
       	drNew.setItem("USER_NAME", user.getValue("REAL_NAME"));
      
      	dboHS_BIZ_LOG.dataTable.addRecord(drNew);
      	dboHS_BIZ_LOG.dataTable.setSelectedIndex(0);
    }
    else {
        dboHS_BIZ_LOG.whereClause = "where OID = '" + bizLogOid + "'";
        dboHS_BIZ_LOG.execQuery();
    }
};

// 数据检查
function checkData() {
    // 检查结果
    var result = true;
    var prompt = "错误提示：";
    
    // 备注内容不能为空
    txtLogMessage.setErrMessage("");
    if (txtLogMessage.getValue() == "") {
        txtLogMessage.setErrMessage("备注内容不能为空！！");
        prompt += "\n备注内容不能为空！！";
        result = result & false;
    }
    
    // 弹出提示框
    if (!result) {
        application.popUpError("错误提示", prompt);
    }
    
    return result;
};

// 保存数据
function saveData() {
	if (bizLogOid == null) {
        var drNew = dboHS_BIZ_LOG.dataTable.getRecord(0);
        bizLogOid = drNew.getValue("id");
        drNew.setItem("OID", bizLogOid);
		dboHS_BIZ_LOG.execInsert();
	} else {
		dboHS_BIZ_LOG.execUpdate();
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
	dialogCallBack(bizLogOid);
    closeDialog();
};

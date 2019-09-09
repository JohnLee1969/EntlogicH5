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
var dboFW_GROUP = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtGroupName = null;
var txtShortName = null;
var txtDescription = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var parentOid = null;
var groupOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboFW_GROUP = new entlogic_dbo("entlogicSystem", "FW_GROUP");
	
	// 初始化交互组件
    txtGroupName = new entlogic_ui_text("txtGroupName", formControls);
    txtGroupName.setBindingData(dboFW_GROUP.dataTable, "GROUP_NAME");
    
    txtShortName = new entlogic_ui_text("txtShortName", formControls);
    txtShortName.setBindingData(dboFW_GROUP.dataTable, "SHORT_NAME");
    
    txtDescription = new entlogic_ui_textarea("txtDescription", formControls);
    txtDescription.setBindingData(dboFW_GROUP.dataTable, "DESCRIPTION");
    
    $("#btnSave").click(btnSave_click);
};

// 加载后台数据
function loadData() {
    if (groupOid == null) {
      	var drNewGroup = dboFW_GROUP.execCreate();
      	dboFW_GROUP.dataTable.addRecord(drNewGroup);
      	dboFW_GROUP.dataTable.setSelectedIndex(0);
    }
    else {
        dboFW_GROUP.whereClause = "where OID = '" + groupOid + "'";
        dboFW_GROUP.execQuery();
    }
};

// 数据合法行检查
function checkData() {
    // 检查结果
    var result = true;
    var prompt = "错误提示：";

    // 检查用户组名称合法性
    txtGroupName.setErrMessage("");
    if (txtGroupName.getValue() == "") {
        txtGroupName.setErrMessage("用户组全称不能为空！！");
        prompt += "\n用户组全称不能为空！！！！";
        result = result & false;
    }
    // 检查用户组简称合法性
    txtShortName.setErrMessage("");
    if (txtShortName.getValue() == "") {
        txtShortName.setErrMessage("用户组简称不能为空！！");
        prompt += "\n用户组简称不能为空！！";
        result = result & false;
    }
    
    // 弹出提示框
    if (!result) {
        alert(prompt);
    }
    
    return result;
};

// 保存数据
function saveData() {
    var currentGroup = dboFW_GROUP.dataTable.getRecord(0);
    if (currentGroup.getValue("OID") == "") {
        var parentGroup = dboFW_GROUP.getByOid(parentOid);
        var orderCode = parentGroup.getValue("ORDER_CODE");
        var orderCode = orderCode + "999";
        groupOid = currentGroup.getValue("id");
        currentGroup.setItem("OID", groupOid);
        currentGroup.setItem("PARENT_OID", parentOid);
        currentGroup.setItem("ORDER_CODE", orderCode);      
        currentGroup.setItem("GROUP_TYPE", "");
        dboFW_GROUP.execInsert();
    } else {
        dboFW_GROUP.execUpdate();
    }   
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
    initKeys();
	initComponents();
	
	// 接受传递参数
    parentOid = getUrlParam("parentOid");
    groupOid = getUrlParam("groupOid");
    
  	// 加载数据  
    loadData();
};

// 保存按钮单击事件响应
function btnSave_click() {
    if (!checkData()) return;    
	saveData();
    dialogCallBack(groupOid);
    closeDialog();
};

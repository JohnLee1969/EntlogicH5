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
var dboFW_MENU = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtGroupCode = null;
var txtGroupName = null;
var txtShortName = null;
var txtDescription = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var groupType = getUrlParam("groupType");
var groupOid = getUrlParam("groupOid");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboFW_GROUP = new entlogic_dbo("entlogicSystem", "FW_GROUP");
    dboFW_MENU = new entlogic_dbo("entlogicSystem", "FW_MENU");
	
	// 初始化交互组件
    txtGroupCode = new entlogic_ui_text("txtGroupCode", formControls);
    txtGroupCode.setBindingData(dboFW_GROUP.dataTable, "GROUP_CODE");
    
    txtGroupName = new entlogic_ui_text("txtGroupName", formControls);
    txtGroupName.setBindingData(dboFW_GROUP.dataTable, "GROUP_NAME");
    
    txtShortName = new entlogic_ui_text("txtShortName", formControls);
    txtShortName.setBindingData(dboFW_GROUP.dataTable, "SHORT_NAME");
    
    txtDescription = new entlogic_ui_textarea("txtDescription", formControls);
    txtDescription.setBindingData(dboFW_GROUP.dataTable, "DESCRIPTION");
    
    lstGroupApp = new entlogic_ui_list("lstGroupApp", formControls);
    lstGroupApp.setBindingData(dboFW_MENU.dataTable);
	lstGroupApp.setMultiselected(true);
    
    $("#btnSuperUser").click(btnSuperUser_click);
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
        txtGroupCode.setEnabled(false);
    }
    
    loadApp();
};

// 加载应用授权
function loadApp() {
    dboFW_MENU.whereClause = "where PARENT_OID = '-'";
    dboFW_MENU.orderByClause = "order by ORDER_CODE";
    dboFW_MENU.execQuery();
    
    var dboFW_GROUP_APP = new entlogic_dbo("entlogicSystem", "FW_GROUP_APP");
    dboFW_GROUP_APP.whereClause = "where GROUP_OID = '" + groupOid + "'";
    dboFW_GROUP_APP.execQuery();
    
    var dt = dboFW_GROUP_APP.dataTable;
    var values = dt.columnToStringArray("APPLICATION");
    lstGroupApp.setValues(values);
};

// 数据合法行检查
function checkData() {
    // 检查结果
    var result = true;
    var prompt = "错误提示：";
    
    // 检查用户组编码冲突
    txtGroupCode.setErrMessage("");
    var currentGroup = dboFW_GROUP.dataTable.getRecord(0);
    if (currentGroup.getValue("OID") == "" && dboFW_GROUP.getByOid(txtGroupCode.getValue()) != null) {
        txtGroupCode.setErrMessage("用户编码已存在！！");
        prompt += "\n用户编码已存在！！";
        result = result & false;
    }
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
    if (groupOid == null) {
        // 添加用户组织
        groupOid = txtGroupCode.getValue();
        var orderCode = groupOid + "_000";
        currentGroup.setItem("GROUP_TYPE", groupType);
        currentGroup.setItem("PARENT_OID", "-");
        currentGroup.setItem("ORDER_CODE", orderCode);      
        currentGroup.setItem("OID", groupOid);
        dboFW_GROUP.execInsert();
        txtGroupCode.setEnabled(false);
    } else {
        dboFW_GROUP.execUpdate();
    }   
    
    // 更新应用授权
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "delete FW_GROUP_APP where GROUP_OID = '" + groupOid + "'";
    dba.execUpdate();      
    var values = lstGroupApp.getValues();
    var dboFW_GROUP_APP = new entlogic_dbo("entlogicSystem", "FW_GROUP_APP");
    for(var i = 0; i < values.length; i++) {
        var drGA = dboFW_GROUP_APP.execCreate();
        drGA.setItem("OID", drGA.getValue("id"));
        drGA.setItem("GROUP_OID", groupOid);
        drGA.setItem("APPLICATION", values[i]);
        dboFW_GROUP_APP.execInsert(drGA)
    }
    
    // 创建组织系统管理员角色
    dba.SQL = "select OID from FW_ROLE where OID = '" + groupOid + "'";
    var dtRole = dba.execQuery();
    if (dtRole.getSize() == 0) {
        var dboFW_ROLE = new entlogic_dbo("entlogicSystem", "FW_ROLE");
        var drRole = dboFW_ROLE.execCreate();
        drRole.setItem("OID", groupOid);
        drRole.setItem("GROUP_OID", groupOid);
        drRole.setItem("ROLE_NAME", "系统管理员");
        dboFW_ROLE.execInsert(drRole);
     }
    dba.SQL = "delete FW_ROLE_AUTHORIZATION where ROLE_OID = '" + groupOid + "'";
    dba.execUpdate();
    values = lstGroupApp.getValues();
    var dboFW_ROLE_AUTHORIZATION = new entlogic_dbo("entlogicSystem", "FW_ROLE_AUTHORIZATION");
    for(var i = 0; i < values.length; i++) {
        var rootMenu = dboFW_MENU.getByOid(values[i]);
        var orderCode = rootMenu.getValue("ORDER_CODE");
        dba.SQL = "select OID from FW_MENU where ORDER_CODE like '" + orderCode + "%' order by ORDER_CODE";
        var dtMenu = dba.execQuery();
        for (var j = 0; j < dtMenu.getSize(); j++) {
            var drMenu = dtMenu.getRecord(j);
            var drRA = dboFW_ROLE_AUTHORIZATION.execCreate();
            drRA.setItem("OID", drRA.getValue("id"));
            drRA.setItem("ROLE_OID", groupOid);
            drRA.setItem("MENU_OID", drMenu.getValue("OID"));
            dboFW_ROLE_AUTHORIZATION.execInsert(drRA)
        }
    }
   
    // 创建超级用户
    dba.SQL = "select OID from FW_USER where OID = '" + groupOid + "'";
    var dtUser = dba.execQuery();    
    if (dtUser.getSize() == 0) {
        var dboFW_USER = new entlogic_dbo("entlogicSystem", "FW_USER");
        var drUser = dboFW_USER.execCreate();
        drUser.setItem("OID", groupOid);
        drUser.setItem("GROUP_OID", groupOid);
        drUser.setItem("USER_NAME", groupOid);
        drUser.setItem("PASSWORD", "123456");
        dboFW_USER.execInsert(drUser);
    }
    
    // 创建超级用户授权
    dba.SQL = "select OID from FW_USER_AUTHORIZATION where USER_OID = '" + groupOid + "'";
    var dtUA = dba.execQuery();    
    if (dtUA.getSize() == 0) {        
        var dboFW_USER_AUTHORIZATION = new entlogic_dbo("entlogicSystem", "FW_USER_AUTHORIZATION");
        var drUA = dboFW_USER_AUTHORIZATION.execCreate();
        drUA.setItem("OID", drUA.getValue("id"));
        drUA.setItem("USER_OID", groupOid);
        drUA.setItem("ROLE_OID", groupOid);
        dboFW_USER_AUTHORIZATION.execInsert(drUA);
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
    initKeys();
	initComponents();
    
  	// 加载数据  
    loadData();
};

// 创建超级用户
function btnSuperUser_click() {
    if (!checkData()) return;    
	saveData();
    
    var url = encodeURI("UserEditDialog.html?userOid=" + groupOid);
    popUpDialog(url, 200, 150, "编辑组织超级用户", UserEditDialog_close);   
};

// 保存按钮单击事件响应
function btnSave_click() {
    if (!checkData()) return;    
	saveData();
    dialogCallBack(groupOid);
    closeDialog();
};

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
var dboFW_ROLE = null;
var dboFW_ROLE_AUTHORIZATION = null;
var dtRoleAuth = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var dgrRole = null;
var txtSn = null;
var txtRoleName = null;
var txtDescription = null;
var tvwRoleAuth = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var userOid = null;
var orgOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	dboFW_ROLE = new entlogic_dbo("entlogicSystem", "FW_ROLE");
    dtRoleAuth = new entlogic_data_table();
	
	// 初始化交互组件
	dgrRole = new entlogic_ui_datagrid("dgrRole", formControls);
	dgrRole.setBindingData(dboFW_ROLE.dataTable);
    dgrRole.rowClick = dgrRole_rowClick;
   
	txtSn = new entlogic_ui_text("txtSn", formControls);
	txtSn.setBindingData(dboFW_ROLE.dataTable, "SN");
   
	txtRoleName = new entlogic_ui_text("txtRoleName", formControls);
	txtRoleName.setBindingData(dboFW_ROLE.dataTable, "ROLE_NAME");
   
	txtDescription = new entlogic_ui_text("txtDescription", formControls);
	txtDescription.setBindingData(dboFW_ROLE.dataTable, "DESCRIPTION");
    
    tvwRoleAuth = new entlogic_ui_treeview("tvwRoleAuth", formControls);
    tvwRoleAuth.isMultiselected = true;
    tvwRoleAuth.setBindingData(dtRoleAuth);
   
	$("#btnAdd").click(btnAdd_click);
	$("#btnDelete").click(btnDelete_click);
	$("#btnSave").click(btnSave_click);
    
    // 去掉文字选择
    document.onselectstart = function(){return false;};
};

// 加载角色列表
function loadRole() {
    dboFW_ROLE.whereClause = "where GROUP_OID = '" + orgOid + "'";
    dboFW_ROLE.orderByClause = "order by SN";
    dboFW_ROLE.execQuery();
};

// 加载用户授权
function loadRoleAuth() {
    var dboFW_MENU = new entlogic_dbo("entlogicSystem", "FW_MENU");
  	dboFW_MENU.orderByClause = "order by ORDER_CODE";
	dboFW_MENU.execQuery();
    
    var dboFW_USER_AUTHORIZATION = new entlogic_dbo("entlogicSystem", "FW_USER_AUTHORIZATION");
    dboFW_USER_AUTHORIZATION.whereClause = "where USER_OID = '" + userOid + "'";
    dboFW_USER_AUTHORIZATION.execQuery();
    
    var whereClause = "where (1 <> 1 ";
    for (var i = 0; i < dboFW_USER_AUTHORIZATION.dataTable.getSize(); i++) {
        var drRole = dboFW_USER_AUTHORIZATION.dataTable.getRecord(i);
        whereClause += "or ROLE_OID = '" + drRole.getValue("ROLE_OID") + "' ";        
    }
    whereClause += ") ";
    
    dtRoleAuth.clear();
    var dboFW_ROLE_AUTHORIZATION = new entlogic_dbo("entlogicSystem", "FW_ROLE_AUTHORIZATION");
    for (var i = 0; i < dboFW_MENU.dataTable.getSize(); i++) {
        var drMenu = dboFW_MENU.dataTable.getRecord(i);
        dboFW_ROLE_AUTHORIZATION.whereClause = whereClause + "and MENU_OID = '" + drMenu.getValue("OID") + "'";
        if (dboFW_ROLE_AUTHORIZATION.count() > 0) dtRoleAuth.addRecord(drMenu);
    }
	dtRoleAuth.synchronizeLayout();
    
    var roleOid = dgrRole.getValue();
    dboFW_ROLE_AUTHORIZATION.whereClause = "where ROLE_OID = '" + roleOid + "'";
    dboFW_ROLE_AUTHORIZATION.execQuery();
    var dtRA = dboFW_ROLE_AUTHORIZATION.dataTable;
    for (var i = 0; i < dtRA.getSize(); i ++) {
        var drRA = dtRA.getRecord(i);
        var menuOid = drRA.getValue("MENU_OID");
        var node = tvwRoleAuth.getNode(menuOid);
        if (node != null) node.setMultiselected(true);
    };
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
    userOid = getUserSessionItem("userOid");
    orgOid = getUserSessionItem("orgOid");
    
	loadRole();
   	if (dgrRole.getSize() > 0) {      
      dgrRole.setSelectedIndex(0);      
   	}
    
   	loadRoleAuth();
};

// 角色列表行单击事件响应
function dgrRole_rowClick() {
    loadRoleAuth();
};

// 添加同级菜单项
function btnAdd_click() {
   var drNewData = dboFW_ROLE.execCreate();
   var newSn = dboFW_ROLE.count();
   var oid = drNewData.getValue("id");
   drNewData.setItem("OID", oid);
   drNewData.setItem("GROUP_OID", orgOid);
   drNewData.setItem("SN", newSn);
   drNewData.setItem("ROLE_NAME", "新角色");
   drNewData.setItem("DESCRIPTION", "");
   
   dboFW_ROLE.execInsert(drNewData);
   loadRole();
   dgrRole.setValue(oid);
};

// 删除菜单项
function btnDelete_click() {
    // 判断是否为系统管理员角色
    var roleOid = dgrRole.getValue();
    if (roleOid == orgOid) {
        dboFW_ROLE.dataTable.synchronizeLayout();
        alert("系统管理员用户不可更改！！");
        return;
    }

    // 获取删除后的焦点
	var index = dgrRole.getSelectedIndex();
	var drCurrentData = dboFW_ROLE.dataTable.getRecord(index);
	if (index >= dgrRole.getSize() - 1) {
		index --;
	}
   
	// 获取当前角色数据
	var oid = drCurrentData.getValue("OID");
   
	// 删除数据
	var dba = new entlogic_dba("jdbc/entlogic");
	var transactionId = dba.transactionBegin();   
    
	// 删除角色授权
    dba.SQL = "delete FW_ROLE_AUTHORIZATION where ROLE_OID = '" + oid + "'";
	if (!dba.execUpdate(transactionId)) {
		dba.transactionRollback(transactionId); 
		return;
	} 
    
	// 删除用户授权
    dba.SQL = "delete FW_USER_AUTHORIZATION where ROLE_OID = '" + oid + "'";
	if (!dba.execUpdate(transactionId)) {
		dba.transactionRollback(transactionId); 
		return;
	} 
    
	// 删除主记录
	dba.SQL = "delete FW_ROLE where OID = '" + oid + "'";
	if (!dba.execUpdate(transactionId)) {
		dba.transactionRollback(transactionId); 
		return;
	} 
	dba.transactionCommit(transactionId);
   
	// 重新加载菜单列表
	loadRole();
   
	// 置焦点
	dgrRole.setSelectedIndex(index);
};

// 保存菜单项
function btnSave_click() {
    // 判断是否为系统管理员角色
    var roleOid = dgrRole.getValue();
    if (roleOid == orgOid) {
        dboFW_ROLE.dataTable.synchronizeLayout();
        alert("系统管理员用户不可更改！！");
        return;
    }
    
	// 数据检查
    if (!checkData()) return;
    
    // 保存角色属性
  	dboFW_ROLE.execUpdate();
    
    // 更新角色授权
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "delete FW_ROLE_AUTHORIZATION where ROLE_OID = '" + roleOid + "'";
    dba.execUpdate();
      
    var dboFW_ROLE_AUTHORIZATION = new entlogic_dbo("entlogicSystem", "FW_ROLE_AUTHORIZATION");
    var menus = tvwRoleAuth.getValues();
    for(var i = 0; i < menus.length; i++) {
        var newDr = dboFW_ROLE_AUTHORIZATION.execCreate();
        newDr.setItem("OID", newDr.getValue("id"));
        newDr.setItem("ROLE_OID", dgrRole.getValue());
        newDr.setItem("MENU_OID", menus[i]);
        dboFW_ROLE_AUTHORIZATION.execInsert(newDr)
    }
    
    // 刷新角色列表
	var id = dgrRole.getValue();
  	dgrRole.draw();
	dgrRole.setValue(id);
};

// 数据合法行检查
function checkData() {
    // 检查结果
    var result = true;
    var prompt = "错误提示：";

    // 检查角色名称合法性
    txtRoleName.setErrMessage("");
    if (txtRoleName.getValue() == "") {
        txtRoleName.setErrMessage("角色不能为空！");
        prompt += "\n角色不能为空！";
        result = result & false;
    }
  
    // 弹出提示框
    if (!result) {
        alert(prompt);
    }
    
    return result;
};

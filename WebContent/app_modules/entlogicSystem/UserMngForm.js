/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 全局应用
var aplication = parent.aplication;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

// 页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    
var dboFW_GROUP = null;
var dboFW_USER = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var tvwGroup = null;
var dgrUser = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var orgOid = null;
var userOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboFW_GROUP = new entlogic_dbo("entlogicSystem", "FW_GROUP");
    dboFW_USER = new entlogic_dbo("entlogicSystem", "FW_USER");
   
	// 初始化交互组件
	tvwGroup = new entlogic_ui_treeview("tvwGroup", formControls);
    tvwGroup.setBindingData(dboFW_GROUP.dataTable);
    tvwGroup.nodeClick = loadUsers;
	tvwGroup.nodeDbclick = btnEditGroup_click;
   
	dgrUser = new entlogic_ui_datagrid("dgrUser", formControls);
	dgrUser.setBindingData(dboFW_USER.dataTable);
    dgrUser.rowDbclick = btnEditUser_click;
   
    $("#btnAddGroup").click(btnAddGroup_click);
    $("#btnEditGroup").click(btnEditGroup_click);
    $("#btnDeleteGroup").click(btnDeleteGroup_click);
    $("#btnAddUser").click(btnAddUser_click);
    $("#btnEditUser").click(btnEditUser_click);
    $("#btnDeleteUser").click(btnDeleteUser_click);
    
    // 去掉文字选择
    document.onselectstart = function(){return false;};
};

// 加载用户组织机构数据
function loadGroups() {
    var drRootGroup = dboFW_GROUP.getByOid(orgOid);
    var orderCode = drRootGroup.getValue("ORDER_CODE");
    dboFW_GROUP.whereClause = "where ORDER_CODE like '" + orderCode + "%'";
	dboFW_GROUP.orderByClause = "order by ORDER_CODE";
	dboFW_GROUP.execQuery();
	tvwGroup.setValue("0");
	tvwGroup.currentNode.expand();
 };

// 重新排序
function reorderGroups() {
    var orderCodes = tvwGroup.rootNode.getOrderCodeArray("");
    for (var i = 0; i < dboFW_GROUP.dataTable.getSize(); i++) {
        var dr = dboFW_GROUP.dataTable.getRecord(i);
        dr.setItem("ORDER_CODE", orderCodes[i + 1]);
        dboFW_GROUP.execUpdate(dr);
        dba.execUpdate();
    }
};

// 加载系统用户数据
function loadUsers() {
	dboFW_USER.orderByClause = "order by USER_CODE";
	dboFW_USER.whereClause = "where GROUP_OID = '" + tvwGroup.getValue() + "'";
	dboFW_USER.execQuery();
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
    orgOid = getUserSessionItem("orgOid");
    userOid = getUserSessionItem("userOid");
	loadGroups();
	loadUsers();
};

// 组织机构树节点单击事件响应
function tvwGroup_nodeClick() {
    loadUsers();
};

// 添加用户组按钮点击事件相应
function btnAddGroup_click() {
	var parentOid = tvwGroup.currentNode.id;
	var url = encodeURI("UserDepartmentEditDialog.html?parentOid=" + parentOid);
	popUpDialog(url, 200, 150, "添加部门", UserDepartmentEditDialog_close);
};

// 编辑用户组按钮点击事件相应
function btnEditGroup_click() {
	var groupOid = tvwGroup.currentNode.id;
	var url = encodeURI("UserDepartmentEditDialog.html?groupOid=" + groupOid);
	popUpDialog(url, 200, 150, "编辑部门", UserDepartmentEditDialog_close);
};

// 删除用户按钮点击事件相应
function btnDeleteGroup_click() {
    // 删除确认
    if (!confirm("确实要删除当前用户部门吗？")) return;
    
    // 获取下一个节点
    var nextNode = tvwGroup.getNextNode();
    if (nextNode == null) tvwGroup.getPreviousNode();
    if (nextNode == null) tvwGroup.currentNode.parentNode;


    // 创建数据库连接
    var dba = new entlogic_dba("jdbc/entlogic");
 	var groupOid = dgrGroup.getValue();
    
    // 判断是否存在下属部门
    dba.SQL = "select OID from FW_GROUP where PARENT_OID = '" + groupOid + "'";
    if (dba.execQuery().getSize() > 0) {
        alert("该用户组织存在下级机构，请先删除其下属机构和相关用户后才能删除该组织！！");
        return;
    }
    
    // 判断是否存在下属用户
    dba.SQL = "select OID from FW_USER where GROUP_OID = '" + groupOid + "'";
    if (dba.execQuery().getSize() > 0) {
        alert("该用户组织存在下属用户，请先删除其下属用户后才能删除该组织！！");
        return;
    }
   
    // 删除组织
    dba.SQL = "delete from FW_GROUP where OID = '" + groupOid + "'";
    dba.execUpdate();
    
    // 刷新用户组列表
    loadGroups();
    reorderGroups();
    loadGroups();
    loadUsers();
};

// 用户组编辑对话框关闭事件
function UserDepartmentEditDialog_close(oid) {
    if (oid != tvwGroup.getValue()) {
    	loadGroups();
    	reorderGroups();
    }       
    loadGroups();
    tvwGroup.setValue(oid);
    loadUsers();
};

// 添加用户组按钮点击事件相应
function btnAddUser_click() {
	var groupOid = tvwGroup.currentNode.id;
	var url = encodeURI("UserEditDialog.html?groupOid=" + groupOid);
	popUpDialog(url, 200, 150, "添加用户", UserEditDialog_close);
};

// 编辑用户组按钮点击事件相应
function btnEditUser_click() {
	var userOid = dgrUser.getValue();
	var url = encodeURI("UserEditDialog.html?userOid=" + userOid);
	popUpDialog(url, 200, 150, "编辑用户", UserEditDialog_close);
};

// 删除用户组按钮点击事件相应
function btnDeleteUser_click() {
    // 删除确认
    if (!confirm("确实要删除当前用户吗？")) return;
    
    // 事务创建
    var dba = new entlogic_dba("jdbc/entlogic");
    var transactionId = dba.transactionBegin();
        
    // 删除用户授权
    var userOid = dgrUser.getValue();
    dba.SQL = "delete from FW_USER_AUTHORIZATION where USER_OID = '" + userOid + "'";
    if (!dba.execUpdate(transactionId)) {
        dba.transactionRollback(transactionId);
        return;
    }
    
    // 删除下属用户
    dba.SQL = "delete from FW_USER where OID = '" + userOid + "'";
    if (!dba.execUpdate(transactionId)) {
        dba.transactionRollback(transactionId);
        return;
    }	
    
    // 事务提交
    dba.transactionCommit(transactionId);
    
    // 刷新用户列表
    loadUsers();
};

// 用户组编辑对话框关闭事件
function UserEditDialog_close(oid) {
    loadUsers();
    dgrUser.setValue(oid);
};

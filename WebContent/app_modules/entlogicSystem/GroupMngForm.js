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
var dboFW_CODE = null;
var dboFW_GROUP = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var tvwGroupType = null;
var dgrGroup = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明




/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboFW_CODE = new entlogic_dbo("entlogicSystem", "FW_CODE");
    dboFW_GROUP = new entlogic_dbo("entlogicSystem", "FW_GROUP");
   
	// 初始化交互组件
	tvwGroupType = new entlogic_ui_treeview("tvwGroupType", formControls);
    tvwGroupType.setBindingData(dboFW_CODE.dataTable);
    tvwGroupType.nodeClick = loadGroups;
	tvwGroupType.nodeDbclick = btnEdit_click;
   
	dgrGroup = new entlogic_ui_datagrid("dgrGroup", formControls);
	dgrGroup.setBindingData(dboFW_GROUP.dataTable);
    dgrGroup.rowDbclick = btnEdit_click;
   
    $("#btnAdd").click(btnAdd_click);
    $("#btnEdit").click(btnEdit_click);
    $("#btnDelete").click(btnDelete_click);
    
    // 去掉文字选择
    document.onselectstart = function(){return false;};
};

// 加载用户组织机构数据
function loadGroupType() {
    dboFW_CODE.whereClause = "where CODE_TYPE_OID='UGT'";
	dboFW_CODE.orderByClause = "order by ORDER_CODE";
	dboFW_CODE.execQuery();
	tvwGroupType.setValue("000");
	tvwGroupType.currentNode.expand();
 };

// 加载系统用户数据
function loadGroups() {
    var groupType = tvwGroupType.currentNode.data.getValue("CODE");
	dboFW_GROUP.whereClause = "where PARENT_OID='-' and GROUP_TYPE='" + groupType + "'";
	dboFW_GROUP.orderByClause = "order by ORDER_CODE";
	dboFW_GROUP.execQuery();
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadGroupType();
	loadGroups();
};

// 组织机构树节点单击事件响应
function tvwGroupType_nodeClick() {
    loadGroups();
};

// 添加用户组按钮点击事件相应
function btnAdd_click() {
	var groupType = tvwGroupType.currentNode.data.getValue("CODE");
    var url = encodeURI("GroupEditDialog.html?groupType=" + groupType);
	popUpDialog(url, 200, 150, "添加用户单位", GroupEditDialog_close);
};

// 编辑用户组按钮点击事件相应
function btnEdit_click() {
	var groupOid = dgrGroup.getValue();
    var url = encodeURI("GroupEditDialog.html?groupOid=" + groupOid);
	popUpDialog(url, 200, 150, "编辑用户单位", GroupEditDialog_close);
};

// 删除用户按钮点击事件相应
function btnDelete_click() {
    // 删除确认
    if (!confirm("确实要删除当前用户单位吗？")) return;

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
};

// 用户组编辑对话框关闭事件
function GroupEditDialog_close(oid) {
    loadGroups();
    dgrGroup.setValue(oid);
};

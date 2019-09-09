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

var dboFW_MENU = null;



/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   

var tvwMenu = null;
var selMenuType = null;
var txtMenuName = null;
var txtMenuIcon = null;
var txtApplication = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明




/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
  	dboFW_MENU = new entlogic_dbo("entlogicSystem", "FW_MENU");
	
	// 初始化交互组件
  	tvwMenu = new entlogic_ui_treeview("tvwMenu", formControls);
  	tvwMenu.setBindingData(dboFW_MENU.dataTable);
   
   selMenuType = new entlogic_ui_select("selMenuType", formControls);
   selMenuType.setBindingData(dboFW_MENU.dataTable, "MENU_TYPE");
   
   txtMenuName = new entlogic_ui_text("txtMenuName", formControls);
   txtMenuName.setBindingData(dboFW_MENU.dataTable, "MENU_NAME");
   
   txtMenuIcon = new entlogic_ui_text("txtMenuIcon", formControls);
   txtMenuIcon.setBindingData(dboFW_MENU.dataTable, "MENU_ICON");
   
   txtApplication = new entlogic_ui_text("txtApplication", formControls);
   txtApplication.setBindingData(dboFW_MENU.dataTable, "APPLICATION");
  
	$("#btnExit").click(btnExit_click);
	$("#btnAdd").click(btnAdd_click);
	$("#btnAddSub").click(btnAddSub_click);
	$("#btnDelete").click(btnDelete_click);
	$("#btnMoveUp").click(btnMoveUp_click);
	$("#btnMoveDown").click(btnMoveDown_click);
	$("#btnSave").click(btnSave_click);
    
    // 去掉文字选择
    document.onselectstart = function(){return false;};
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadMenu();
};

// 加载菜单列表
function loadMenu() {
   dboFW_MENU.whereClause = "where 1 = 1";
  	dboFW_MENU.orderByClause = "order by ORDER_CODE";
  	dboFW_MENU.execQuery();
};

// 退出按钮单击事件响应
function btnExit_click() {
	window.location.href = applicationRoot + "/app_modules/entlogicSystem/Desktop.html";
	return;
};

// 添加同级菜单项
function btnAdd_click() {
   var drCurrentData = tvwMenu.currentNode.data;
   var parentOid = drCurrentData.getValue("PARENT_OID");
   var orderCode = drCurrentData.getValue("ORDER_CODE");
   var menuType = drCurrentData.getValue("MENU_TYPE");
   dboFW_MENU.whereClause = "where PARENT_OID = '" + parentOid + "'";
   var offset = dboFW_MENU.count("OID");
   var newOrderCode = offset + "";
   if (offset < 100) newOrderCode = "0" + newOrderCode;
   if (offset < 10) newOrderCode = "0" + newOrderCode;
   newOrderCode = orderCode.substring(0, orderCode.length - 3) + newOrderCode;
   
   var drNewData = dboFW_MENU.execCreate();
   var oid = drNewData.getValue("id");
   drNewData.setItem("OID", oid);
   drNewData.setItem("PARENT_OID", parentOid);
   drNewData.setItem("ORDER_CODE", newOrderCode);
   drNewData.setItem("MENU_TYPE", menuType);
   drNewData.setItem("MENU_NAME", "新菜单项");
   
   dboFW_MENU.execInsert(drNewData);
   loadMenu();
   tvwMenu.setValue(oid);
};

// 添加下级菜单项
function btnAddSub_click() {
   var drCurrentData = tvwMenu.currentNode.data;
   var parentOid = drCurrentData.getValue("OID");
   var orderCode = drCurrentData.getValue("ORDER_CODE");
   var menuType = drCurrentData.getValue("MENU_TYPE");
   dboFW_MENU.whereClause = "where PARENT_OID = '" + parentOid + "'";
   var offset = dboFW_MENU.count("OID");
   var newOrderCode = offset + "";
   if (offset < 100) newOrderCode = "0" + newOrderCode;
   if (offset < 10) newOrderCode = "0" + newOrderCode;
   newOrderCode = orderCode + newOrderCode;
   
   var drNewData = dboFW_MENU.execCreate();
   var oid = drNewData.getValue("id");
   drNewData.setItem("OID", oid);
   drNewData.setItem("PARENT_OID", parentOid);
   drNewData.setItem("ORDER_CODE", newOrderCode);
   drNewData.setItem("MENU_TYPE", "item");
   drNewData.setItem("MENU_NAME", "新菜单项");
   
   dboFW_MENU.execInsert(drNewData);
   loadMenu();
   tvwMenu.setValue(oid);
};

// 删除菜单项
function btnDelete_click() {
	// 获取删除后的焦点
	var index = tvwMenu.currentNode.sn;
	if (index < tvwMenu.getSize() - 1) {
		index ++;
	} else {
		index --;
	}
	var nextData = tvwMenu.getBindingData().getRecord(index);
   
    // 获取当前菜单数据
    var drCurrentData = tvwMenu.currentNode.data;
    var oid = drCurrentData.getValue("OID");
    var orderCode = drCurrentData.getValue("ORDER_CODE");   
   
    // 该节点及下属节点
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "select * from FW_MENU where ORDER_CODE like '" + orderCode + "%'";
    var dtMenu = dba.execQuery();
    for (var i = 0; i < dtMenu.getSize(); i++) {
        var drMenu = dtMenu.getRecord(i);
        dba.SQL = "delete FW_GROUP_APP where APPLICATION = '" + drMenu.getValue("OID") + "'";
        dba.execUpdate();
        dba.SQL = "delete FW_ROLE_AUTHORIZATION where MENU_OID = '" + drMenu.getValue("OID") + "'";
        dba.execUpdate();
        dba.SQL = "delete FW_MENU where OID = '" + drMenu.getValue("OID") + "'";
        dba.execUpdate();
    }   
	dboFW_MENU.resetOrderCode();     
   
	// 重新加载菜单列表
	loadMenu();
   
    // 置焦点
    if (nextData != null) {
        tvwMenu.setValue(nextData.getValue("id"));
    }
};

// 上移菜单项
function btnMoveUp_click() {
   var previousNode = tvwMenu.getPreviousNode();
   if (previousNode == null) return;
   
   var currentData = tvwMenu.currentNode.data;
   var previousData = previousNode.data;
   
   var tempParentOid = currentData.getValue("PARENT_OID");
   var tempOrderCode = currentData.getValue("ORDER_CODE");
   currentData.setItem("PARENT_OID", previousData.getValue("PARENT_OID"));
   currentData.setItem("ORDER_CODE", previousData.getValue("ORDER_CODE"));
   previousData.setItem("PARENT_OID", tempParentOid);
   previousData.setItem("ORDER_CODE", tempOrderCode);
   
   dboFW_MENU.execUpdate(currentData);
   dboFW_MENU.execUpdate(previousData);
   dboFW_MENU.resetOrderCode();  
   
   loadMenu();
   tvwMenu.setValue(currentData.getValue("id"));
};

// 下移菜单项
function btnMoveDown_click() {
   var nextNode = tvwMenu.getNextNode();
   if (nextNode == null) return;
   
   var currentData = tvwMenu.currentNode.data;
   var nextData = nextNode.data;
   
   var tempParentOid = currentData.getValue("PARENT_OID");
   var tempOrderCode = currentData.getValue("ORDER_CODE");
   currentData.setItem("PARENT_OID", nextData.getValue("PARENT_OID"));
   currentData.setItem("ORDER_CODE", nextData.getValue("ORDER_CODE"));
   nextData.setItem("PARENT_OID", tempParentOid);
   nextData.setItem("ORDER_CODE", tempOrderCode);
   
   dboFW_MENU.execUpdate(currentData);
   dboFW_MENU.execUpdate(nextData);
   dboFW_MENU.resetOrderCode();  
   
   loadMenu();
   tvwMenu.setValue(currentData.getValue("id"));
};

// 保存菜单项
function btnSave_click() {
  	dboFW_MENU.execUpdate();
   var nodeId = tvwMenu.getValue();
  	tvwMenu.draw();
   tvwMenu.setValue(nodeId);
};


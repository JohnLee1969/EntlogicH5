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
// 应用数据声明    
var dboFW_PARAMETER = null;
var dtMenu = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 交互组件声明   

var tvwMenu = null;
var mdiContainer = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 私有函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
	dboFW_PARAMETER = new entlogic_dbo("entlogicSystem", "FW_PARAMETER");
	dtMenu = new entlogic_data_table();
	
	// 初始化控件
  	tvwMenu = new entlogic_ui_treeview("tvwMenu", formControls);
	tvwMenu.setBindingData(dtMenu);
  	tvwMenu.nodeClick = tvwMenu_nodeClick;
    
    mdiContainer = new entlogic_ui_mdi_tab("mdiContainer", "Desktop.html");
   
    $("#btnPwd").click(btnPwd_click);
    $("#btnLogout").click(btnLogout_click);  
    
    // 去掉文字选择
    document.onselectstart = function(){return false;};
};

// 加载系统参数
function loadParameter() {
  	dboFW_PARAMETER.orderByClause = "order by PARAM_GROUP, ORDER_CODE";
	dboFW_PARAMETER.execQuery();	
	var appName = dboFW_PARAMETER.dataTable.getRecord(0).getValue("PARAM_VALUE");
	var appNameEn = dboFW_PARAMETER.dataTable.getRecord(1).getValue("PARAM_VALUE");
	
	$("#divAppName").html(appName);
	$("#divAppNameEn").html(appNameEn);
}

// 加载菜单数据
function loadMenu() {
    var dboFW_MENU = new entlogic_dbo("entlogicSystem", "FW_MENU");
  	dboFW_MENU.orderByClause = "order by ORDER_CODE";
	dboFW_MENU.execQuery();
    
    dtMenu.clear();

    var userOid = getUserSessionItem("userOid");    
    var dboFW_USER_AUTHORIZATION = new entlogic_dbo("entlogicSystem", "FW_USER_AUTHORIZATION");
    dboFW_USER_AUTHORIZATION.whereClause = "where USER_OID = '" + userOid + "'";
    dboFW_USER_AUTHORIZATION.execQuery();
    
    var whereClause = "where (1 <> 1 ";
    for (var i = 0; i < dboFW_USER_AUTHORIZATION.dataTable.getSize(); i++) {
        var drRole = dboFW_USER_AUTHORIZATION.dataTable.getRecord(i);
        whereClause += "or ROLE_OID = '" + drRole.getValue("ROLE_OID") + "' ";        
    }
    whereClause += ") ";
    
    var dboFW_ROLE_AUTHORIZATION = new entlogic_dbo("entlogicSystem", "FW_ROLE_AUTHORIZATION");
    for (var i = 0; i < dboFW_MENU.dataTable.getSize(); i++) {
        var drMenu = dboFW_MENU.dataTable.getRecord(i);
        dboFW_ROLE_AUTHORIZATION.whereClause = whereClause + "and MENU_OID = '" + drMenu.getValue("OID") + "'";
        if (dboFW_ROLE_AUTHORIZATION.count() > 0 || userOid == "admin") dtMenu.addRecord(drMenu);
    }
	dtMenu.synchronizeLayout();
};


/////////////////////////////////////////////////////////////////////////////////////////////////
// 事件响应函数

// 页面加载完成事件相应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
  
  	// 加载系统参数
  	loadParameter();
	
	// 加载用户菜单数据
  	loadMenu();
};

// 菜单树控件节点单击事件响应
function tvwMenu_nodeClick() {
	var menuRecord = tvwMenu.currentNode.data;
	var menuType = menuRecord.getItemByKey("MENU_TYPE").value;
	var menuName = menuRecord.getItemByKey("MENU_NAME").value;
	var bpFormUrl = menuRecord.getItemByKey("APPLICATION").value;
	if (menuType == "item") {
        mdiContainer.addPage(menuName, bpFormUrl);
	}
};

// 修改密码操作
function btnPwd_click() {
	localStorage.setItem("userName", userName);
	popUpDialog("PasswordDialog.html", 400, 272, "修改用户密码", "closeDialog");
};

// 退出登录
function btnLogout_click() {
	$(location).attr("href", "LoginForm.html");
};


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
var dboCM_CATALOG = null;
var dboCM_CONTENT = null;



/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var tvwCatalog = null;
var dgrContent = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明



/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboCM_CATALOG = new entlogic_dbo("entlogicSystem", "CM_CATALOG");
    dboCM_CONTENT = new entlogic_dbo("entlogicSystem", "CM_CONTENT");
	
	// 初始化交互组件
    tvwCatalog = new entlogic_ui_treeview("tvwCatalog", formControls);
    tvwCatalog.setBindingData(dboCM_CATALOG.dataTable);
    tvwCatalog.nodeClick = loadContent;
    tvwCatalog.nodeDbclick = btnEditCatalog_click;
    
    dgrContent = new entlogic_ui_datagrid("dgrContent", formControls);
    dgrContent.setBindingData(dboCM_CONTENT.dataTable);
    dgrContent.rowDbclick = btnEditContent_click;

    $("#btnAddCatalog").click(btnAddCatalog_click);
	$("#btnEditCatalog").click(btnEditCatalog_click);
	$("#btnDeleteCatalog").click(btnDeleteCatalog_click);
	$("#btnMoveUpCatalog").click(btnMoveUpCatalog_click);
	$("#btnMoveDownCatalog").click(btnMoveDownCatalog_click);

    $("#btnAddContent").click(btnAddContent_click);
	$("#btnEditContent").click(btnEditContent_click);
	$("#btnDeleteContent").click(btnDeleteContent_click);
	$("#btnMoveUpContent").click(btnMoveUpContent_click);
	$("#btnMoveDownContent").click(btnMoveDownContent_click);
    
    // 去掉文字选择
    document.onselectstart = function(){return false;};
};

// 加载栏目数据
function loadCatalog() {
    dboCM_CATALOG.whereClause = "where 1=1";
    dboCM_CATALOG.orderByClause = "order by ORDER_CODE";
    dboCM_CATALOG.execQuery();
};

// 重新排序
function reorderCatalog() {
    var orderCodes = tvwCatalog.rootNode.getOrderCodeArray("");
    var dba = new entlogic_dba("jdbc/entlogic");    
    for (var i = 0; i < dboCM_CATALOG.dataTable.getSize(); i++) {
        var dr = dboCM_CATALOG.dataTable.getRecord(i);
        var oid = dr.getValue("OID");
        var orderCode = orderCodes[i + 1];
        dba.SQL = "update CM_CATALOG set ORDER_CODE = '" + orderCode + "' where OID = '" + oid + "'";
        dba.execUpdate();
    }
};

// 加载内容数据
function loadContent() {
    var columnOid = tvwCatalog.getValue();
    dboCM_CONTENT.whereClause = "where CM_CATALOG='" + columnOid + "'";
    dboCM_CONTENT.orderByClause = "order by SN";
    dboCM_CONTENT.execQuery();
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadCatalog();
    tvwCatalog.currentNode.expand();
    loadContent();
};

// 添加栏目按钮单击事件响应
function btnAddCatalog_click() {
    var parentOid = tvwCatalog.getValue();
    var url = encodeURI("ColumnEditDialog.html?parentOid=" + parentOid);
    popUpDialog(url, 200, 150, "添加内容栏目", function() {
        loadCatalog();
        tvwCatalog.setValue(oid);
        reorderCatalog();      
    });
};

// 编辑栏目按钮单击事件响应
function btnEditCatalog_click() {
    var catalogOid = tvwCatalog.getValue();
    var url = encodeURI("ColumnEditDialog.html?catalogOid=" + catalogOid);
    popUpDialog(url, 200, 150, "编辑内容栏目", function() {
        loadCatalog();
        tvwCatalog.setValue(oid);
    });
};

// 删除栏目按钮单击事件响应
function btnDeleteCatalog_click() {
    reorderCatalog();
};

// 上移栏目按钮单击事件响应
function btnMoveUpCatalog_click() {
};

// 下移栏目按钮单击事件响应
function btnMoveDownCatalog_click() {
};

// 添加内容按钮单击事件响应
function btnAddContent_click() {
    var catalogOid = tvwCatalog.getValue();
    var url = encodeURI("ContentEditDialog.html?catalogOid=" + catalogOid);
    popUpDialog(url, 200, 150, "添加应用内容", function(oid) {
 		loadContent();       
        dgrContent.setValue(oid);      
    });
};

// 编辑内容按钮单击事件响应
function btnEditContent_click() {
    var contentOid = dgrContent.getValue();
    var url = encodeURI("ContentEditDialog.html?contentOid=" + contentOid);
    popUpDialog(url, 200, 150, "编辑应用内容",  function(oid) {
 		loadContent();       
        dgrContent.setValue(oid);      
    });
};

// 删除内容按钮单击事件响应
function btnDeleteContent_click() {
    var dr = dboCM_CONTENT.dataTable.getRecord(dgrContent.getSelectedIndex());
    var src = dr.getValue("SRC");
    deleteFile(src);
    dboCM_CONTENT.execDelete();
    loadContent();
};

// 上移内容按钮单击事件响应
function btnMoveUpContent_click() {
};

// 下移内容按钮单击事件响应
function btnMoveDownContent_click() {
};

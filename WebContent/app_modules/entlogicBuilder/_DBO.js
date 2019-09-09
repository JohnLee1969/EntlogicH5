/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据声明    

// 全局应用
var application = parent.application;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

// 页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//数据声明    
var divLeftSplitor = {};
var dtDBOCatalog = {};


/////////////////////////////////////////////////////////////////////////////////////////////////
//组件声明   

var tvwDBOCatalog = {};
var txtName = {};
var txtDsn = {};
var txtSql = {};
var txtSqlMssql = {};
var txtSqlOracle = {};
var txtSqlTest = {};
var txtDescription = {};

/////////////////////////////////////////////////////////////////////////////////////////////////
//内部变量声明
var appName = parent.appName;


/////////////////////////////////////////////////////////////////////////////////////////////////
//内部函数声明


/**
 * 组件初始化
 */ 
function initComponents() {
	// 初始化数据组件
	dtDBOCatalog = new entlogic_data_table();
	
	divLeftSplitor = new entlogic_ui_draggable_h("divLeftSplitor");
	divLeftSplitor.dragMove = divLeftSplitor_dragMove;
	
	// 初始化交互组件
	tvwDBOCatalog = new entlogic_ui_treeview("tvwDBOCatalog", formControls);
	tvwDBOCatalog.setBindingData(dtDBOCatalog);
	
	txtName = new entlogic_ui_text("txtName", formControls);
	txtName.setBindingData(dtDBOCatalog, "dboName");
	$("#txtName").change(saveDBO);
	
	txtDsn = new entlogic_ui_text("txtDsn", formControls);
	txtDsn.setBindingData(dtDBOCatalog, "dsn");
	$("#txtDsn").change(saveDBO);
	
	txtSql = new entlogic_ui_text("txtSql", formControls);
	txtSql.setBindingData(dtDBOCatalog, "SQL");
	$("#txtSql").change(saveDBO);
	
	txtSqlMssql = new entlogic_ui_text("txtSqlMssql", formControls);
	txtSqlMssql.setBindingData(dtDBOCatalog, "SQL_MSSQL");
	$("#txtSqlMssql").change(saveDBO);
	
	txtSqlOracle = new entlogic_ui_text("txtSqlOracle", formControls);
	txtSqlOracle.setBindingData(dtDBOCatalog, "SQL_ORACLE");
	$("#txtSqlOracle").change(saveDBO);
	
	txtSqlTest = new entlogic_ui_text("txtSqlTest", formControls);
	txtSqlTest.setBindingData(dtDBOCatalog, "SQL_TEST");
	$("#txtSqlTest").change(saveDBO);
	
	txtDescription = new entlogic_ui_text("txtDescription", formControls);
	txtDescription.setBindingData(dtDBOCatalog, "DESCRIPTION");
	$("#txtDescription").change(saveDBO);
	
	$("#btnAdd").click(btnAdd_click);
	$("#btnDelete").click(btnDelete_click);
	$("#btnSave").click(btnSave_click);
};

/**
 * 加载数据库服务列表 */
function loadDBOCatalog() {
	var parameter = new entlogic_data_record();
	parameter.addItem("appName", appName);
	var dataPackage = postBpForm("com.entlogic.h5.builder.forms._DBO", "loadDBOCatalog", formControls, parameter);
	dataPackage.fillDataTable(dtDBOCatalog, "dtDBOCatalog");
};

/**
 * 保存数据库服务
 */
function saveDBO() {
	var dr = tvwDBOCatalog.currentNode.data;
	var parameter = new entlogic_data_record();
	var id = dr.getItemByKey("id").value;
	if (dr != null) {
		parameter.addItem("id", id);
		parameter.addItem("level", dr.getItemByKey("lv").value);
		parameter.addItem("dboFunction", dr.getItemByKey("dboFunction").value);		
	}
	postBpForm("com.entlogic.h5.builder.forms._DBO", "saveDBO", formControls, parameter);
	loadDBOCatalog();
	tvwDBOCatalog.setValue(id);
};

/**
 * 删除数据库服务
 */
function deleteDBO() {
	var dr = tvwDBOCatalog.currentNode.data;
	var parameter = new entlogic_data_record();
	if ( dr != null) {
		parameter.addItem("id", dr.getItemByKey("id").value);
		parameter.addItem("dboFunction", dr.getItemByKey("dboFunction").value);		
	}
	postBpForm("com.entlogic.h5.builder.forms._DBO", "deleteDBO", formControls, parameter);
	loadDBOCatalog();
};




/////////////////////////////////////////////////////////////////////////////////////////////////
//页面事件响应

/**
 * 父页面打开事件处理
 */ 
function bodyOnload() {
    initKeys();
	initComponents();
	loadDBOCatalog();
};

/**
 * 分隔条移动
 */
function divLeftSplitor_dragMove() {
	$("#divLeft").css("width", divLeftSplitor.x + "px");
	$("#divWork").css("left", divLeftSplitor.x + 4 + "px"); 
};

/**
 * 创建DBO
 */
function btnAdd_click() {
	popUpDialog("_DBOCreateDialog.html", 300, 180, "添加DBO", function(dboId) {
        loadDBOCatalog();
        tvwDBOCatalog.setValue(dboId);
        loadDBOCatalog();
    });
};

/**
 * 删除服务目录节点点击事件
 */
function btnDelete_click() {
	deleteDBO();
};

/**
 * 保存服务目录节点点击事件
 */
function btnSave_click() {
	saveDBO();
};

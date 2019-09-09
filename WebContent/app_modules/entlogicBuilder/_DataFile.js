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
var dtFileNode = {};


/////////////////////////////////////////////////////////////////////////////////////////////////
//组件声明   
var tvwFileNode = {};


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
	dtFileNode = new entlogic_data_table();
	
	// 初始化交互组件
	divLeftSplitor = new entlogic_ui_draggable_h("divLeftSplitor");
	divLeftSplitor.dragStart = divLeftSplitor_dragStart;
	divLeftSplitor.dragMove = divLeftSplitor_dragMove;
	divLeftSplitor.dragStop = divLeftSplitor_dragStop;
	
	tvwFileNode = new entlogic_ui_treeview("tvwFileNode", formControls);
	tvwFileNode.setBindingData(dtFileNode);
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//页面事件响应

/**
 * 父页面打开事件处理
 */ 
function bodyOnload() {
	// 初始化组件
    initKeys();
	initComponents();
	
	// 加载文件树
	loadFileTree();
};

/**
 * 加载文件树
 */
function loadFileTree() {
	// 加载后台数据
	var rootPath = "/app_data/" + appName;
	var filter = ".*";
	var parameters = new entlogic_data_record();
	parameters.addItem("rootPath", rootPath);
	parameters.addItem("filter", filter);
	var dataPackage = postBpService("com.entlogic.h5.services.FileService", "loadFileTree", parameters);
	dataPackage.fillDataTable(dtFileNode, "dtFileNode");
};

/**
 * 
 */
function divLeftSplitor_dragStart() {
	$("#divWork").hide();
};

/**
 * 
 */
function divLeftSplitor_dragMove() {
	$("#divLeft").css("width", divLeftSplitor.x + "px");
	$("#divWork").css("left", divLeftSplitor.x + 4 + "px"); 
};

/**
 * 
 */
function divLeftSplitor_dragStop() {
	$("#divWork").show();
};


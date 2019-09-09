/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 全局应用
var application = parent.application;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

//本页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    
var dboHS_WORKER = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lstWorker = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
	
	// 初始化交互组件   
    lstWorker = new entlogic_ui_list("lstWorker", formControls);
    lstWorker.setBindingData(dboHS_WORKER.dataTable);
    lstWorker.itemDbclick = btnEdit_click;
    
    $("#iframeSearch").attr("src", "WorkerSearch.html");
    
    $("#btnSearch").click(btnSearch_click);
    $("#btnAdd").click(btnAdd_click);
    $("#btnEdit").click(btnEdit_click);
    $("#btnDelete").click(btnDelete_click);
    
    document.onselectstart = function(){return false;};
};

// 刷新接口
function refresh() {
    loadWorkers("");
};

// 加载工作人员列表数据
function loadWorkers(whereClause) {
	dboHS_WORKER.whereClause = whereClause;
    dboHS_WORKER.execQuery();
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	$("#divSearch").hide();
    loadWorkers("");
};

// 搜索按钮单击时间响应
function btnSearch_click() {
	$("#divSearch").show();
    $("#btnSearch").hide();
};

// 搜索栏关闭
function WorkSearch_close() {
	$("#divSearch").hide();
    $("#btnSearch").show();
    loadWorkers("");
};

// 添加服务人员数据
function btnAdd_click() {
	parent.mdiContainer.addPage("新服务人员档案", "../HSBOSS/WorkerEditForm.html");
};

// 编辑服务人员数据
function btnEdit_click() {
    var workerOid = lstWorker.getValue();
	parent.mdiContainer.addPage("编辑务人员档案", "../HSBOSS/WorkerEditForm.html?workerOid=" + workerOid);
};

// 删除服务人员数据
function btnDelete_click() {
};
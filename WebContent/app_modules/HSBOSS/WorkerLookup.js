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
    lstWorker.itemDbclick = btnOk_click;
    
    $("#btnSearch").click(btnSearch_click);
    $("#btnOk").click(btnOk_click);
};


// 加载工作人员列表数据
function loadWorkers(whereClause) {
	dboHS_WORKER.whereClause = "where 1=1";
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
	loadWorkers();
};

// 搜索按钮单击事件响应
function btnSearch_click() {
	loadWorkers();
};

// 确定按钮单击事件响应
function btnOk_click() {
    // 获取当前选项
    var dr = dboHS_WORKER.dataTable.getRecord(lstWorker.getSelectedIndex());
    var value = "";
    var text = "";
    if (dr != null) {
        value = dr.getValue("OID");
        text = dr.getValue("NAME");
    }
	
	// 返回父窗口
	dialogCallBack(value, text);
    closeDialog();
};

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
var dboHS_ENTERPRISE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtKeyword = null;
var lstEnterprise = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明


 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
	dboHS_ENTERPRISE = new entlogic_dbo("HSBOSS", "HS_ENTERPRISE");
    
	// 初始化交互组件
    txtKeyword = new entlogic_ui_text("txtKeyword", formControls);
    
    lstEnterprise = new entlogic_ui_list("lstEnterprise", formControls);
    lstEnterprise.setBindingData(dboHS_ENTERPRISE.dataTable);
    lstEnterprise.itemDbclick = btnOk_click;
   
	$("#btnSearch").click(btnSearch_click);
	$("#btnOk").click(btnOk_click);
};

// 加载编码数据
function loadEnterprise() {
	// 查询获取数据
    if (txtKeyword.getValue().length > 0) {
		dboHS_ENTERPRISE.whereClause = "where contains(FULL_TEXT, '" + txtKeyword.getValue() + "')";
    } else {
        dboHS_ENTERPRISE.whereClause = "";
    }
    dboHS_ENTERPRISE.orderByClause = "order by NAME";
    dboHS_ENTERPRISE.execQuery();
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadEnterprise();
};

// 搜索按钮点击事件响应
function btnSearch_click() {
    loadEnterprise();
};

// 确定按钮单击事件响应
function btnOk_click() {
    // 获取当前选项
    var dr = dboHS_ENTERPRISE.dataTable.getRecord(lstEnterprise.getSelectedIndex());
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

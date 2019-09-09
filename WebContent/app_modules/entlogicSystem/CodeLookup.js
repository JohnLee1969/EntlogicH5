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

/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   

var txtKeyword = null;
var lstCode = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明

var codeTypeOid = null;
 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboFW_CODE = new entlogic_dbo("entlogicSystem", "FW_CODE");
   
	// 初始化交互组件
    txtKeyword = new entlogic_ui_text("txtKeyword", formControls);
    
    lstCode = new entlogic_ui_list("lstCode", formControls);
    lstCode.setBindingData(dboFW_CODE.dataTable);
    lstCode.itemDbclick = btnOk_click;
   
   $("#btnOk").click(btnOk_click);
};

// 加载编码数据
function loadCode() {
	// 查询获取数据
	dboFW_CODE.whereClause = "where CODE_TYPE_OID = '" + codeTypeOid + "'";
    dboFW_CODE.orderByClause = "order by ORDER_CODE";
    dboFW_CODE.execQuery();
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	codeTypeOid = getUrlParam("codeTypeOid");
    loadCode();
};

// 确定按钮单击事件响应
function btnOk_click() {
    // 获取当前选项
    var dr = dboFW_CODE.dataTable.getRecord(lstCode.getSelectedIndex());
    var value = "";
    var text = "";
    if (dr != null) {
        value = dr.getValue("CODE");
        text = dr.getValue("CODE_NAME");
    }
	
	// 返回父窗口
	parent.dialogCallBack(value, text);
    parent.closeDialog();
};

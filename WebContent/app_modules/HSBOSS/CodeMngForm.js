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
var dboHS_CODE_TYPE = null;
var dboHS_CODE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var tvwCodeType = null;
var dgrCode = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	dboHS_CODE_TYPE = new entlogic_dbo("HSBOSS", "HS_CODE_TYPE");
	dboHS_CODE = new entlogic_dbo("HSBOSS", "HS_CODE");

    // 初始化交互组件
    tvwCodeType = new entlogic_ui_treeview("tvwCodeType", formControls);
    tvwCodeType.setBindingData(dboHS_CODE_TYPE.dataTable);
    tvwCodeType.nodeClick = tvwCodeType_itemClick;
    tvwCodeType.nodeDbclick = btnEditCodeType_click;
   
    dgrCode = new entlogic_ui_datagrid("dgrCode", formControls);
    dgrCode.setBindingData(dboHS_CODE.dataTable);
    dgrCode.rowDbclick = btnEditCode_click;
   
    $("#btnAddCodeType").click(btnAddCodeType_click);
    $("#btnEditCodeType").click(btnEditCodeType_click);
    $("#btnDeleteCodeType").click(btnDeleteCodeType_click);
    $("#btnMoveUp").click(btnMoveUp_click);
    $("#btnMoveDown").click(btnMoveDown_click);
    $("#btnAddCode").click(btnAddCode_click);
    $("#btnEditCode").click(btnEditCode_click);
    $("#btnDeleteCode").click(btnDeleteCode_click);
	$("#btnExit").click(btnExit_click);
};

// 加载编码类型列表
function loadCodeType() {
    dboHS_CODE_TYPE.orderByClause = "order by SN";
    dboHS_CODE_TYPE.execQuery();
};

// 加载编码列表
function loadCode() {
    var codeTypeOid = tvwCodeType.getValue();
    dboHS_CODE.orderByClause = "order by ORDER_CODE";
    dboHS_CODE.whereClause = "where HS_CODE_TYPE = '" + codeTypeOid + "'";
    dboHS_CODE.execQuery();
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadCodeType();
	loadCode();
};

// 退出按钮单击事件响应
function btnExit_click() {
	window.location.href = applicationRoot + "/app_modules/HSBOSS/Desktop.html";
	return;
};

// 编码类型列表项单击事件响应
function tvwCodeType_itemClick() {
	loadCode();
};

// 添加编码类型按钮单击时间响应
function btnAddCodeType_click() {
    var url = encodeURI("CodeTypeEditDialog.html");
    application.popUpDialog(url, 200, 150, "编码类型", CodeTypeEditDialog_close); 
};

// 编辑编码类型按钮单击时间响应
function btnEditCodeType_click() {
	var codeTypeOid = tvwCodeType.getValue();
	var url = encodeURI("CodeTypeEditDialog.html?codeTypeOid=" + codeTypeOid);
	application.popUpDialog(url, 200, 150, "编码类型", CodeTypeEditDialog_close);  
};

// 删除编码类型按钮单击时间响应
function btnDeleteCodeType_click() {
    var dba = new entlogic_dba("jdbc/entlogic");
    var transactionId = dba.transactionBegin();
    
    // 删除该类型所有编码项
    dba.SQL = "delete HS_CODE where HS_CODE_TYPE = '#codeTypeOid#'";
    dba.setParameter("codeTypeOid", tvwCodeType.getValue());
    dba.execUpdate(transactionId);
   
    // 删除该类型数据
    dba.SQL = "delete HS_CODE_TYPE where OID = '#codeTypeOid#'";
    dba.setParameter("codeTypeOid", tvwCodeType.getValue());
    dba.execUpdate(transactionId);
   
    dba.transactionCommit(transactionId);
   
    // 刷新显示
    var index = tvwCodeType.getSelectedIndex();
 	loadCodeType();
    if (index >= 0 && index < tvwCodeType.getSize()) {
        tvwCodeType.setSelectedIndex(index);
    }
    loadCode();  
};

// 上移编码类型
function btnMoveUp_click() {
    var currIndex = tvwCodeType.getSelectedIndex();
    if (currIndex <= 0 ) reutrn;
    var currDr = dboHS_CODE_TYPE.dataTable.getRecord(currIndex);
    var prevDr = dboHS_CODE_TYPE.dataTable.getRecord(currIndex - 1);
    var sn = currDr.getValue("SN");
    currDr.setItem("SN", prevDr.getValue("SN"));
    prevDr.setItem("SN", sn);
    dboHS_CODE_TYPE.execUpdate(currDr);
    dboHS_CODE_TYPE.execUpdate(prevDr);
    loadCodeType();
    tvwCodeType.setValue(currDr.getValue("id"));
    loadCode();
};


// 下移编码类型
function btnMoveDown_click() {
    var currIndex = tvwCodeType.getSelectedIndex();
    if (currIndex >= tvwCodeType.getSize()) reutrn;
    var currDr = dboHS_CODE_TYPE.dataTable.getRecord(currIndex);
    var nextDr = dboHS_CODE_TYPE.dataTable.getRecord(currIndex + 1);
    var sn = currDr.getValue("SN");
    currDr.setItem("SN", nextDr.getValue("SN"));
    nextDr.setItem("SN", sn);
    dboHS_CODE_TYPE.execUpdate(currDr);
    dboHS_CODE_TYPE.execUpdate(nextDr);
    loadCodeType();
    tvwCodeType.setValue(currDr.getValue("id"));
    loadCode();
};

// 编码类型编辑窗口返回事件
function CodeTypeEditDialog_close(oid) {
	closeDialog();
    if (typeof(oid) == "undefined") return;
	loadCodeType();
	tvwCodeType.setValue(oid);
	loadCode();
};

// 添加编码按钮单击时间响应
function btnAddCode_click() {
	var codeTypeOid = tvwCodeType.getValue();
	var url = encodeURI("CodeEditDialog.html?codeTypeOid=" + codeTypeOid);
	popUpDialog(url, 420, 336, "编码", CodeEditDialog_close);
};

// 编辑编码按钮单击时间响应
function btnEditCode_click() {
    var codeOid = dgrCode.getValue();
    var url = encodeURI("CodeEditDialog.html?codeOid=" + codeOid);
    popUpDialog(url, 420, 336, "编码", CodeEditDialog_close);
};

// 删除编码按钮单击时间响应
function btnDeleteCode_click() {
	// 获取当前编码行索引
	var index = dgrCode.getSelectedIndex();
   
	// 删除编码
	dboHS_CODE.execDelete();
   
    // 刷新编码列表  
	loadCode();
   
	// 重置焦点
	if (dgrCode.getSize() == 0) return;
	if (index >= 0 && index < dgrCode.getSize()) {
		dgrCode.setSelectedIndex(index);
	}
};

// 编码类型编辑窗口返回事件
function CodeEditDialog_close(oid) {
	closeDialog();
   if (typeof(oid) == "undefined") return;
	loadCode();
	dgrCode.setValue(oid);
};

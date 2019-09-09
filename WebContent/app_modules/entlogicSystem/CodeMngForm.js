/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 全局应用
var aplication = parent.aplication;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

// 页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    

var dboFW_CODE_TYPE = null;
var dboFW_CODE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   

var lstCodeType = null;
var dgrCode = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明




/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	dboFW_CODE_TYPE = new entlogic_dbo("entlogicSystem", "FW_CODE_TYPE");
	dboFW_CODE = new entlogic_dbo("entlogicSystem", "FW_CODE");
   
	// 初始化交互组件
    lstCodeType = new entlogic_ui_list("lstCodeType", formControls);
    lstCodeType.setBindingData(dboFW_CODE_TYPE.dataTable);
    lstCodeType.itemClick = lstCodeType_itemClick;
    lstCodeType.itemDbclick = btnEditCodeType_click;
   
    dgrCode = new entlogic_ui_datagrid("dgrCode", formControls);
    dgrCode.setBindingData(dboFW_CODE.dataTable);
    dgrCode.rowDbclick = btnEditCode_click;
   
    $("#btnAddCodeType").click(btnAddCodeType_click);
    $("#btnEditCodeType").click(btnEditCodeType_click);
    $("#btnDeleteCodeType").click(btnDeleteCodeType_click);
    $("#btnMoveUp").click(btnMoveUp_click);
    $("#btnMoveDown").click(btnMoveDown_click);
    $("#btnAddCode").click(btnAddCode_click);
    $("#btnEditCode").click(btnEditCode_click);
    $("#btnDeleteCode").click(btnDeleteCode_click);
    
    // 去掉文字选择
    document.onselectstart = function(){return false;};
};

// 加载编码类型列表
function loadCodeType() {
    dboFW_CODE_TYPE.orderByClause = "order by SN";
    dboFW_CODE_TYPE.execQuery();
};

// 加载编码列表
function loadCode() {
    var codeTypeOid = lstCodeType.getValue();
    dboFW_CODE.orderByClause = "order by ORDER_CODE";
    dboFW_CODE.whereClause = "where CODE_TYPE_OID = '" + codeTypeOid + "'";
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
	loadCodeType();
	loadCode();
};

// 编码类型列表项单击事件响应
function lstCodeType_itemClick() {
	loadCode();
};

// 添加编码类型按钮单击时间响应
function btnAddCodeType_click() {
    var url = encodeURI("CodeTypeEditDialog.html");
    popUpDialog(url, 200, 150, "添加编码类型", CodeTypeEditDialog_close);
};

// 编辑编码类型按钮单击时间响应
function btnEditCodeType_click() {
    var codeTypeOid = lstCodeType.getValue();
    var url = encodeURI("CodeTypeEditDialog.html?codeTypeOid=" + codeTypeOid);
    popUpDialog(url, 200, 150, "编辑编码类型", CodeTypeEditDialog_close);
};

// 删除编码类型按钮单击时间响应
function btnDeleteCodeType_click() {
   var dba = new entlogic_dba("jdbc/entlogic");
   var transactionId = dba.transactionBegin();
    
   // 删除该类型所有编码项
   dba.SQL = "delete FW_CODE where CODE_TYPE_OID = '#codeTypeOid#'";
   dba.setParameter("codeTypeOid", lstCodeType.getValue());
   dba.execUpdate(transactionId);
   
   // 删除该类型数据
   dba.SQL = "delete FW_CODE_TYPE where OID = '#codeTypeOid#'";
   dba.setParameter("codeTypeOid", lstCodeType.getValue());
   dba.execUpdate(transactionId);
   
   dba.transactionCommit(transactionId);
   
   // 刷新显示
   var index = lstCodeType.getSelectedIndex();
 	loadCodeType();
   if (index >= 0 && index < lstCodeType.getSize()) {
      lstCodeType.setSelectedIndex(index);
   }
   loadCode();  
};

// 上移编码类型
function btnMoveUp_click() {
    var currIndex = lstCodeType.getSelectedIndex();
    if (currIndex <= 0 ) reutrn;
    var currDr = dboFW_CODE_TYPE.dataTable.getRecord(currIndex);
    var prevDr = dboFW_CODE_TYPE.dataTable.getRecord(currIndex - 1);
    var sn = currDr.getValue("SN");
    currDr.setItem("SN", prevDr.getValue("SN"));
    prevDr.setItem("SN", sn);
    dboFW_CODE_TYPE.execUpdate(currDr);
    dboFW_CODE_TYPE.execUpdate(prevDr);
    loadCodeType();
    lstCodeType.setValue(currDr.getValue("id"));
    loadCode();
};


// 下移编码类型
function btnMoveDown_click() {
    var currIndex = lstCodeType.getSelectedIndex();
    if (currIndex >= lstCodeType.getSize()) reutrn;
    var currDr = dboFW_CODE_TYPE.dataTable.getRecord(currIndex);
    var nextDr = dboFW_CODE_TYPE.dataTable.getRecord(currIndex + 1);
    var sn = currDr.getValue("SN");
    currDr.setItem("SN", nextDr.getValue("SN"));
    nextDr.setItem("SN", sn);
    dboFW_CODE_TYPE.execUpdate(currDr);
    dboFW_CODE_TYPE.execUpdate(nextDr);
    loadCodeType();
    lstCodeType.setValue(currDr.getValue("id"));
    loadCode();
};

// 编码类型编辑窗口返回事件
function CodeTypeEditDialog_close(oid) {
	loadCodeType();
	lstCodeType.setValue(oid);
	loadCode();
};

// 添加编码按钮单击时间响应
function btnAddCode_click() {
    var codeTypeOid = lstCodeType.getValue();
    var url = encodeURI("CodeEditDialog.html?codeTypeOid=" + codeTypeOid);
    popUpDialog(url, 200, 150, "添加系统编码", CodeEditDialog_close);
};

// 编辑编码按钮单击时间响应
function btnEditCode_click() {
   var codeOid = dgrCode.getValue();
    var url = encodeURI("CodeEditDialog.html?codeOid=" + codeOid);
    popUpDialog(url, 200, 150, "编辑系统编码", CodeEditDialog_close);
};

// 删除编码按钮单击时间响应
function btnDeleteCode_click() {
    // 获取当前编码行索引
    var index = dgrCode.getSelectedIndex();
   
    // 删除编码
    dboFW_CODE.execDelete();
   
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
	loadCode();
	dgrCode.setValue(oid);
};

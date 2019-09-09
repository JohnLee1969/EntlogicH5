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
var txtOrderCode = null;
var txtCode = null;
var txtCodeName = null;
var txtDescription = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var codeTypeOid = null;
var codeOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	dboFW_CODE = new entlogic_dbo("entlogicSystem", "FW_CODE");
   
	// 初始化交互组件
    txtOrderCode = new entlogic_ui_text("txtOrderCode", formControls);
    txtOrderCode.setBindingData(dboFW_CODE.dataTable, "ORDER_CODE");

    txtCode = new entlogic_ui_text("txtCode", formControls);
    txtCode.setBindingData(dboFW_CODE.dataTable, "CODE");

    txtCodeName = new entlogic_ui_text("txtCodeName", formControls);
    txtCodeName.setBindingData(dboFW_CODE.dataTable, "CODE_NAME");

    txtDescription = new entlogic_ui_textarea("txtDescription", formControls);
    txtDescription.setBindingData(dboFW_CODE.dataTable, "DESCRIPTION");
   
    $("#btnSave").click(btnSave_click);
};

// 加载编码数据
function loadCode() {
    // 查询获取数据
	if (codeOid == null) {
        var dr = dboFW_CODE.execCreate();
        dr.setItem("CODE", "新编码");
        dr.setItem("CODE_NAME", "新编码");
        dboFW_CODE.dataTable.addRecord(dr);
        dboFW_CODE.dataTable.setSelectedIndex(0);
        dboFW_CODE.dataTable.synchronizeLayout();
	} else {
		dboFW_CODE.whereClause = "where OID = '" + codeOid + "'";
		dboFW_CODE.execQuery();
      	var dr = dboFW_CODE.dataTable.getRecord(0);
        codeTypeOid = dr.getValue("CODE_TYPE_OID");
   }
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
    initKeys();
	initComponents();
	
    // 接受传递参数
    codeTypeOid = getUrlParam("codeTypeOid");
    codeOid = getUrlParam("codeOid");
   
	// 用户定义初始化
	loadCode();
};

// 保存按钮单击事件响应
function btnSave_click() {
    var oid = codeTypeOid + "_" + txtCode.getValue();
    var dr = dboFW_CODE.dataTable.getRecord(0);
	dr.setItem("OID", oid);
    
	if (codeOid == null) { 
        if (dboFW_CODE.getByOid(oid) != null) {
            alert("编码冲突！！");
            return;
        }
		dr.setItem("CODE_TYPE_OID", codeTypeOid);
		dboFW_CODE.execInsert();
	} else {
		dboFW_CODE.execUpdate();
	}
	codeOid = oid;
	CodeEditDialog_close(codeOid);
    closeDialog();
};

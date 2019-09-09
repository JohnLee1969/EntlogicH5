/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 应用的根目录
var applicationRoot = getUrlParam("applicationRoot");

//应用的根目录
var sessionId = getUrlParam("sessionId");

//本页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    
var dboFW_CODE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明  
var lblTitle = null;
var lstCode = null;

var ok = false;


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
    lblTitle = new entlogic_mui_output("lblTitle", formControls);
    
    lstCode = new entlogic_mui_list("lstCode", formControls);
    lstCode.setBindingData(dboFW_CODE.dataTable);
    
    $("#btnExit").click(btnExit_click);
    $("#btnOk").click(btnOk_click);
};

// 加载数据
function loadCode() {
    dboFW_CODE.whereClause = "where CODE_TYPE_OID = '" + codeTypeOid + "'";
    dboFW_CODE.orderByClause= "order by ORDER_CODE";
    dboFW_CODE.execQuery();
    $(".ok").click(btnOk_click);
    if(codeOid !== null)
    {
    	var dba = new entlogic_dba("jdbc/entlogic");

     	dba.SQL = "select OID from FW_CODE where CODE_TYPE_OID = '"+codeTypeOid+"' and CODE = '" +codeOid+ "'";
     	var dtCode = dba.execQuery();
     	if(dtCode.getSize()>0)
        {
     		lstCode.setValue(dtCode.getRecord(0).getValue("OID"));
        }
        
    }
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
    
    // 接收参数
    title = getUrlParam("title");
    codeTypeOid = getUrlParam("codeTypeOid");
    codeOid = getUrlParam("codeOid");
    
    lblTitle.setValue(title);
	
	// 用户定义初始化
	loadCode();
};

// 返回按钮单击事件
function btnExit_click() {
    parent.closeMobLookup();
};

// 确定按钮点击事件
function btnOk_click() {
    var dr = dboFW_CODE.dataTable.getRecord(lstCode.getSelectedIndex());
        var value = dr.getValue("CODE");
        var text = dr.getValue("CODE_NAME");
        parent.lookupCallBack(value, text);
        parent.closeMobLookup();
};



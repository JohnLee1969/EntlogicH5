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
var dboHS_CODE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明  
var lblTitle = null;
var lstCode = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var codeTypeOid = null;
var codeOid = null;

var lastIndex = -1;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	dboHS_CODE = new entlogic_dbo("HSBOSS", "HS_CODE");
    
	// 初始化交互组件
    lblTitle = new entlogic_mui_output("lblTitle", formControls);
    
    lstCode = new entlogic_mui_list("lstCode", formControls);
    lstCode.setBindingData(dboHS_CODE.dataTable);
    lstCode.itemClick = lstCode_itemClick;
    
    $("#btnExit").click(btnExit_click);
    $("#btnOk").click(btnOk_click);
};

// 加载数据
function loadCode() {
    dboHS_CODE.whereClause = "where HS_CODE_TYPE = '" + codeTypeOid + "'";
    dboHS_CODE.orderByClause= "order by ORDER_CODE";
    dboHS_CODE.execQuery();
    if(lstCode.getSize()>0)
    {
        if(codeOid !== null)
        {
        	var dba = new entlogic_dba("jdbc/entlogic");

         	dba.SQL = "select OID from HS_CODE where HS_CODE_TYPE = '"+codeTypeOid+"' and CODE = '" +codeOid+ "'";
         	var dtCode = dba.execQuery();
         	if(dtCode.getSize()>0)
            {
         		lstCode.setValue(dtCode.getRecord(0).getValue("OID"));
                lastIndex = lstCode.getSelectedIndex();
                
        		$("#lstCode_r" + lastIndex + " button").show();
            }
            
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
    closeMobLookup();
    closeDialog();
};

// 确定按钮点击事件
function btnOk_click() {
    var dr = dboHS_CODE.dataTable.getRecord(lstCode.getSelectedIndex());
        var value = dr.getValue("CODE");
        var text = dr.getValue("CODE_NAME");
        lookupCallBack(value, text);
        dialogCallBack(value, text);
        closeMobLookup();
        closeDialog();
};

// 列表选中事件
function lstCode_itemClick() {
    if(lastIndex >= 0)
    {
        $("#lstCode_r" + lastIndex + " button").hide();
    }
    lastIndex = lstCode.getSelectedIndex();
    if(lastIndex >= 0)
    {
        $("#lstCode_r" + lastIndex + " button").show();
    }
};



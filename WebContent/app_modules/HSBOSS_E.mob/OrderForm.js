/////////////////////////////////////////////////////////////////////////////////////////////////

// 应用的根目录
var applicationRoot = getUrlParam("applicationRoot");

//应用的根目录
var sessionId = getUrlParam("sessionId");

//本页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    
var dboHS_CODE = null;
var dtOrder = null;
var dtOrder2 = null;
var dtOrder3 = null;
var dtOrder4 = null;
var dtOrder5 = null;



/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lstOrderStatus = null;
var lstOrder = null;
var lstOrder2 = null;
var lstOrder3 = null;
var lstOrder4 = null;
var lstOrder5 = null;



/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明



/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	dboHS_CODE = new entlogic_dbo("HSBOSS", "HS_CODE");
    
    dtOrder = new entlogic_data_table();
    dtOrder2 = new entlogic_data_table();
    dtOrder3 = new entlogic_data_table();
    dtOrder4 = new entlogic_data_table();
    dtOrder5 = new entlogic_data_table();
	
	// 初始化交互组件   
    lstOrderStatus = new entlogic_mui_list("lstOrderStatus", formControls);
    lstOrderStatus.setBindingData(dboHS_CODE.dataTable);
    lstOrderStatus.itemClick = lstOrderStatus_itemClick;
    
    lstOrder = new entlogic_mui_list("lstOrder", formControls);
    lstOrder.setBindingData(dtOrder);
    lstOrder.itemClick = lstOrder_itemClick;
    
    lstOrder2 = new entlogic_mui_list("lstOrder2", formControls);
    lstOrder2.setBindingData(dtOrder2);
    lstOrder2.itemClick = lstOrder2_itemClick;
    
    lstOrder3 = new entlogic_mui_list("lstOrder3", formControls);
    lstOrder3.setBindingData(dtOrder3);
    lstOrder3.itemClick = lstOrder3_itemClick;
    
    lstOrder4 = new entlogic_mui_list("lstOrder4", formControls);
    lstOrder4.setBindingData(dtOrder4);
    lstOrder4.itemClick = lstOrder4_itemClick;
    
    lstOrder5 = new entlogic_mui_list("lstOrder5", formControls);
    lstOrder5.setBindingData(dtOrder5);
    lstOrder5.itemClick = lstOrder5_itemClick;
    
    $("#tagMain").click(tagMain_click);
    $("#tagWorker").click(tagWorker_click);
    $("#tagCustomer").click(tagCustomer_click);
};

// 加载订单状态列表数据
function loadOrderStatus() {
	dboHS_CODE.whereClause = "where HS_CODE_TYPE = 'ODR_STA'";
	dboHS_CODE.orderByClause = " order by ORDER_CODE";
	dboHS_CODE.execQuery();
};

// 根据订单状态加载订单列表数据
function loadOrder() {
    
    dtOrder.clear();
    var dba = new entlogic_dba("jdbc/entlogic");
    var sql = "select HS_ORDER.OID as id";
    sql += ",'0' as lv";
    sql += ",HS_BILL.SUBJECT";
    sql += ",dbo.hsGetServiceName(HS_SERVICE) as HS_SERVICE_NAME";
    sql += ",dbo.hsGetCustomerName(HS_CUTOMER) as HS_CUTOMER_NAME";
    sql += ",CONVERT(varchar(100), START_TIME_P, 20) as START_TIME_PSTR";
    sql += " from HS_ORDER";
    sql += " inner join HS_BILL on HS_BILL.HS_ORDER = HS_ORDER.OID";
    sql += " where HS_ORDER.STATUS = '#status#'";
    sql += " order by HS_ORDER.ORDER_TIME desc";
    dba.SQL = sql;
   
    dba.setParameter("status", lstOrderStatus.getValue());
    
    dtOrder.loadXML(dba.execQuery().toXML());
    dtOrder.synchronizeLayout();
	
    if (lstOrder.getSize() > 0) {
    	$("#btnDispatch").click(btnDispatch_click);
    }
};

// 根据订单状态加载订单列表数据
function loadOrder2() {
    dtOrder2.clear();
    var dba = new entlogic_dba("jdbc/entlogic");
    var sql = "select HS_ORDER.OID as id";
    sql += ",'0' as lv";
    sql += ",HS_BILL.SUBJECT";
    sql += ",dbo.hsGetServiceName(HS_SERVICE) as HS_SERVICE_NAME";
    sql += ",ACCEPTOR_NAME";
    sql += ",SERVICE_ADDRESS";
    sql += ",CONVERT(varchar(100), START_TIME_P, 20) as START_TIME_PSTR";
    sql += " from HS_ORDER";
    sql += " inner join HS_BILL on HS_BILL.HS_ORDER = HS_ORDER.OID";
    sql += " where HS_ORDER.STATUS = '#status#'";
    sql += " order by HS_ORDER.ORDER_TIME desc";
    dba.SQL = sql;
   
    dba.setParameter("status", lstOrderStatus.getValue());
    
    dtOrder2.loadXML(dba.execQuery().toXML());
    dtOrder2.synchronizeLayout();
	
    if (lstOrder2.getSize() > 0) {
    	$("#btnCall").click(btnCall_click);
    }
};

// 根据订单状态加载订单列表数据
function loadOrder3() {
    
    dtOrder3.clear();
    var dba = new entlogic_dba("jdbc/entlogic");
    var sql = "select HS_ORDER.OID as id";
    sql += ",'0' as lv";
    sql += ",HS_BILL.SUBJECT";
    sql += ",dbo.hsGetServiceName(HS_SERVICE) as HS_SERVICE_NAME";
    sql += ",dbo.hsGetCustomerName(HS_CUTOMER) as HS_CUTOMER_NAME";
    sql += ",CONVERT(varchar(100), START_TIME_P, 20) as START_TIME_PSTR";
    sql += " from HS_ORDER";
    sql += " inner join HS_BILL on HS_BILL.HS_ORDER = HS_ORDER.OID";
    sql += " where HS_ORDER.STATUS = '#status#'";
    sql += " order by HS_ORDER.ORDER_TIME desc";
    dba.SQL = sql;
   
    dba.setParameter("status", lstOrderStatus.getValue());
    
    dtOrder3.loadXML(dba.execQuery().toXML());
    dtOrder3.synchronizeLayout();
	
};

// 根据订单状态加载订单列表数据
function loadOrder4() {
    dtOrder4.clear();
    var dba = new entlogic_dba("jdbc/entlogic");
    var sql = "select HS_ORDER.OID as id";
    sql += ",'0' as lv";
    sql += ",HS_BILL.SUBJECT";
    sql += ",dbo.hsGetServiceName(HS_SERVICE) as HS_SERVICE_NAME";
    sql += ",ACCEPTOR_NAME";
    sql += ",HEAD_PIC";
    sql += ",SERVICE_ADDRESS";
    sql += ",CONVERT(varchar(100), START_TIME_P, 20) as START_TIME_PSTR";
    sql += " from HS_ORDER";
    sql += " inner join HS_BILL on HS_BILL.HS_ORDER = HS_ORDER.OID";
    sql += " inner join HS_WORKER on HS_ORDER.ACCEPTOR_NUM = HS_WORKER.OID";
    sql += " where HS_ORDER.STATUS = '#status#'";
    sql += " order by HS_ORDER.ORDER_TIME desc";
    dba.SQL = sql;
   
    dba.setParameter("status", lstOrderStatus.getValue());
    
    dtOrder4.loadXML(dba.execQuery().toXML());
    dtOrder4.synchronizeLayout();
	
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化
	loadOrderStatus();
	loadOrder();
};

// 工作台单击事件响应
function tagMain_click() {
	jumpTo("MainForm.html");
	return;
};

// 阿姨单击事件响应
function tagWorker_click() {
	jumpTo("WorkerForm.html");
	return;
};

// 客户单击事件响应
function tagCustomer_click() {
	jumpTo("CustomerForm.html");
	return;
};

// 派单点击事件
function btnDispatch_click()
{
	lstOrder.itemClickTrigger = "btnDispatch";
}

// 电话点击事件
function btnCall_click()
{
	lstOrder2.itemClickTrigger = "btnCall";
}

// 根据订单状态刷新列表数据
function lstOrderStatus_itemClick()
{
    var index = lstOrderStatus.getSelectedIndex();
    if(index === 0)
    {
        $("#lstOrder").show();
        $("#lstOrder2").hide();
        $("#lstOrder3").hide();
        $("#lstOrder4").hide();
        loadOrder();
    }
	else if(index === 1)
    {
        $("#lstOrder2").show();
        $("#lstOrder").hide();
        $("#lstOrder3").hide();
        $("#lstOrder4").hide();
        loadOrder2();
    }
	else if(index === 2)
    {
        $("#lstOrder3").show();
        $("#lstOrder").hide();
        $("#lstOrder2").hide();
        $("#lstOrder4").hide();
        loadOrder3();
    }
	else if(index === 3)
    {
        $("#lstOrder4").show();
        $("#lstOrder").hide();
        $("#lstOrder2").hide();
        $("#lstOrder3").hide();
        loadOrder4();
    }
}

function lstOrder_itemClick()
{
    var orderOid = lstOrder.getValue();
    if(lstOrder.itemClickTrigger === "btnDispatch")
    {
        var url = encodeURI("OrderDispatchForm.html?orderOid=" + orderOid);
    	jumpTo(url);
    }
    else
    {
		//loadOrder();
    }
    lstOrder.itemClickTrigger = "";
}

function lstOrder2_itemClick()
{
    var orderOid = lstOrder2.getValue();
    if(lstOrder2.itemClickTrigger === "btnCall")
    {
        lstOrder2.itemClickTrigger = "";
    }
    else
    {
		//loadOrder();
    }
}

function lstOrder3_itemClick()
{
    var orderOid = lstOrder2.getValue();
    if(lstOrder2.itemClickTrigger === "btnCall")
    {
        lstOrder2.itemClickTrigger = "";
    }
    else
    {
		//loadOrder();
    }
}

function lstOrder4_itemClick()
{
    var orderOid = lstOrder2.getValue();
    if(lstOrder2.itemClickTrigger === "btnCall")
    {
        lstOrder2.itemClickTrigger = "";
    }
    else
    {
		//loadOrder();
    }
}

function lstOrder5_itemClick()
{
    var orderOid = lstOrder2.getValue();
    if(lstOrder2.itemClickTrigger === "btnCall")
    {
        lstOrder2.itemClickTrigger = "";
    }
    else
    {
		//loadOrder();
    }
}

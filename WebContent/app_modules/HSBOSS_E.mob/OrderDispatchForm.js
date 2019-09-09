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
var dboHS_ORDER = null;
var dboHS_CUSTOMER = null;
var dboHS_WORKER = null;
var dboSeclectedWorker = null;
var dboHS_BILL = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   

var lblName = null;
var lblPhone = null;
var lblServiceName = null;
var lblPackages = null;
var lblAppointTime = null;
var lblAddress = null;
var lblCost = null;

var lstWorker = null;
var lstSeclectedWorker = null;

/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var orderOid = null;

/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_ORDER = new entlogic_dbo("HSBOSS", "HS_ORDER");
    dboHS_CUSTOMER = new entlogic_dbo("HSBOSS", "HS_CUSTOMER");
	dboSeclectedWorker = new entlogic_dbo("HSBOSS", "HS_WORKER");
	dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
	dboHS_BILL = new entlogic_dbo("HSBOSS", "HS_BILL");
    
	// 初始化交互组件
    lblName = new entlogic_mui_output("lblName", formControls);
    lblName.setBindingData(dboHS_CUSTOMER.dataTable, "NAME");
    
    lblPhone = new entlogic_mui_output("lblPhone", formControls);
    lblPhone.setBindingData(dboHS_CUSTOMER.dataTable, "WORKPLACE_PHONE");
    
    lblServiceName = new entlogic_mui_output("lblServiceName", formControls);
    lblServiceName.setBindingData(dboHS_ORDER.dataTable, "HS_SERVICE_NAME");
    
    lblPackages = new entlogic_mui_output("lblPackages", formControls);
    lblPackages.setBindingData(dboHS_BILL.dataTable, "SUBJECT");
    
    lblAppointTime = new entlogic_mui_output("lblAppointTime", formControls);
    //lblAppointTime.setBindingData(dboHS_WORKER.dataTable, "NAME");
    
    lblAddress = new entlogic_mui_output("lblAddress", formControls);
    lblAddress.setBindingData(dboHS_CUSTOMER.dataTable, "WORKPLACE_ADDRESS");
    
    lblCost = new entlogic_mui_output("lblCost", formControls);
    lblCost.setBindingData(dboHS_BILL.dataTable, "SUM");
    
    lstSeclectedWorker = new entlogic_mui_list("lstSeclectedWorker", formControls);
    lstSeclectedWorker.setBindingData(dboSeclectedWorker.dataTable);
    
    lstWorker = new entlogic_mui_list("lstWorker", formControls);
    lstWorker.setBindingData(dboHS_WORKER.dataTable);
    lstWorker.itemClick = lstWorker_itemClick;
    lstWorker.itemCssNormal = "listWoker-item-normal";
    lstWorker.itemCssSelected = "listWoker-item-selected";
    
    $("#btnBack").click(btnBack_click);
    $("#btnDispatch").click(btnDispatch_click);
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 返回按钮点击事件
function btnBack_click() {
    jumpTo("OrderForm.html");
};

function btnDispatch_click() {
    var drWorker =  dboSeclectedWorker.dataTable.getRecord(lstSeclectedWorker.getSelectedIndex());    

    var dba = new entlogic_dba("jdbc/entlogic");
   var transactionId = dba.transactionBegin();
    
   // 删除该类型所有编码项
   var sql = "update HS_ORDER set ACCEPTOR_NUM = '#acceptorNum#'";
   sql += ",ACCEPTOR_NAME = '#acceptorName#'";
   sql += ",ACCEPTOR_TEL = '#acceptorTel#'";
   sql += ",DISPATCH_TIME = '#dispatchTime#'";
   sql += ",STATUS = '#status#'";
   sql += " where OID = '#id#'";
   dba.SQL = sql;
   
   dba.setParameter("acceptorNum", drWorker.getValue("OID"));
   dba.setParameter("acceptorName", drWorker.getValue("NAME"));
   dba.setParameter("acceptorTel", drWorker.getValue("MOBILE"));
    
   dba.setParameter("dispatchTime", formatDateTime(new Date()));
   dba.setParameter("status", 'ODR_STA_1');
   dba.setParameter("id", orderOid);
   dba.execUpdate(transactionId);
   dba.transactionCommit(transactionId);
    
    jumpTo("OrderForm.html");
};

function formatDateTime(date) {  
    var y = date.getFullYear();  
    var m = date.getMonth() + 1;  
    m = m < 10 ? ('0' + m) : m;  
    var d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    var h = date.getHours();  
    var minute = date.getMinutes();  
    minute = minute < 10 ? ('0' + minute) : minute;  
    var second = date.getSeconds();  
    second = second < 10 ? ('0' + second) : second;  
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;  
};  

// 阿姨列表项点击事件
function lstWorker_itemClick() {
    var workerOid = lstWorker.getValue();
    loadWorker(lstWorker.getValue());
};
// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化
	// 接收传递参数
	orderOid = getUrlParam("orderOid");
    loadOrder();
    loadWorkers();
    loadBill();
};

//加载订单数据
function loadOrder() {
    // 查询获取数据
	dboHS_ORDER.whereClause = "where OID = '" + orderOid + "'";
	dboHS_ORDER.execQuery();
    var dt = dboHS_ORDER.dataTable;
    if(dt.getSize()>0)
    {
        var drOrder = dt.getRecord(0);
        loadWorker(drOrder.getValue("ACCEPTOR_NUM"));
        loadCustomer(drOrder.getValue("HS_CUTOMER"));
    }
};

//加载客户数据
function loadCustomer(customerOid) {
    // 查询获取数据
     dboHS_CUSTOMER.whereClause = "where OID = '" + customerOid + "'";
     dboHS_CUSTOMER.execQuery();
};

//加载工作人员数据
function loadWorker(workerOid) {
    // 查询获取数据
    dboSeclectedWorker.whereClause = "where OID = '" + workerOid + "'";
    dboSeclectedWorker.execQuery();
};

//加载工作人员列表数据
function loadWorkers() {
    // 查询获取数据
    dboHS_WORKER.whereClause = "";
    dboHS_WORKER.execQuery();
};

//加载客户数据
function loadBill() {
    // 查询获取数据
	dboHS_BILL.whereClause = "where HS_ORDER = '" + orderOid + "'";
	dboHS_BILL.execQuery();
};

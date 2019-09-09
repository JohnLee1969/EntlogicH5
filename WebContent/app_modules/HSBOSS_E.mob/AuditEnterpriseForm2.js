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
var dbaContract00  = null;
var dtContract00 = null;

var dbaContract01  = null;
var dtContract01 = null;

var dbaContract02  = null;
var dtContract02 = null;

var dbaContract03  = null;
var dtContract03 = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lstContract00 = null;
var lstContract01 = null;
var lstContract02 = null;
var lstContract03 = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var enterpriseOid = null;
var lstContract00_op = "";
var lstContract01_op = "";
var lstContract02_op = "";
var lstContract03_op = "";


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    
    var SQL = ""
    SQL += "select";
    SQL += "	HS_PROVIDE_CONTRACT.OID as id, ";
    SQL += "	HS_PROVIDE_CONTRACT.PLATFORM_COMM as PLATFORM_COMM, ";
    SQL += "	HS_PROVIDE_CONTRACT.ENTERPRISE_COMM as ENTERPRISE_COMM, ";
    SQL += "	HS_SERVICE.ANOTHER_NAMER as SERVICE_NAME, ";
    SQL += "	HS_SERVICE_RATE.RATE as SERVICE_RATE ";
 	SQL += "from ";
    SQL += "	HS_PROVIDE_CONTRACT, ";
    SQL += "	HS_SERVICE, ";
    SQL += "	HS_SERVICE_RATE ";
    SQL += "where";
    SQL += "	HS_SERVICE.OID = HS_PROVIDE_CONTRACT.HS_SERVICE and ";
    SQL += "	HS_SERVICE_RATE.HS_SERVICE = HS_SERVICE.OID and ";
    SQL += "	HS_PROVIDE_CONTRACT.HS_ENTERPRISE = '#ENTERPRISE_OID#'and ";
    SQL += "	HS_SERVICE.SERVICE_TYPE = '#SERVICE_TYPE#'";
    
    dbaContract00 = new entlogic_dba("jdbc/entlogic");
    dbaContract00.SQL = SQL;
    
    dbaContract01 = new entlogic_dba("jdbc/entlogic");
    dbaContract01.SQL = SQL;
    
    dbaContract02 = new entlogic_dba("jdbc/entlogic");
    dbaContract02.SQL = SQL;
    
    dbaContract03 = new entlogic_dba("jdbc/entlogic");
    dbaContract03.SQL = SQL;

	
	// 初始化交互组件
    lstContract00 = new entlogic_mui_list("lstContract00", formControls);
    lstContract00.itemClick = lstContract00_itemClick;
    
    lstContract01 = new entlogic_mui_list("lstContract01", formControls);
    lstContract01.itemClick = lstContract01_itemClick;
    
    lstContract02 = new entlogic_mui_list("lstContract02", formControls);
    lstContract02.itemClick = lstContract02_itemClick;
    
    lstContract03 = new entlogic_mui_list("lstContract03", formControls);
    lstContract03.itemClick = lstContract03_itemClick;
    
    
    $("#btnBack").click(btnBack_click);
    $("#btnNext").click(btnNext_click);
    
    $("#btnAddService00").click(btnAddService00_click);
    $("#btnAddService01").click(btnAddService01_click);
    $("#btnAddService02").click(btnAddService02_click);
    $("#btnAddService03").click(btnAddService03_click);
};

// 加载保00合同
function loadContract00() {
    dbaContract00.setParameter("ENTERPRISE_OID", enterpriseOid);
    dbaContract00.setParameter("SERVICE_TYPE", "00");
    dtContract00 = dbaContract00.execQuery();
    lstContract00.setBindingData(dtContract00);
    $(".btnDeleteService00").click(function () {lstContract00_op = "delete";});
    $(".btnIncreaseEC00").click(function () {lstContract00_op = "increaseEC";});
    $(".btnDecreaseEC00").click(function () {lstContract00_op = "decreaseEC";});
    $(".btnIncreasePC00").click(function () {lstContract00_op = "increasePC";});
    $(".btnDecreasePC00").click(function () {lstContract00_op = "decreasePC";});  
    $("#tagEC00").click(function () {lstContract00_op = "editEC";});
    $("#tagPC00").click(function () {lstContract00_op = "editPC";});  
};

// 加载01类合同
function loadContract01() {
    dbaContract01.setParameter("ENTERPRISE_OID", enterpriseOid);
    dbaContract01.setParameter("SERVICE_TYPE", "01");
    dtContract01 = dbaContract01.execQuery();
    lstContract01.setBindingData(dtContract01);
    $(".btnDeleteService01").click(function () {lstContract01_op = "delete";});
    $(".btnIncreaseEC01").click(function () {lstContract01_op = "increaseEC";});
    $(".btnDecreaseEC01").click(function () {lstContract01_op = "decreaseEC";});
    $(".btnIncreasePC01").click(function () {lstContract01_op = "increasePC";});
    $(".btnDecreasePC01").click(function () {lstContract01_op = "decreasePC";}); 
    $("#tagEC01").click(function () {lstContract01_op = "editEC";});
    $("#tagPC01").click(function () {lstContract01_op = "editPC";});    
};

// 加载02类合同
function loadContract02() {
    dbaContract02.setParameter("ENTERPRISE_OID", enterpriseOid);
    dbaContract02.setParameter("SERVICE_TYPE", "02");
    dtContract02 = dbaContract02.execQuery();
    lstContract02.setBindingData(dtContract02);
    $(".btnDeleteService02").click(function () {lstContract02_op = "delete";});
    $(".btnIncreaseEC02").click(function () {lstContract02_op = "increaseEC";});
    $(".btnDecreaseEC02").click(function () {lstContract02_op = "decreaseEC";});
    $(".btnIncreasePC02").click(function () {lstContract02_op = "increasePC";});
    $(".btnDecreasePC02").click(function () {lstContract02_op = "decreasePC";});  
    $("#tagEC02").click(function () {lstContract02_op = "editEC";});
    $("#tagPC02").click(function () {lstContract02_op = "editPC";});   
};

// 加载03类合同
function loadContract03() {
    dbaContract03.setParameter("ENTERPRISE_OID", enterpriseOid);
    dbaContract03.setParameter("SERVICE_TYPE", "03");
    dtContract03 = dbaContract03.execQuery();
    lstContract03.setBindingData(dtContract03);
    $(".btnDeleteService03").click(function () {lstContract03_op = "delete";});
    $(".btnIncreaseEC03").click(function () {lstContract03_op = "increaseEC";});
    $(".btnDecreaseEC03").click(function () {lstContract03_op = "decreaseEC";});
    $(".btnIncreasePC03").click(function () {lstContract03_op = "increasePC";});
    $(".btnDecreasePC03").click(function () {lstContract03_op = "decreasePC";}); 
    $("#tagEC03").click(function () {lstContract03_op = "editEC";});
    $("#tagPC03").click(function () {lstContract03_op = "editPC";});    
};

// 数据检查（查重）
function checkData(serviceOid) {
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "select OID from HS_PROVIDE_CONTRACT where HS_ENTERPRISE='" + enterpriseOid + "' and HS_SERVICE='" + serviceOid + "'";
    var dt = dba.execQuery();
    if (dt != null && dt.getSize() > 0) return false;
    return true;
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化
	enterpriseOid = getUrlParam("enterpriseOid");
    loadContract00();
    loadContract01();
    loadContract02();
    loadContract03();
};

// 提交按钮单击事件
function btnBack_click() {
    var url = encodeURI("AuditEnterpriseForm1.html?enterpriseOid=" + enterpriseOid);
    jumpTo(url);    
};

// 下一步按钮单击事件
function btnNext_click() {
    // 检查跳转调价
    var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    dboHS_PROVIDE_CONTRACT.whereClause = "where HS_ENTERPRISE = '" + enterpriseOid + "'";
    if (dboHS_PROVIDE_CONTRACT.count() == 0) {
        popUpMobError("错误提示", "你必须开通至少一项服务，才能继续注册进程！！");
        return;
    };
    
    // 设置状态
    var dboHS_ENTERPRISE = new entlogic_dbo("HSBOSS", "HS_ENTERPRISE");
    var drEnterprise = dboHS_ENTERPRISE.getByOid(enterpriseOid);
    drEnterprise.setItem("STATUS", "3");
    dboHS_ENTERPRISE.execUpdate(drEnterprise);
    
    // 跳转到下一步页面
    var url = encodeURI("AuditEnterpriseForm3.html?enterpriseOid=" + enterpriseOid);
    jumpTo(url);
};

// 00服务列表项点击操作
function lstContract00_itemClick() {
    var dr00 = dtContract00.getRecord(lstContract00.getSelectedIndex());
    var rate = dr00.getValue("SERVICE_RATE");
    var step = 100;
    if (rate < 10000) step = step / 10;
    if (rate < 1000) step = step / 10;
        
    var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    var dr = dboHS_PROVIDE_CONTRACT.getByOid(lstContract00.getValue());
    dboHS_PROVIDE_CONTRACT.dataTable.addRecord(dr);
    dboHS_PROVIDE_CONTRACT.dataTable.setSelectedIndex(0);
    
    
    if (lstContract00_op == "delete") {
        dboHS_PROVIDE_CONTRACT.execDelete();
    } else if (lstContract00_op == "increaseEC") {
        var n = parseFloat(dr.getValue("ENTERPRISE_COMM"));
        n += step;
        dr.setItem("ENTERPRISE_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract00_op == "decreaseEC") {
        var n =  parseFloat(dr.getValue("ENTERPRISE_COMM"));
        n -= step;
        dr.setItem("ENTERPRISE_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract00_op == "increasePC") {
        var n =  parseFloat(dr.getValue("PLATFORM_COMM"));
        n += step;
        dr.setItem("PLATFORM_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract00_op == "decreasePC") {
        var n =  parseFloat(dr.getValue("PLATFORM_COMM"));
        n -= step;
        dr.setItem("PLATFORM_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract00_op == "editEC") {
        var url = encodeURI("CommissionDialog.html?commission="+dr.getValue("ENTERPRISE_COMM"));
    	popUpDialog(url, 360, 150, "企业获得佣金", ContractEC00_close);
        return ;
    } else if (lstContract00_op == "editPC") {
        var url = encodeURI("CommissionDialog.html?commission="+dr.getValue("PLATFORM_COMM"));
    	popUpDialog(url, 360, 150, "平台获得佣金", ContractPC00_close);
        return ;
    }
    loadContract00();
    lstContract00_op = "";
};

// 添加00服务产品
function btnAddService00_click() {
    popUpSubForm("ServiceLookup.html?serviceType=00", ServiceLookup00_close);
};

// 添加00服务产品返回
function ServiceLookup00_close(value, text) {
    var serviceOid = value;
    if (checkData(serviceOid)) {
        var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
        var drNew = dboHS_PROVIDE_CONTRACT.execCreate();
        drNew.setItem("OID", drNew.getValue("id"));
        drNew.setItem("HS_ENTERPRISE", enterpriseOid);
        drNew.setItem("HS_SERVICE", serviceOid);
        dboHS_PROVIDE_CONTRACT.execInsert(drNew);
        loadContract00();
    } else 
    {
       popUpMobError("错误提示", "该产品已经开通过！！");
    }
};


// 01服务列表项点击操作
function lstContract01_itemClick() {
    var dr01 = dtContract01.getRecord(lstContract01.getSelectedIndex());
    var rate = dr01.getValue("SERVICE_RATE");
    var step = 100;
    if (rate < 10000) step = step / 10;
    if (rate < 1000) step = step / 10;
        
    var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    var dr = dboHS_PROVIDE_CONTRACT.getByOid(lstContract01.getValue());
    dboHS_PROVIDE_CONTRACT.dataTable.addRecord(dr);
    dboHS_PROVIDE_CONTRACT.dataTable.setSelectedIndex(0);
    
    
    if (lstContract01_op == "delete") {
        dboHS_PROVIDE_CONTRACT.execDelete();
    } else if (lstContract01_op == "increaseEC") {
        var n = parseFloat(dr.getValue("ENTERPRISE_COMM"));
        n += step;
        dr.setItem("ENTERPRISE_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract01_op == "decreaseEC") {
        var n =  parseFloat(dr.getValue("ENTERPRISE_COMM"));
        n -= step;
        dr.setItem("ENTERPRISE_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract01_op == "increasePC") {
        var n =  parseFloat(dr.getValue("PLATFORM_COMM"));
        n += step;
        dr.setItem("PLATFORM_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract01_op == "decreasePC") {
        var n =  parseFloat(dr.getValue("PLATFORM_COMM"));
        n -= step;
        dr.setItem("PLATFORM_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract01_op == "editEC") {
        var url = encodeURI("CommissionDialog.html?commission="+dr.getValue("ENTERPRISE_COMM"));
    	popUpDialog(url, 360, 150, "企业获得佣金", ContractEC01_close);
        return ;
    } else if (lstContract01_op == "editPC") {
        var url = encodeURI("CommissionDialog.html?commission="+dr.getValue("PLATFORM_COMM"));
    	popUpDialog(url, 360, 150, "平台获得佣金", ContractPC01_close);
        return ;
    }
    loadContract01();
    lstContract01_op = "";
};

// 添加01服务产品
function btnAddService01_click() {
    popUpSubForm("ServiceLookup.html?serviceType=01", ServiceLookup01_close);
};

// 添加01服务产品返回
function ServiceLookup01_close(value, text) {
    var serviceOid = value;
    if (checkData(serviceOid)) {
        var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
        var drNew = dboHS_PROVIDE_CONTRACT.execCreate();
        drNew.setItem("OID", drNew.getValue("id"));
        drNew.setItem("HS_ENTERPRISE", enterpriseOid);
        drNew.setItem("HS_SERVICE", serviceOid);
        dboHS_PROVIDE_CONTRACT.execInsert(drNew);
        loadContract01();
    } else 
    {
       popUpMobError("错误提示", "该产品已经开通过！！");
    }
};


// 02服务列表项点击操作
function lstContract02_itemClick() {
    var dr02 = dtContract02.getRecord(lstContract02.getSelectedIndex());
    var rate = dr02.getValue("SERVICE_RATE");
    var step = 100;
    if (rate < 10000) step = step / 10;
    if (rate < 1000) step = step / 10;
        
    var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    var dr = dboHS_PROVIDE_CONTRACT.getByOid(lstContract02.getValue());
    dboHS_PROVIDE_CONTRACT.dataTable.addRecord(dr);
    dboHS_PROVIDE_CONTRACT.dataTable.setSelectedIndex(0);
    
    
    if (lstContract02_op == "delete") {
        dboHS_PROVIDE_CONTRACT.execDelete();
    } else if (lstContract02_op == "increaseEC") {
        var n = parseFloat(dr.getValue("ENTERPRISE_COMM"));
        n += step;
        dr.setItem("ENTERPRISE_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract02_op == "decreaseEC") {
        var n =  parseFloat(dr.getValue("ENTERPRISE_COMM"));
        n -= step;
        dr.setItem("ENTERPRISE_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract02_op == "increasePC") {
        var n =  parseFloat(dr.getValue("PLATFORM_COMM"));
        n += step;
        dr.setItem("PLATFORM_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract02_op == "decreasePC") {
        var n =  parseFloat(dr.getValue("PLATFORM_COMM"));
        n -= step;
        dr.setItem("PLATFORM_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract02_op == "editEC") {
        var url = encodeURI("CommissionDialog.html?commission="+dr.getValue("ENTERPRISE_COMM"));
    	popUpDialog(url, 360, 150, "企业获得佣金", ContractEC02_close);
        return ;
    } else if (lstContract02_op == "editPC") {
        var url = encodeURI("CommissionDialog.html?commission="+dr.getValue("PLATFORM_COMM"));
    	popUpDialog(url, 360, 150, "平台获得佣金", ContractPC02_close);
        return ;
    }
    loadContract02();
    lstContract02_op = "";
};

// 添加02服务产品
function btnAddService02_click() {
    popUpSubForm("ServiceLookup.html?serviceType=02", ServiceLookup02_close);
};

// 添加02服务产品返回
function ServiceLookup02_close(value, text) {
    var serviceOid = value;
    if (checkData(serviceOid)) {
        var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
        var drNew = dboHS_PROVIDE_CONTRACT.execCreate();
        drNew.setItem("OID", drNew.getValue("id"));
        drNew.setItem("HS_ENTERPRISE", enterpriseOid);
        drNew.setItem("HS_SERVICE", serviceOid);
        dboHS_PROVIDE_CONTRACT.execInsert(drNew);
        loadContract02();
    } else 
    {
       popUpMobError("错误提示", "该产品已经开通过！！");
    }
};


// 03服务列表项点击操作
function lstContract03_itemClick() {
    var dr03 = dtContract03.getRecord(lstContract03.getSelectedIndex());
    var rate = dr03.getValue("SERVICE_RATE");
    var step = 100;
    if (rate < 10000) step = step / 10;
    if (rate < 1000) step = step / 10;
        
    var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    var dr = dboHS_PROVIDE_CONTRACT.getByOid(lstContract03.getValue());
    dboHS_PROVIDE_CONTRACT.dataTable.addRecord(dr);
    dboHS_PROVIDE_CONTRACT.dataTable.setSelectedIndex(0);
    
    
    if (lstContract03_op == "delete") {
        dboHS_PROVIDE_CONTRACT.execDelete();
    } else if (lstContract03_op == "increaseEC") {
        var n = parseFloat(dr.getValue("ENTERPRISE_COMM"));
        n += step;
        dr.setItem("ENTERPRISE_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract03_op == "decreaseEC") {
        var n =  parseFloat(dr.getValue("ENTERPRISE_COMM"));
        n -= step;
        dr.setItem("ENTERPRISE_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract03_op == "increasePC") {
        var n =  parseFloat(dr.getValue("PLATFORM_COMM"));
        n += step;
        dr.setItem("PLATFORM_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract03_op == "decreasePC") {
        var n =  parseFloat(dr.getValue("PLATFORM_COMM"));
        n -= step;
        dr.setItem("PLATFORM_COMM", n);
        dboHS_PROVIDE_CONTRACT.execUpdate();
    } else if (lstContract03_op == "editEC") {
        var url = encodeURI("CommissionDialog.html?commission="+dr.getValue("ENTERPRISE_COMM"));
    	popUpDialog(url, 360, 150, "企业获得佣金", ContractEC03_close);
        return ;
    } else if (lstContract03_op == "editPC") {
        var url = encodeURI("CommissionDialog.html?commission="+dr.getValue("PLATFORM_COMM"));
    	popUpDialog(url, 360, 150, "平台获得佣金", ContractPC03_close);
        return ;
    }
    loadContract03();
    lstContract03_op = "";
};

// 添加03服务产品
function btnAddService03_click() {
    popUpSubForm("ServiceLookup.html?serviceType=03", ServiceLookup03_close);
};

// 添加03服务产品返回
function ServiceLookup03_close(value, text) {
    var serviceOid = value;
    if (checkData(serviceOid)) {
        var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
        var drNew = dboHS_PROVIDE_CONTRACT.execCreate();
        drNew.setItem("OID", drNew.getValue("id"));
        drNew.setItem("HS_ENTERPRISE", enterpriseOid);
        drNew.setItem("HS_SERVICE", serviceOid);
        dboHS_PROVIDE_CONTRACT.execInsert(drNew);
        loadContract03();
    } else 
    {
       popUpMobError("错误提示", "该产品已经开通过！！");
    }
};

// 修改00服务企业获得佣金返回
function ContractEC00_close(value, text) {  
    
    var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    var dr = dboHS_PROVIDE_CONTRACT.getByOid(lstContract00.getValue());
    dboHS_PROVIDE_CONTRACT.dataTable.addRecord(dr);
    dboHS_PROVIDE_CONTRACT.dataTable.setSelectedIndex(0);
    dr.setItem("ENTERPRISE_COMM", value);
    dboHS_PROVIDE_CONTRACT.execUpdate();
    
    loadContract00();
};

// 修改00服务平台获得佣金返回
function ContractPC00_close(value, text) {        
    var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    var dr = dboHS_PROVIDE_CONTRACT.getByOid(lstContract00.getValue());
    dboHS_PROVIDE_CONTRACT.dataTable.addRecord(dr);
    dboHS_PROVIDE_CONTRACT.dataTable.setSelectedIndex(0);
    dr.setItem("PLATFORM_COMM", value);
    dboHS_PROVIDE_CONTRACT.execUpdate();
    
    loadContract00();
};

// 修改01服务企业获得佣金返回
function ContractEC01_close(value, text) {        
    var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    var dr = dboHS_PROVIDE_CONTRACT.getByOid(lstContract01.getValue());
    dboHS_PROVIDE_CONTRACT.dataTable.addRecord(dr);
    dboHS_PROVIDE_CONTRACT.dataTable.setSelectedIndex(0);
    dr.setItem("ENTERPRISE_COMM", value);
    dboHS_PROVIDE_CONTRACT.execUpdate();
    
    loadContract01();
};

// 修改01服务平台获得佣金返回
function ContractPC01_close(value, text) {        
    var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    var dr = dboHS_PROVIDE_CONTRACT.getByOid(lstContract01.getValue());
    dboHS_PROVIDE_CONTRACT.dataTable.addRecord(dr);
    dboHS_PROVIDE_CONTRACT.dataTable.setSelectedIndex(0);
    dr.setItem("PLATFORM_COMM", value);
    dboHS_PROVIDE_CONTRACT.execUpdate();
    
    loadContract01();
};

// 修改02服务企业获得佣金返回
function ContractEC02_close(value, text) {        
    var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    var dr = dboHS_PROVIDE_CONTRACT.getByOid(lstContract02.getValue());
    dboHS_PROVIDE_CONTRACT.dataTable.addRecord(dr);
    dboHS_PROVIDE_CONTRACT.dataTable.setSelectedIndex(0);
    dr.setItem("ENTERPRISE_COMM", value);
    dboHS_PROVIDE_CONTRACT.execUpdate();
    
    loadContract02();
};

// 修改02服务平台获得佣金返回
function ContractPC02_close(value, text) {        
    var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    var dr = dboHS_PROVIDE_CONTRACT.getByOid(lstContract02.getValue());
    dboHS_PROVIDE_CONTRACT.dataTable.addRecord(dr);
    dboHS_PROVIDE_CONTRACT.dataTable.setSelectedIndex(0);
    dr.setItem("PLATFORM_COMM", value);
    dboHS_PROVIDE_CONTRACT.execUpdate();
    
    loadContract02();
};

// 修改03服务企业获得佣金返回
function ContractEC03_close(value, text) {        
    var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    var dr = dboHS_PROVIDE_CONTRACT.getByOid(lstContract03.getValue());
    dboHS_PROVIDE_CONTRACT.dataTable.addRecord(dr);
    dboHS_PROVIDE_CONTRACT.dataTable.setSelectedIndex(0);
    dr.setItem("ENTERPRISE_COMM", value);
    dboHS_PROVIDE_CONTRACT.execUpdate();
    
    loadContract03();
};

// 修改03服务平台获得佣金返回
function ContractPC03_close(value, text) {        
    var dboHS_PROVIDE_CONTRACT = new entlogic_dbo("HSBOSS", "HS_PROVIDE_CONTRACT");
    var dr = dboHS_PROVIDE_CONTRACT.getByOid(lstContract03.getValue());
    dboHS_PROVIDE_CONTRACT.dataTable.addRecord(dr);
    dboHS_PROVIDE_CONTRACT.dataTable.setSelectedIndex(0);
    dr.setItem("PLATFORM_COMM", value);
    dboHS_PROVIDE_CONTRACT.execUpdate();
    
    loadContract03();
};

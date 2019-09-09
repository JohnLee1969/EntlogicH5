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
var dboHS_WORKER = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lstWorker = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var device = null;
var enterpriseOid = getUserSessionItem("enterpriseOid");
var directorOid = getUserSessionItem("directorOid");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
    // 初始化设备
    device = getDevice();
    
	//初始化数据组件
	 dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
	
	// 初始化交互组件   
    lstWorker = new entlogic_mui_list("lstWorker", formControls);
    lstWorker.setBindingData(dboHS_WORKER.dataTable);
    lstWorker.itemClick = lstWorker_itemClick;
    
	// 初始化交互组件
    $("#tagMain").click(tagMain_click);
    $("#tagOrder").click(tagOrder_click);
    $("#tagCustomer").click(tagCustomer_click);
    
    $("#btnAdd").click(btnAdd_click);
};

// 加载工作人员列表数据
function loadWorkers(pageIndex,pageSize) {
    var whereClause = "where HS_ENTERPRISE = '" + enterpriseOid + "' ";
    if (directorOid != null) whereClause += "and HS_DIRECTOR = '" + directorOid + "' ";
    whereClause += "and STATUS != '9' ";
	dboHS_WORKER.whereClause = whereClause;
    dboHS_WORKER.orderByClause = "order by CREATE_TIME desc";
    dboHS_WORKER.pageIndex = pageIndex;
    dboHS_WORKER.pageSize = pageSize;
    dboHS_WORKER.execQuery();
    if (lstWorker.getSize() > 0) {
//        if(pageIndex < pageCount)
//        {
//        	$("#lstWorker").scrollTop(0);
//        }
    	$(".btnEdit").click(btnEdit_click);
    	$(".btnTel").click(btnTel_click);
        lstWorker.setSelectedIndex(0);
        var pageCount = dboHS_WORKER.pageCount;
        var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
       var nScrollTop = 0;   //滚动到的当前位置
       var nDivHight = $("#lstWorker").height();
       var offsetTop = 0;
//       $("#lstWorker").scroll(function(){
//         nScrollHight = $(this)[0].scrollHeight;
//         nScrollTop = $(this)[0].scrollTop;
//         offsetTop = $("#lstWorker").offset().top;
//         if(nScrollTop + nDivHight +offsetTop >= nScrollHight)
//           if(pageIndex < pageCount)
//           {
//           		loadWorkers(pageIndex+1,8);
//           }
//         });
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    popUpLoading();
    // 调用组件初始化
	initComponents();
    	
	// 用户定义初始化
	loadWorkers(0,20);
    closeLoading();
    $("#lstWorker").show();
};

// 工作台单击事件响应
function tagMain_click() {
    jumpTo("MainForm.html");
	return;
};


// 客户单击事件响应
function tagOrder_click() {
    jumpTo("OrderForm.html");
	return;
};

// 客户单击事件响应
function tagCustomer_click() {
    jumpTo("CustomerForm.html");
	return;
};

// 阿姨列表项点击事件
function lstWorker_itemClick() {
    var workerOid = lstWorker.getValue();
    var worker = dboHS_WORKER.dataTable.getRecord(lstWorker.getSelectedIndex());
    if (lstWorker.itemClickTrigger == "btnEdit"){
        var url = encodeURI("WorkerBaseInfoForm.html?workerOid=" + workerOid);
    	jumpTo(url);
    } else if (lstWorker.itemClickTrigger == "btnTel"){
        var mobile = worker.getValue("MOBILE");
        if(mobile !== null && mobile !== "")
        {
    		device.openCall(mobile);
        }
    } else {
        var url = encodeURI("WorkerDetailForm.html?workerOid=" + workerOid);
        jumpTo(url);
    }
    lstWorker.itemClickTrigger = "";
};

// 添加服务人员数据
function btnAdd_click() {
	jumpTo("WorkerAuthenticationForm.html");
	return;
};

// 编辑服务人员数据
function btnEdit_click() {
    lstWorker.itemClickTrigger = "btnEdit";
};

// 拨打服务人员电话
function btnTel_click() {
    lstWorker.itemClickTrigger = "btnTel";
};
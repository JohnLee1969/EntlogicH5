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
var drWorker = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var tabWorker = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var enterpriseOid = getUserSessionItem("enterpriseOid");
var directorOid = getUserSessionItem("directorOid");
var workerOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
	
	// 初始化交互组件
    tabWorker = new entlogic_mui_tab("tabWorker","h");
    tabWorker.setCtlStatus = btnSaveStatus;
    
    $("#btnBack").click(btnBack_click);
    $("#btnSave").click(btnSave_click);
    $("#btnNext").click(btnNext_click);
};

// 加载服务人员资料
function loadTab() {
    if (workerOid == null) {
        var drNew = dboHS_WORKER.execCreate();
        workerOid = drNew.getValue("id");
        drNew.setItem("OID", workerOid);
        drNew.setItem("STATUS", "9");
        drNew.setItem("HS_ENTERPRISE", enterpriseOid);
        drNew.setItem("HEAD_PIC", "/app_resources/HSBOSS_E.mob/images/head.jpg");
        if (directorOid != null) drNew.setItem("HS_DIRECTOR", directorOid);
        dboHS_WORKER.execInsert(drNew);
    }
    else
    {
    	drWorker=dboHS_WORKER.getByOid(workerOid);
    }
        
    var title = "";
    var url = "";
    
    title = "基本信息";
    url = "WorkerBaseInfoFrame.html?workerOid=" + workerOid;
    tabWorker.addPage(title, url);
    
    title = "工作技能";
    url = "WorkerSkillInfoFrame.html?workerOid=" + workerOid;
    tabWorker.addPage(title, url);
    
    title = "签约服务";
    url = "WorkerServiceInfoFrame.html?workerOid=" + workerOid;
    tabWorker.addPage(title, url);
    
    title = "照片视频";
    url = "WorkerMediaInfoFrame.html?workerOid=" + workerOid;
    tabWorker.addPage(title, url);
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化
    workerOid = getUrlParam("workerOid");
    
	loadTab();
    tabWorker.selectPage(0);
};

// 返回按钮点击事件
function btnBack_click() {
    jumpTo("WorkerForm.html");
};

// 保存按钮单击事件
function btnSave_click() {
    if (tabWorker.getCurrentPage().saveData != null) tabWorker.getCurrentPage().saveData();
};

// 保存按钮单击事件
function btnNext_click() {
    var index = tabWorker.getSelectedIndex();
    index++;
    if(index < tabWorker.getSize())
    {
    	tabWorker.selectPage(index);
        if(index === tabWorker.getSize()-1)
        {
            $("#btnNext").html("完成");
        }
        else
        {
            $("#btnNext").html("下一步");
        }
        if(tabWorker.getSelectedIndex()===0)
        {
            $("#btnSave").show();
        }
        else
        {
            $("#btnSave").hide();
        }
    }
    else
    {
        jumpTo("WorkerForm.html");
    }
};

function btnSaveStatus()
{
    if(tabWorker.getSelectedIndex()===0)
    {
    	$("#btnSave").show();
    }
	else
    {
    	$("#btnSave").hide();
    }
}

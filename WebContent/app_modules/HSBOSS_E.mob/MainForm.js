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
var dboHS_ENTERPRISE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lblOrgName = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var enterpriseOid = getUserSessionItem("enterpriseOid");
var directorOid = getUserSessionItem("directorOid");
var enterprise = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_ENTERPRISE = new entlogic_dbo("HSBOSS", "HS_ENTERPRISE");    
    
	// 初始化交互组件
	lblOrgName = new entlogic_mui_output("lblOrgName", formControls);
      
    //推文
    $("#tag_Tweets").click(tagTweets_click);
    //海报
    $("#tag_Poster").click(tagPoster_click);
    //视频
    $("#tag_Video").click(tagVideo_click);
    //微店
    $("#tag_MicroShop").click(tagMicroShop_click);
      
    //工作台
    $("#tag_Workbench").click(tagWorkbench_click);
    //查信用
    $("#tag_CheckingCredit").click(tagCheckingCredit_click);
    //找阿姨
    $("#tag_FindWorker").click(tagFindWorker_click);
    //考证
    $("#tag_Certificate").click(tagCertificate_click);
    //老师
    $("#tagDirector").click(tagDirector_click);
    //资产
    $("#tag_Assets").click(tagAssets_click);
    //合同
    $("#tag_Contract").click(tagContract_click);
    //设置
    $("#tagSetting").click(tagSetting_click);
    
    $("#tagWorker").click(tagWorker_click);
    $("#tagOrder").click(tagOrder_click);
    $("#tagCustomer").click(tagCustomer_click);
    $("#tagUnAudit").click(tagUnAudit_click);
};

// 获取当前单位
function loadOrg() {
	enterprise = dboHS_ENTERPRISE.getByOid(enterpriseOid);
    var enterpriseStatus = enterprise.getValue("STATUS");
    
    var orgName = enterprise.getValue("NAME");
    lblOrgName.setValue(orgName);
    
    if (enterpriseStatus == "4") $("#tagUnAudit").hide();
};

// 检查企业状态
function checkEnterpriseStatus() {
    var enterpriseStatus = enterprise.getValue("STATUS");
    if (enterpriseStatus !== "4") {
       	popUpTips("企业未经过平台认证，请尽快认证","","立即认证",audit);
    	return false;
    }
    return true;
};

function audit()
{
    closeTips();
   	tagUnAudit_click();
}


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	    
	// 用户定义初始化
	loadOrg();
};

// 企业未认证事件响应
function tagUnAudit_click() {
    var enterpriseStatus = enterprise.getValue("STATUS");
    if (enterpriseStatus == "1") {
        jumpTo("AuditEnterpriseForm1.html?enterpriseOid=" + enterpriseOid);
        return false;
    } else if (enterpriseStatus == "2") {
        jumpTo("AuditEnterpriseForm2.html?enterpriseOid=" + enterpriseOid);
        return false;
    } else if(enterpriseStatus == "3" || enterpriseStatus == "5") {
        jumpTo("AuditEnterpriseForm3.html?enterpriseOid=" + enterpriseOid);
        return false;
    }
};

// 推文单击事件响应
function tagTweets_click() {
    if (!checkEnterpriseStatus()) return;
    popUpMobError("系统提示","该功能尚未开放，敬请期待！");
    //jumpTo("OrderForm.html");
	return;
};

// 海报单击事件响应
function tagPoster_click() {
    if (!checkEnterpriseStatus()) return;
    popUpMobError("系统提示","该功能尚未开放，敬请期待！");
    //jumpTo("OrderForm.html");
	return;
};

// 视频单击事件响应
function tagVideo_click() {
    if (!checkEnterpriseStatus()) return;
    popUpMobError("系统提示","该功能尚未开放，敬请期待！");
    //jumpTo("OrderForm.html");
	return;
};

// 微店单击事件响应
function tagMicroShop_click() {
    if (!checkEnterpriseStatus()) return;
    popUpMobError("系统提示","该功能尚未开放，敬请期待！");
    //jumpTo("OrderForm.html");
	return;
};

//工作台单击事件响应
function tagWorkbench_click() {
	 if (!checkEnterpriseStatus()) return;
	 popUpMobError("系统提示","该功能尚未开放，敬请期待！");
	 //jumpTo("OrderForm.html");
	 return;
};

//查信用单击事件响应
function tagCheckingCredit_click() {
	if (!checkEnterpriseStatus()) return;
	popUpMobError("系统提示","该功能尚未开放，敬请期待！");
	//jumpTo("OrderForm.html");
	return;
};

//找阿姨单击事件响应
function tagFindWorker_click() {
	if (!checkEnterpriseStatus()) return;
	popUpMobError("系统提示","该功能尚未开放，敬请期待！");
	//jumpTo("OrderForm.html");
	return;
};

//考证单击事件响应
function tagCertificate_click() {
	if (!checkEnterpriseStatus()) return;
	popUpMobError("系统提示","该功能尚未开放，敬请期待！");
	//jumpTo("OrderForm.html");
	return;
};

// 老师单击事件响应
function tagDirector_click() {
    if (!checkEnterpriseStatus()) return;    
    jumpTo("DirectorForm.html");
    return;
};

//资产单击事件响应
function tagAssets_click() {
	if (!checkEnterpriseStatus()) return;
	popUpMobError("系统提示","该功能尚未开放，敬请期待！");
	//jumpTo("OrderForm.html");
	return;
};

//合同单击事件响应
function tagContract_click() {
	if (!checkEnterpriseStatus()) return;
	popUpMobError("系统提示","该功能尚未开放，敬请期待！");
	//jumpTo("OrderForm.html");
	return;
};

//设置单击事件响应
function tagSetting_click()
{
    jumpTo("SettingForm.html");
	return;
}

// 阿姨单击事件响应
function tagWorker_click() {
    if (!checkEnterpriseStatus()) return;    
    jumpTo("WorkerForm.html");
    return;
};

// 客户单击事件响应
function tagOrder_click() {
    if (!checkEnterpriseStatus()) return;
    popUpMobError("系统提示","该功能尚未开放，敬请期待！");
    //jumpTo("OrderForm.html");
	return;
};

// 客户单击事件响应
function tagCustomer_click() {
    if (!checkEnterpriseStatus()) return;
    popUpMobError("系统提示","该功能尚未开放，敬请期待！");
    //jumpTo("CustomerForm.html");
	return;
};

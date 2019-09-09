/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 全局应用
var application = this;

// 应用的根目录
var applicationRoot = "/EntlogicH5";

//应用的根目录
var sessionId = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    




/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var fileUpload = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var fileUploadPath = null;

/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
    fileUpload = $("#fileUpload");
    fileUpload.hide();
    fileUpload.change(function() {
        var url = "../entlogicCommon/UploadBigFileDialog.html?filePath=" + fileUploadPath;
        popUpDialog(url, 200, 150, "上传文件",  application.uploadBigFileCallBack); 
    });
};

function getSysTitle(){
	var dboFW_PARAMETER = new entlogic_dbo("entlogicSystem", "FW_PARAMETER");
	dboFW_PARAMETER.orderByClause = "order by ORDER_CODE";
	dboFW_PARAMETER.execQuery();
	var appName = dboFW_PARAMETER.dataTable.getRecord(0).getValue("PARAM_VALUE");    
	$("title").html(appName);
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 获取参数
    var appRoot = getUrlParam("applicationRoot");
    if (appRoot != null) applicationRoot = appRoot;

	// 服务器链接测试
	if (!testService())  {
		popUpError("系统错误", "链接服务器失败！！");
		return;
	};
 	
	// 加载程序首页
    var d = new Date();
	var t = d.getTime();
    var url = "LoginForm.html?t=" + t;
	$("#iframeMain").attr("src", url);
    
    // 初始化页面组件
    initKeys();
    initComponents();
    getSysTitle();
};

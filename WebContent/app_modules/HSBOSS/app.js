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



/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
};


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
    var url = "../entlogicSystem/LoginForm.html?t=" + t;
	$("#iframeMain").attr("src", url);
    
    // 初始化页面组件
    initComponents();
};

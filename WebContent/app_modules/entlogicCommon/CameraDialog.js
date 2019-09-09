/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 全局应用
var application = parent.application;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

//本页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    



/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var videoObj = null;
var canvasObj = null;
var numCameraWidth = null;
var numCameraHeight = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明


 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化交互组件
    numCameraWidth = new entlogic_ui_text("numCameraWidth", formControls);
    numCameraHeight = new entlogic_ui_text("numCameraHeight", formControls);
    
	videoObj = document.getElementById("videoPic");
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                             || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    navigator.getUserMedia({ 
        video: true 
    }, function (stream) {
    	var URL = window.URL || window.webkitURL || window.msURL || window.oURL;
        if (URL && URL.createObjectURL) {
            //window.URL.createObjectURL(stream);
            videoObj.srcObject = stream;
        } else {
	        videoObj.srcObject = stream;
        }
        videoObj.play();
    }, function (error) {
        alert(error); 
    });
    
    canvasObj = document.getElementById("canvasPic");
    setDraggable($("#canvasPic"), 1);
    
	$("#btnPlay").click(btnPlay_click);
	$("#btnCapture").click(btnCapture_click);
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 初始化对话框大小
    var dialog = $("#divDialog",window.parent.document);
    dialog.width(680);
    dialog.height(636);

    // 调用组件初始化
	initComponents();
};

// 保存按钮单击事件响应
function btnPlay_click() {
    $("#videoPic").show();
    var context = canvasObj.getContext('2d');    
    context.clearRect(0, 0, canvasObj.offsetWidth, canvasObj.offsetHeight);
    
    videoObj.play();
};

// 拍照按钮单击事件响应
function btnCapture_click() {
    videoObj.pause()
    var t = canvasObj.offsetTop;
    var l = canvasObj.offsetLeft;
    var w = canvasObj.offsetWidth;
    var h = canvasObj.offsetHeight;
    canvasObj.width = w - 2;
    canvasObj.height = h - 2;
    var context = canvasObj.getContext('2d');    
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, w, h);
    context.drawImage(videoObj, l + 1, t + 1, w - 1, h - 1, 1, 1, w - 1, h - 1);
    $("#videoPic").hide();
};

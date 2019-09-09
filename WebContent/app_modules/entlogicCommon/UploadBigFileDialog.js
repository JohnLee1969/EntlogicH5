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
var divProcess = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var appName = getUrlParam("appName");
var filePath = getUrlParam("filePath");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化交互组件
    divProcess = $("#divProcess");
    divProcess.css("width", "0%");
    
    $("#btnCancel").click(uploadFile);
};

// 加载数据
function uploadFile(){
    var file = application.fileUpload[0].files[0]; 				//文件对象
    var fileSize = file.size;       					//总大小
    var blockSize = 2 * 1024 * 1024;    				//以2MB为一个分片
    var blockCount = Math.ceil(fileSize / blockSize);  	//总片数
    
	divProcess.css("width", "0%");
    
    var succeed = 0;             
    for(var i = 0;i < blockCount;++i){
        //计算每一片的起始与结束位置
        var start = i * blockSize;
        var end = Math.min(fileSize, start + blockSize);

        //构造一个表单，FormData是HTML5新增的
        var url = applicationRoot + "/UploadBigFile";
        url += "?blockCount=" + blockCount;
        url += "&blockSn=" + i;
        url += "&path=" + filePath;
        
        var form = new FormData();
        form.append("data", file.slice(start,end));  //slice方法用于切出文件的一部分
        
        //Ajax提交
        $.ajax({
            url: url,
            type: "POST",
            data: form,
            async: false,        					//异步
            processData: false,  					//很重要，告诉jquery不要对form进行处理
            contentType: false,  					//很重要，指定为false才能形成正确的Content-Type
            success: function(data){
                var result = $(data).find("result").text();
                if (result == "faild") {
                    alert("文件片上传失败！！！");
                }
                ++succeed;
                var p = Math.ceil(succeed / blockCount * 100);
                $("#lblProcess").html("（" + p + "%）");
                $("#divProcess").css("width", p + "%");
                
                if (result.indexOf("Uploading success!!") == 0) {
                    result = result.replace("Uploading success!! ", "");
                    dialogCallBack(result, null);
                    closeDialog();
                }
            }
        });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
	initComponents();
    setTimeout(uploadFile, 300);
};

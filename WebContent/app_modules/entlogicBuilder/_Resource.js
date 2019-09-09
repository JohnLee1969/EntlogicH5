/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据声明    

// 全局应用
var application = parent.application;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

// 页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//数据声明    
var dtFileNode = {};


/////////////////////////////////////////////////////////////////////////////////////////////////
//组件声明   
var tvwFileNode = {};
var txtUrl = {};


/////////////////////////////////////////////////////////////////////////////////////////////////
//内部变量声明
var appName =  parent.appName;
var uploadMode = "";


/////////////////////////////////////////////////////////////////////////////////////////////////
//内部函数声明

/**
 * 组件初始化
 */ 
function initComponents() {
	// 初始化数据组件
	dtFileNode = new entlogic_data_table();
	
	// 初始化交互组件
	divLeftSplitor = new entlogic_ui_draggable_h("divLeftSplitor");
	divLeftSplitor.dragStart = divLeftSplitor_dragStart;
	divLeftSplitor.dragMove = divLeftSplitor_dragMove;
	divLeftSplitor.dragStop = divLeftSplitor_dragStop;
	
	tvwFileNode = new entlogic_ui_treeview("tvwFileNode", formControls);
	tvwFileNode.setBindingData(dtFileNode);
	tvwFileNode.nodeClick = tvwFileNode_nodeClick;
    
	txtUrl = new entlogic_ui_text("txtUrl", formControls);
    
    $("#fileUpload").hide();
    $("#fileUpload").change(fileUpload_change);
    $("#btnAddFile").click(btnAddFile_click);
    $("#btnUpdateFile").click(btnUpdateFile_click);
    $("#btnDeleteFile").click(btnDeleteFile_click);
};

/**
 * 加载文件树
 */
function loadFileTree() {
	// 加载后台数据
	var rootPath = "/app_resources/" + appName;
	var filter = ".*";
	var parameters = new entlogic_data_record();
	parameters.addItem("rootPath", rootPath);
	parameters.addItem("filter", filter);
	var dataPackage = postBpService("com.entlogic.h5.services.FileService", "loadFileTree", parameters);
	dataPackage.fillDataTable(dtFileNode, "dtFileNode");
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//页面事件响应

/**
 * 父页面打开事件处理
 */ 
function bodyOnload() {
	// 初始化组件
    initKeys();
	initComponents();
	
	// 加载文件树
	loadFileTree();
};

/**
 * 
 */
function divLeftSplitor_dragStart() {
	$("#divWork").hide();
};

/**
 * 
 */
function divLeftSplitor_dragMove() {
	$("#divLeft").css("width", divLeftSplitor.x + "px");
	$("#divWork").css("left", divLeftSplitor.x + 4 + "px"); 
};

/**
 * 
 */
function divLeftSplitor_dragStop() {
	$("#divWork").show();
};

/**
 * 资源目录节点单击事件响应
 * @returns
 */
function tvwFileNode_nodeClick() {
	var fileName = tvwFileNode.currentNode.data.getValue("NODE_NAME");
	 var path = tvwFileNode.currentNode.data.getValue("NODE_VALUE");
	 var type = tvwFileNode.currentNode.data.getValue("NODE_TYPE");
	 txtUrl.setValue(path);
	 
	 var fileExt = getFileExt(fileName);
	 if (fileExt == "jpg" || fileExt == "png" || fileExt == "jis") {
		 var url = encodeURI("../../app_modules/entlogicCommon/_PicViewer.html?picUrl=" + path);
		 $("#iframeResourceView").attr("src", url);
	 } else if (fileExt == "js") {
		 var url = encodeURI("../../app_modules/entlogicCommon/_JsEditor.html?codeFilePath=" + path);
		 $("#iframeResourceView").attr("src", url);		 
	 } else if (fileExt == "css") {
		 var url = encodeURI("../../app_modules/entlogicCommon/_CssEditor.html?codeFilePath=" + path);
		 $("#iframeResourceView").attr("src", url);	 
	 }
};

/**
 * 添加文件按钮单击事件响应
 * @returns
 */
function btnAddFile_click() {
	uploadMode = "Add";
	$("#fileUpload").click();
};

/**
 * 覆盖文件按钮单击事件响应
 * @returns
 */
function btnUpdateFile_click() {
	uploadMode = "Update";
	$("#fileUpload").click();
};

/**
 * 文件上传
 * @returns
 */
function fileUpload_change() {   
	 var file = $("#fileUpload")[0].files[0]; 
	 var fileName = file.name;
	 var fileType = getFileExt(fileName);
	 
	 var path = tvwFileNode.currentNode.data.getValue("NODE_VALUE");
	 var type = tvwFileNode.currentNode.data.getValue("NODE_TYPE");
	 if (uploadMode == "Add") {
		 if (type == "file") {
			 alert("文件下不能添加文件，只有文件夹下可以添加文件！！");
			 return;
		 }
		 path += "/" + fileName;
	 } else {
		 if (type == "folder") {
			 alert("文件夹不能覆盖，只有文件可以覆盖！！");
			 return;
		 }
	 }
	 if (path == "null") path=""
	 	    
	var fileReader = new FileReader();
	fileReader.onload = function() { 
	    var data = this.result;
	    var url = uploadFile(appName, fileName, data, path);
	    if (url == null) return;
	    
		txtUrl.setValue(url);	 
		loadFileTree();
		tvwFileNode.setValue(txtUrl.getValue());
		tvwFileNode_nodeClick();
		$("#fileUpload").val("");  
	};
	fileReader.readAsDataURL(file);
 };
 
 /**
  * 文件删除
  * @returns
  */
 function btnDeleteFile_click() {
	 
 };

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


/////////////////////////////////////////////////////////////////////////////////////////////////
//组件声明   
var txtEditor = {};


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量
var codeMode = "css";
var codeFilePath = "";


/////////////////////////////////////////////////////////////////////////////////////////////////
//内部函数声明


/**
 * 组件初始化
 */ 
function initComponents() {
	// 初始化数据组件
	dtFileNode = new entlogic_data_table();
	
	// 初始化代码编辑器
	txtEditor = CodeMirror.fromTextArea(document.getElementById("txtEditor"), {
		mode: "javascript",		//实现javascript代码高亮
		theme: "dracula",		//设置主题
		styleActiveLine: true,
		lineNumbers: true,		//显示行号
		tabSize: 4,
		smartIndent:true,
		indentUnit: 4,  
		matchBrackets: true,
		keyMap: "default",
		extraKeys: {
			"Ctrl-Q": "autocomplete",
			"Ctrl-S": function(cm) {saveCodeFile(); }	}
	});
	txtEditor.setSize("100%", "100%");
 	
	$("#btnSearch").click(btnSearch_click);
	$("#btnReplace").click(btnReplace_click);
	$("#btnSave").click(btnSave_click);
    
    setReadOnly(parent.readOnly);
};

/**
 * 设置只读
 */
function setReadOnly(readOnly) {   
   	txtEditor.setOption("readOnly", readOnly);
    if (readOnly) {
        $("#btnReplace").hide();
        $("#btnSave").hide();
    } else {
        $("#btnReplace").show();
        $("#btnSave").show();
    }
};

/**
 * 外部调用接口-保存结果
 * @returns
 */
function save() {
	saveCodeFile();
};

/**
 * 加载代码
 */
function loadCodeFile(filePath) {
	// 接收参数
	codeFilePath = filePath;
	
	// 加载代码文件
	var parameters = new entlogic_data_record();
	parameters.addItem("filePath", codeFilePath);
	var dataPackage = postBpService("com.entlogic.h5.services.FileService", "loadTextFile", parameters);
	var fileContent = dataPackage.getReturn("fileContent");
	fileContent = base64_decode(fileContent);
	txtEditor.setValue(fileContent);
};

function find() {
	txtEditor.execCommand("find", "form");
}

/**
 * 保存代码
 * 
 * @param path
 */
function saveCodeFile() {
    if (parent.readOnly) return;
	if (codeFilePath == null || codeFilePath == "") return;
	var parameters = new entlogic_data_record();
	parameters.addItem("filePath", codeFilePath);
	parameters.addItem("fileContent", txtEditor.getValue());
	postBpService("com.entlogic.h5.services.FileService", "saveTextFile", parameters);
    popUpMessage("保存成功！");
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//页面事件响应

/**
 * 父页面打开事件处理
 */ 
function bodyOnload() {
    initKeys();
	initComponents();
	
	var filePath = "/app_modules/" + parent.appName + "/" + parent.formName + ".js"
	$("#lblTitle").html(filePath);
	loadCodeFile(filePath);
};

/**
 * 保存按钮单击事件响应
 * @returns
 */
function btnSave_click() {
	saveCodeFile();
};

/**
 * 查找按钮单击事件响应
 * @returns
 */
function btnSearch_click() {
	txtEditor.execCommand("find");
};

/**
 * 替换按钮单击事件响应
 * @returns
 */
function btnReplace_click() {
	txtEditor.execCommand("replace");
};

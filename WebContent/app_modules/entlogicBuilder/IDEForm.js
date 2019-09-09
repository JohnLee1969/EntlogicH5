/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明    

// 全局应用
var application = parent.application;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

// 页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
// 数据组件声明    

var dtFileNode = null;
var dtHtmlCssNode = null;
var dtHtmlJsNode = null;
var dtHtmlBodyNode = null;
var tnHtmlBodyNodeClip = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 交互组件声明   
var divLeftSplitor = null;
var divLeftSplitorV = null;
var divRightSplitor = null;
var divRightSplitorV = null;

var tvwFileNode = null;
var selStructureView = null;
var tvwHtmlCssNode = null;
var tvwHtmlJsNode = null;
var tvwHtmlBodyNode = null;
var mdiFrames = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var userOid = getUrlParam("userOid");
var userType = getUrlParam("userType");

var appName = null;
var formName = null;
var moduleUser = null;
var moduleStatus = null;
var readOnly = true;

var designMode = "PC";
var codeMode = "Design";

var MODULE_STATUS = {};
MODULE_STATUS["MS_CHECKIN"] = "&#xea5f;";
MODULE_STATUS["MS_CHECKOUT"] = "&#xe658;";
MODULE_STATUS["MS_WAITING"] = "&#xe7b0;";
MODULE_STATUS["MS_TESTING"] = "&#xe6dc;";
MODULE_STATUS["MS_BUG"] = "&#xe653;";
MODULE_STATUS["MS_OK"] = "&#xe603;";


var designChanged = true;
var htmlChanged = true;

var docProperty = null;
var docToolBox = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部函数声明

/**
 * 组件初始化
 */ 
function initComponents() {
	// 初始化数据组件
	dtFileNode = new entlogic_data_table();
	dtHtmlCssNode = new entlogic_data_table();
	dtHtmlJsNode = new entlogic_data_table();
	dtHtmlBodyNode = new entlogic_data_table();
	dtHtmlBodyNodeClip = new entlogic_data_table();
	
	// 初始化显示组件
	divLeftSplitor = new entlogic_ui_draggable_h("divLeftSplitor");
	divLeftSplitor.dragStart = divLeftSplitor_dragStart;
	divLeftSplitor.dragStop = divLeftSplitor_dragStop;
	divLeftSplitor.dragMove = divLeftSplitor_dragMove;
	
	divLeftSplitorV = new entlogic_ui_draggable_v("divLeftSplitorV");
	divLeftSplitorV.dragMove = divLeftSplitorV_dragMove;
	
	divRightSplitor = new entlogic_ui_draggable_h("divRightSplitor");
	divRightSplitor.dragStart = divRightSplitor_dragStart;
	divRightSplitor.dragStop = divRightSplitor_dragStop;
	divRightSplitor.dragMove = divRightSplitor_dragMove;
	
	divRightSplitorV = new entlogic_ui_draggable_v("divRightSplitorV");
	divRightSplitorV.dragStart = divRightSplitorV_dragStart;
	divRightSplitorV.dragStop = divRightSplitorV_dragStop;
	divRightSplitorV.dragMove = divRightSplitorV_dragMove;
	
	$(window).resize(window_resize);
	
	$("#btnModifyPassword").click(btnModifyPassword_click);
	$("#btnManageUser").click(btnManageUser_click);
    if (userType != "administrator") $("#btnManageUser").hide();
	$("#btnDevelopProcess").click(btnDevelopProcess_click);
	$("#btnLogin").click(btnLogin_click);

	$("#btnRefresh").click(btnRefresh_click);
	$("#btnAddModule").click(btnAddModule_click);
	$("#btnAddPage").click(btnAddPage_click);
	$("#btnDelete").click(btnDelete_click);
	$("#btnRename").click(btnRename_click);
	tvwFileNode = new entlogic_ui_treeview("tvwFileNode", formControls);
	tvwFileNode.setBindingData(dtFileNode);
	tvwFileNode.nodeClick = tvwFileNode_nodeClick;
	
	selStructureView = new entlogic_ui_select("selStructureView", formControls);
	selStructureView.changed = selStructureView_changed;
	$("#btnAddCom").click(btnAddCom_click);
	$("#btnDeleteCom").click(btnDeleteCom_click);
	$("#btnMoveUpCom").click(btnMoveUpCom_click);
	$("#btnMoveDownCom").click(btnMoveDownCom_click);
	
	tvwHtmlCssNode = new entlogic_ui_treeview("tvwHtmlCssNode", formControls);
	tvwHtmlCssNode.setBindingData(dtHtmlCssNode);	
	tvwHtmlCssNode.nodeClick = tvwHtmlCssNode_nodeClick;
	
	tvwHtmlJsNode = new entlogic_ui_treeview("tvwHtmlJsNode", formControls);
	tvwHtmlJsNode.setBindingData(dtHtmlJsNode);	
	tvwHtmlJsNode.nodeClick = tvwHtmlJsNode_nodeClick;
	
	tvwHtmlBodyNode = new entlogic_ui_treeview("tvwHtmlBodyNode", formControls);
	tvwHtmlBodyNode.setBindingData(dtHtmlBodyNode);	
	tvwHtmlBodyNode.nodeClick = tvwHtmlBodyNode_nodeClick;
	
	mdiFrames = new entlogic_ui_mdi("mdiFrames");

	$("#btnDesign").click(btnDesign_click);
	$("#btnHtml").click(btnHtml_click);
	$("#btnCss").click(btnCss_click);
	$("#btnJs").click(btnJs_click);
	$("#btnResource").click(btnResource_click);
	$("#btnDataFile").click(btnDataFile_click);
	$("#btnDBO").click(btnDBO_click);
	$("#btnModule").click(btnModule_click);

	$("#btnExtendView").click(btnExtendView_click);
	$("#btnRestoreView").click(btnRestoreView_click);
	$("#btnCheckOut").click(btnCheckOut_click);
	$("#btnCheckOut").hide();
	$("#btnCheckIn").click(btnCheckIn_click);
	$("#btnCheckIn").hide();
	$("#btnTest").click(btnTest_click);
	$("#btnTest").hide();
	$("#btnCommit").click(btnCommit_click);
	$("#btnCommit").hide();
	$("#btnExec").click(btnExec_click);
		
	docToolBox = $("#frameToolBox")[0].contentWindow;	
	$("#btnAddControl").click(btnAddControl_click);
	$("#btnInsertControlB").click(btnInsertControlB_click);
	$("#btnInsertControlN").click(btnInsertControlN_click);
	
	docProperty = $("#frameProperty")[0].contentWindow;
	$("#btnLookupFontIcon").click(btnLookupFontIcon_click);
};

/**
 * 加载应用目录
 */
function loadModules() {
	var parameters = new entlogic_data_record();
	parameters.addItem("userOid", userOid);
	parameters.addItem("rootPath", "/app_modules");
	parameters.addItem("filter", ".*\Form.html");
	var dataPackage = postBpService("com.entlogic.h5.builder.forms.IDEForm", "loadApps", parameters);
	dataPackage.fillDataTable(dtFileNode, "dtModules");
};

/**
 * 设置应用模块状态
 * 
 * @returns
 */
function setModuleStatus(status) {
	var moduleOid = appName + "_" + formName;
    var dboBD_MODULE = new entlogic_dbo("entlogicBuilder", "BD_MODULE");
    var drModule = dboBD_MODULE.getByOid(moduleOid);
    if (drModule == null) return;
    
    if (drModule.getValue("UPDATE_USER") != userOid && 
    	drModule.getValue("UPDATE_STATUS") != "MS_CHECKIN") {
    	status = drModule.getValue("UPDATE_STATUS");
    	mark = "<span style='color: #F99; font-size: 14px'>" + MODULE_STATUS[status] + "</span>";
    } else {
        
        drModule.setItem("STATUS", status);
        drModule.setItem("UPDATE_USER", userOid);
        dboBD_MODULE.execUpdate(drModule);
    	
    	var mark = null;
    	if (status == "MS_CHECKOUT") {
    		mark = "<span style='color: #090; font-size: 14px'>" + MODULE_STATUS[status] + "</span>";
    	} else {
    		mark = "<span style='color: #F99; font-size: 14px'>" + MODULE_STATUS[status] + "</span>";
    	}
    }
	
	var nodeData = tvwFileNode.currentNode.data;
	nodeData.setItem("status", status);
	nodeData.setItem("user", userOid);
	nodeData.setItem("mark", mark);
	
	dtFileNode.synchronizeLayout();
	tvwFileNode.setValue(moduleOid);
	tvwFileNode_nodeClick();
};

/**
 * 加载Html结构视图
 */
function loadHtmlTree() {
	var parameters = new entlogic_data_record();
	parameters.addItem("appName", appName);
	parameters.addItem("formName", formName);
	var dataPackage = postBpService("com.entlogic.h5.builder.forms.IDEForm", "loadHtmlTree", parameters);
	dataPackage.fillDataTable(dtHtmlCssNode, "dtHtmlCssNode");
	dataPackage.fillDataTable(dtHtmlJsNode, "dtHtmlJsNode");
	dataPackage.fillDataTable(dtHtmlBodyNode, "dtHtmlBodyNode");
	
	selStructureView_changed();
};

/**
 * 保存页面更新
 */
function saveHtmlFile() {
	var xmlCss = dtHtmlCssNode.toXML();
	var xmlJs =  dtHtmlJsNode.toXML();
	var xmlBody =  dtHtmlBodyNode.toXML();
	
	var parameters = new entlogic_data_record();
	parameters.addItem("appName", appName);
	parameters.addItem("formName", formName);
	parameters.addItem("xmlCss", xmlCss);
	parameters.addItem("xmlJs", xmlJs);
	parameters.addItem("xmlBody", xmlBody);
	postBpService("com.entlogic.h5.builder.forms.IDEForm", "updateHtmlTree", parameters);	
	docDesignChanged = true;
};

/**
 * 更新页面组件属性
 */
function updateProperties(pData) {
	var id = pData.getValue("id");
	if (id == "") {
		for(var j = 1; j < 1000; j ++) {
			id = "tag_" + j;
			if (tvwHtmlBodyNode.getNode(id) == null) break;
		}
		pData.setItem("id", id);
	}	

	tvwHtmlBodyNode.currentNode.id = pData.getValue("id");
	tvwHtmlBodyNode.currentNode.data = pData;
	saveHtmlFile();
	tvwHtmlBodyNode.draw();
	loadDesign(true);
};

/**
 * 加载设计视图
 * @returns
 */
function loadDesign(changed) {
	// 判断当前节点是否为页面
	if (formName == "*") return;
	var title = "design" + appName + "_" + formName;
	var filePath = "/app_modules/" + appName + "/" + formName + "_D.html";
	
	// 加载页面设计数据到mdi页面
	var designFrame = mdiFrames.getPage(title);
	if (designFrame == null) {
		if (appName.indexOf(".mob") > 0) {
			designFrame = mdiFrames.addPage(title, applicationRoot + filePath, "Mobile");
		} else  {
			designFrame = mdiFrames.addPage(title, applicationRoot + filePath, "PC");
		}
		htmlChanged = true;
	} else {
		if(changed) {
			var parameters = new entlogic_data_record();
			parameters.addItem("filePath", filePath);
			var dataPackage = postBpService("com.entlogic.h5.services.FileService", "loadTextFile", parameters);
			var fileContent = dataPackage.getReturn("fileContent");
			fileContent = base64_decode(fileContent);

			var frameDesign = designFrame[0];
			if (!!window.ActiveXObject || "ActiveXObject" in window) {//判断是否是IE浏览器
			    //对于IE,可以使用这种方式.同时,IE的iframe不支持srcdoc属性,这是唯一的方式.
				frameDesign.contentWindow.document.open();
				frameDesign.contentWindow.document.write(fileContent);
				frameDesign.contentWindow.document.close();
			}
			else {
			    //对于其他浏览器,直接设置srcdoc属性就可以了.而且,如果想设置iframe.contentWindow.document也是不可能拿的,因为iframe.contentWindow根据安全策略无法访问,
				frameDesign.srcdoc = fileContent;
			}            
			htmlChanged = true;
		}
	}
	mdiFrames.showPage(title);
	designChanged = false;
};

/**
 * 加载HTML
 * @returns
 */
function loadHtml(changed) {
	// 判断当前节点是否为页面
	if (formName == "*") return;
	var title = "html" + appName + "_" + formName;
	
	// 加载html代码
	var htmlFrame = mdiFrames.getPage(title);
	if (htmlFrame == null) {
		htmlFrame = mdiFrames.addPage(title, "_HtmlEditor.html");
		designChanged = true;
	} else {
		if(changed) {
			htmlFrame.attr('src', htmlFrame.attr('src'));
			designChanged = true;
		} else {
			if (typeof(htmlFrame[0].contentWindow.setReadOnly) == "undefined") return;
		    htmlFrame[0].contentWindow.setReadOnly(readOnly);
		}
	}    
	mdiFrames.showPage(title);
	htmlChanged = false;
};

/**
 * 加载CSS
 * @returns
 */
function loadCss() {
	// 判断当前节点是否为页面
	if (formName == "*") return;
	filePath = "/app_modules/" + appName + "/" + formName + ".css";
	
	// 加载CSS代码
	var cssFrame = mdiFrames.getPage(filePath);
	if (cssFrame == null) {
		cssFrame = mdiFrames.addPage(filePath, "_CssEditor.html")
	} else {
		if (typeof(cssFrame[0].contentWindow.setReadOnly) == "undefined") return;
	    cssFrame[0].contentWindow.setReadOnly(readOnly);
	}
	mdiFrames.showPage(filePath);
};

/**
 * 加载JS
 * @returns
 */
function loadJs() {
	// 判断当前节点是否为页面
	if (formName == "*") return;
	filePath = "/app_modules/" + appName + "/" + formName + ".js";
	
	// 加载JS代码
	var jsFrame = mdiFrames.getPage(filePath);
	if (jsFrame == null) {
		jsFrame = mdiFrames.addPage(filePath, "_JsEditor.html")
	} else {
		if (typeof(jsFrame[0].contentWindow.setReadOnly) == "undefined") return;
	    jsFrame[0].contentWindow.setReadOnly(readOnly);
	}
	mdiFrames.showPage(filePath);
};

/**
 * 加载RES
 * @returns
 */
function loadRes() {
	// 判断当前节点是否为页面
	if (appName == null) return;
	var title = "res" + appName;

	// 加载RESOURCE窗口
	var resFrame = mdiFrames.getPage(title);
	if (resFrame == null) {
		resFrame = mdiFrames.addPage(title, "_Resource.html")
	} 
	mdiFrames.showPage(title);
};

/**
 * 加载Dfs
 * @returns
 */
function loadDfs() {
	// 判断当前节点是否为页面
	if (appName == null) return;
	var title = "dfs" + appName;

	// 加载RESOURCE窗口
	var dfsFrame = mdiFrames.getPage(title);
	if (dfsFrame == null) {
		dfsFrame = mdiFrames.addPage(title, "_DataFile.html")
	}
	mdiFrames.showPage(title);
};

/**
 * 加载Dbo
 * @returns
 */
function loadDbo() {
	// 判断当前节点是否为页面
	if (appName == null) return;
	var title = "dbo" + appName;

	// 加载RESOURCE窗口
	var dboFrame = mdiFrames.getPage(title);
	if (dboFrame == null) {
		dboFrame = mdiFrames.addPage(title, "_DBO.html")
	}
	mdiFrames.showPage(title);
};

/**
 * 加载Module
 * @returns
 */
function loadModule() {
	// 判断当前节点是否为页面
	if (appName == null) return;
	var title = appName + "_" + formName;

	// 加载RESOURCE窗口
	var dboFrame = mdiFrames.getPage(title);
	if (dboFrame == null) {
		dboFrame = mdiFrames.addPage(title, "_ModuleProperty.html")
	}
	mdiFrames.showPage(title);
};

/**
 * 删除Body组件
 */
function deleteCom() {
	if (!confirm("确实要删除当前组件吗？")) return;
	
	tvwHtmlBodyNode.removeNode(tvwHtmlBodyNode.currentNode.id);
	saveHtmlFile();
	loadDesign(true);	
};

/**
 * 拷贝Body组件
 */
function copyCom() {
	tnHtmlBodyNodeClip = tvwHtmlBodyNode.currentNode.clone();    
};

/**
 * 粘贴Body组件
 */
function pasteCom() {
	var dt = new entlogic_data_table();
	var newNode = tnHtmlBodyNodeClip.clone();
	newNode.getData(dt);
	var dr = null;
	var sn = -1;
	var id ="";
	for(var i = 0; i < dt.getSize(); i++) {
		dr = dt.getRecord(i);
		for(var j = sn +1; j < 1000; j ++) {
			id = "tag_" + j;
			if (tvwHtmlBodyNode.getNode(id) == null) break;
		}
		sn = j;
		id = "tag_" + sn;
		dr.setItem("id", id);
	}	
	
	tvwHtmlBodyNode.addNode(newNode);
	tvwHtmlBodyNode.setValue(id);
	saveHtmlFile();	
	loadDesign(true);
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//页面事件响应

/**
 * 父页面打开事件处理
 */ 
function bodyOnload() {
	initKeys();    
	initComponents();
	loadModules();
	tvwFileNode_nodeClick();
	loadHtmlTree();
};

/**
 * 应用窗口调整大小
 */
function window_resize() {
	$("#divRightSplitor").css("left", $("#divMainContent").width() - $("#divRight").width() - 8 +"px");
};

/**
 * 
 */
function divLeftSplitor_dragStart() {
	$("#mdiFrames").hide();
};

/**
 * 
 */
function divLeftSplitor_dragStop() {
	$("#mdiFrames").show();
};

/**
 * 
 */
function divLeftSplitor_dragMove() {
	$("#divLeft").css("width", divLeftSplitor.x + "px");
	$("#divWork").css("left", divLeftSplitor.x + 4 + "px"); 
	$("#divWork").css("width",  $("#divMainContent").width() - $("#divLeft").width() - $("#divRight").width() - 12 + "px"); 
};

/**
 * 
 */
function divLeftSplitorV_dragMove() {
	$("#divCatalog").css("height", divLeftSplitorV.y + "px");
	$("#divStructure").css("height", $("#divLeft").height() - divLeftSplitorV.y - 4 + "px"); 
};

/**
 * 
 */
function divRightSplitor_dragStart() {
	$("#mdiFrames").hide();
	$("#frameProperty").hide();
	$("#frameToolBox").hide();
};

/**
 * 
 */
function divRightSplitor_dragStop() {
	$("#mdiFrames").show();
	$("#frameProperty").show();
	$("#frameToolBox").show();
};

/**
 * 
 */
function divRightSplitor_dragMove() {
	$("#divRight").css("width",  $("#divMainContent").width() - divRightSplitor.x - 8 + "px");
	$("#divWork").css("width",  $("#divMainContent").width() - $("#divLeft").width() - $("#divRight").width() - 12 + "px"); 
};

/**
 * 
 */
function divRightSplitorV_dragStart() {
	$("#frameProperty").hide();
	$("#frameToolBox").hide();
};

/**
 * 
 */
function divRightSplitorV_dragStop() {
	$("#frameProperty").show();
	$("#frameToolBox").show();
};

/**
 * 
 */
function divRightSplitorV_dragMove() {
	$("#divToolBox").css("height", divRightSplitorV.y + "px");
	$("#divProperties").css("height", $("#divRight").height() - divRightSplitorV.y - 4 + "px"); 
};

/**
 * 修改用户密码
 * @returns
 */
function btnModifyPassword_click() {
    var url = encodeURI("ModifyPasswordDialog.html?userOid=" + userOid);
	popUpDialog(url, 200, 150, "修改密码", {});
};

/**
 * 用户管理
 * @returns
 */
function btnManageUser_click() {
    var url = encodeURI("UserMngDialog.html?userOid=" + userOid);
	popUpDialog(url, 200, 150, "用户管理", {});
};

/**
 * 开发进度
 * @returns
 */
function btnDevelopProcess_click() {
    var url = encodeURI("DevelopProcessDialog.html?userOid=" + userOid);
	popUpDialog(url, 200, 150, "开发进度", {});
};

/**
 * 用户登录
 * @returns
 */
function btnLogin_click() {
    jumpTo("LoginForm.html");
};

/**
 * 应用文件节点单击事件响应
 */
function tvwFileNode_nodeClick() {
	var dataRecord = tvwFileNode.currentNode.data;
	appName = dataRecord.getValue("appName");
	formName = dataRecord.getValue("formName");
	moduleUser = dataRecord.getValue("user");
	moduleStatus = dataRecord.getValue("status");
	
	loadHtmlTree();
	
	if (moduleStatus == "MS_CHECKOUT" && moduleUser == userOid && formName != "*") {
		readOnly = false;
		$("#btnDelete").show();
		$("#btnRename").show();
		$("#btnAddCom").show();
		$("#btnDeleteCom").show();
		$("#btnMoveUpCom").show();
		$("#btnMoveDownCom").show();
		$("#btnAddControl").show();
		$("#btnInsertControlB").show();
		$("#btnInsertControlN").show();
	} else {
		readOnly = true;
		$("#btnDelete").hide();
		$("#btnRename").hide();
		$("#btnAddCom").hide();
		$("#btnDeleteCom").hide();
		$("#btnMoveUpCom").hide();
		$("#btnMoveDownCom").hide();
		$("#btnAddControl").hide();
		$("#btnInsertControlB").hide();
		$("#btnInsertControlN").hide();
	}
	
	if (userType == "administrator") {
		$("#btnDelete").show();
		$("#btnRename").show();
	}
	
	$("#btnCheckOut").hide();
	$("#btnCheckIn").hide();
	$("#btnTest").hide();
	$("#btnCommit").hide();
	if (moduleStatus == "MS_CHECKIN" || moduleStatus == "MS_BUG") {
		$("#btnCheckOut").show();
	} else if (moduleStatus == "MS_CHECKOUT" && (moduleUser == userOid || userType == "administrator")) {
		$("#btnCheckIn").show();
		$("#btnCommit").show();
	} else if (moduleStatus == "MS_WAITING") {
		$("#btnCheckOut").show();
		$("#btnTest").show();
	} else if (moduleStatus == "MS_TESTING" && (moduleUser == userOid || userType == "administrator")) {
		$("#btnTest").show();
		$("#btnCommit").show();
	} else if (moduleStatus == "MS_OK" && (moduleUser == userOid || userType == "administrator")) {
		$("#btnCheckOut").show();
		$("#btnTest").show();
	}
	
	if (formName == "*"){
		loadModule();
	} else if (codeMode == "Design") {
		loadDesign(true);
	} else if (codeMode == "Html") {
		loadHtml(htmlChanged);
	} else if (codeMode == "Css") {
		loadCss();
	} else if (codeMode == "Js") {
		loadJs();
	} else if (codeMode == "Res") {
		loadRes();
	} else if (codeMode == "Dbo") {
		loadDbo();
	} else if (codeMode == "Module") {
		loadModule();
	}
};

/**
 * 添加应用模块
 */
function btnAddModule_click() {
	popUpDialog("AddModuleDialog.html", 300, 180, "添加应用模块", AddModuleDialog_close);
};

/**
 * 添加应用模块对话框返回
 */
function AddModuleDialog_close(moduleId) {
	loadModules();
	tvwFileNode.setValue(moduleId);
	tvwFileNode_nodeClick();
};

/**
 * 添加应用页面
 */
function btnAddPage_click() {
	localStorage.setItem("appName", appName);
	popUpDialog("AddPageDialog.html", 300, 180, "添加应用页面", AddPageDialog_close);
};

/**
 * 添加应用页面对话框返回
 */
function AddPageDialog_close(moduleId) {
	loadModules();
	tvwFileNode.setValue(moduleId);
	tvwFileNode_nodeClick();
};

/**
 * 
 */
function btnDelete_click() {
	var nextNode = tvwFileNode.getNextNode();
	if (nextNode == null)  nextNode = tvwFileNode.getPreviousNode();
	if (nextNode == null) nextNode = tvwFileNode.currentNode.parentNode;
	
	if (!confirm("确实要删除(" + appName + "/" + formName + ")？")) return;
	
	var parameters = new entlogic_data_record();
	parameters.addItem("appName", appName);
	parameters.addItem("formName", formName);
	
	if (formName == "*") {
		postBpForm("com.entlogic.h5.builder.forms.IDEForm", "deleteApp", formControls, parameters);	
	} else {
		postBpForm("com.entlogic.h5.builder.forms.IDEForm", "deleteForm", formControls, parameters);	
	}
	
	loadModules();
	
	if (nextNode.id == null) return;	
	tvwFileNode.setValue(nextNode.id);
	tvwFileNode_nodeClick();
};

/**
 * 模块改名
 */
function btnRename_click() {
	popUpDialog("RenameDialog.html", 300, 180, "应用模块改名", RenameDialog_close);
};

/**
 * 模块改名返回
 */
function RenameDialog_close(moduleId) {
	loadModules();
	tvwFileNode.setValue(moduleId);
	tvwFileNode_nodeClick();
};

/**
 * 展开设计视图
 * @returns
 */
function btnExtendView_click() {
	mdiFrames.currentPage.css("height", "300%");
};

/**
 * 还原设计试图
 * @returns
 */
function btnRestoreView_click() {
	if (appName.indexOf(".mob") > 0) {
		mdiFrames.currentPage.css("height", "736px");
	} else  {
		mdiFrames.currentPage.css("height", "100%");
	}
};

/**
 * 切换只设计视图
 */
function btnDesign_click() {
	$("#btnDesign").attr("class","eb-check-btn");
	$("#btnHtml").attr("class","eb-check-btn");
	$("#btnCss").attr("class","eb-check-btn");
	$("#btnJs").attr("class","eb-check-btn");	
	$("#btnResource").attr("class","eb-check-btn");	
	$("#btnDataFile").attr("class","eb-check-btn");	
	$("#btnDBO").attr("class","eb-check-btn");	
	$("#btnModule").attr("class","eb-check-btn");	
	
	$("#btnDesign").attr("class","eb-check-btn-checked");	
	$("#btnExtendView").show();
	$("#btnRestoreView").show();
	
	codeMode = "Design";
	loadDesign(designChanged);
};

/**
 * 
 */
function btnHtml_click() {
	$("#btnDesign").attr("class","eb-check-btn");
	$("#btnHtml").attr("class","eb-check-btn");
	$("#btnCss").attr("class","eb-check-btn");
	$("#btnJs").attr("class","eb-check-btn");	
	$("#btnResource").attr("class","eb-check-btn");	
	$("#btnDataFile").attr("class","eb-check-btn");	
	$("#btnDBO").attr("class","eb-check-btn");	
	$("#btnModule").attr("class","eb-check-btn");	
	
	$("#btnHtml").attr("class","eb-check-btn-checked");	
	$("#btnExtendView").hide();
	$("#btnRestoreView").hide();
	
	codeMode = "Html";	
	loadHtml(htmlChanged);
};

/**
 * 
 */
function btnCss_click() {
	$("#btnDesign").attr("class","eb-check-btn");
	$("#btnHtml").attr("class","eb-check-btn");
	$("#btnCss").attr("class","eb-check-btn");
	$("#btnJs").attr("class","eb-check-btn");	
	$("#btnResource").attr("class","eb-check-btn");	
	$("#btnDataFile").attr("class","eb-check-btn");	
	$("#btnDBO").attr("class","eb-check-btn");	
	$("#btnModule").attr("class","eb-check-btn");	

	$("#btnCss").attr("class","eb-check-btn-checked");
	$("#btnExtendView").hide();
	$("#btnRestoreView").hide();

	codeMode = "Css";
	loadCss();
};

/**
 * 
 */
function btnJs_click() {
	$("#btnDesign").attr("class","eb-check-btn");
	$("#btnHtml").attr("class","eb-check-btn");
	$("#btnCss").attr("class","eb-check-btn");
	$("#btnJs").attr("class","eb-check-btn");	
	$("#btnResource").attr("class","eb-check-btn");	
	$("#btnDataFile").attr("class","eb-check-btn");	
	$("#btnDBO").attr("class","eb-check-btn");	
	$("#btnModule").attr("class","eb-check-btn");	

	$("#btnJs").attr("class","eb-check-btn-checked");
	$("#btnExtendView").hide();
	$("#btnRestoreView").hide();

	codeMode = "Js";
	loadJs();
};

/**
 * 
 */
function btnResource_click() {
	$("#btnDesign").attr("class","eb-check-btn");
	$("#btnHtml").attr("class","eb-check-btn");
	$("#btnCss").attr("class","eb-check-btn");
	$("#btnJs").attr("class","eb-check-btn");	
	$("#btnResource").attr("class","eb-check-btn");	
	$("#btnDataFile").attr("class","eb-check-btn");	
	$("#btnDBO").attr("class","eb-check-btn");	

	$("#btnResource").attr("class","eb-check-btn-checked");
	$("#btnExtendView").hide();
	$("#btnRestoreView").hide();
	$("#btnModule").attr("class","eb-check-btn");	

	codeMode = "Res";
	loadRes();
};

/**
 * 
 */
function btnDataFile_click() {
	$("#btnDesign").attr("class","eb-check-btn");
	$("#btnHtml").attr("class","eb-check-btn");
	$("#btnCss").attr("class","eb-check-btn");
	$("#btnJs").attr("class","eb-check-btn");	
	$("#btnResource").attr("class","eb-check-btn");	
	$("#btnDataFile").attr("class","eb-check-btn");	
	$("#btnDBO").attr("class","eb-check-btn");	
	$("#btnModule").attr("class","eb-check-btn");	

	$("#btnDataFile").attr("class","eb-check-btn-checked");
	$("#btnExtendView").hide();
	$("#btnRestoreView").hide();

	codeMode = "Dfs";
	loadDfs();
};

/**
 * DBO服务配置按钮单击事件
 */
function btnDBO_click() {
	$("#btnDesign").attr("class","eb-check-btn");
	$("#btnHtml").attr("class","eb-check-btn");
	$("#btnCss").attr("class","eb-check-btn");
	$("#btnJs").attr("class","eb-check-btn");	
	$("#btnResource").attr("class","eb-check-btn");	
	$("#btnDataFile").attr("class","eb-check-btn");	
	$("#btnDBO").attr("class","eb-check-btn");	
	$("#btnModule").attr("class","eb-check-btn");	

	$("#btnDBO").attr("class","eb-check-btn-checked");
	$("#btnExtendView").hide();
	$("#btnRestoreView").hide();

	codeMode = "Dbo";
	loadDbo();
};

/**
 * 质量管理按钮单击事件
 */
function btnModule_click() {
	$("#btnDesign").attr("class","eb-check-btn");
	$("#btnHtml").attr("class","eb-check-btn");
	$("#btnCss").attr("class","eb-check-btn");
	$("#btnJs").attr("class","eb-check-btn");	
	$("#btnResource").attr("class","eb-check-btn");	
	$("#btnDataFile").attr("class","eb-check-btn");	
	$("#btnDBO").attr("class","eb-check-btn");	
	$("#btnModule").attr("class","eb-check-btn");	

	$("#btnModule").attr("class","eb-check-btn-checked");
	$("#btnExtendView").hide();
	$("#btnRestoreView").hide();

	codeMode = "Module";
	loadModule();
};

/**
 * 检出按钮单击事件
 */
function btnCheckOut_click() {
	setModuleStatus("MS_CHECKOUT");
};

/**
 * 检入按钮单击事件
 */
function btnCheckIn_click() {
	setModuleStatus("MS_CHECKIN");
};

/**
 * 刷新导航目录
 * @returns
 */
function btnRefresh_click() {
	var currentFrame = mdiFrames.currentPage;
	if (currentFrame != null) currentFrame.attr("src", currentFrame.attr("src"));
};

/**
 * 测试按钮单击事件
 */
function btnTest_click() {
	setModuleStatus("MS_TESTING");
};

/**
 * 提交按钮单击事件
 */
function btnCommit_click() {
	var moduleOid = appName + "_" + formName;
	
	if (moduleStatus == "MS_CHECKOUT") {
		setModuleStatus("MS_WAITING");
	} else if (moduleStatus == "MS_TESTING") {
		var dboBD_BUG = new entlogic_dbo("entlogicBuilder", "BD_BUG");
		dboBD_BUG.whereClause = "where MODULE = '" + moduleOid + "'";
		var n = dboBD_BUG.count();
		if (n == 0) {
			setModuleStatus("MS_OK");
		} else {
			setModuleStatus("MS_BUG");
		}		
	}
};

/**
 * 执行按钮单击事件
 */
function btnExec_click() {
	var filePath = applicationRoot +"/app_modules/" + appName + "/app.html?applicationRoot=" + applicationRoot + "&t=" + (new Date()).getTime();
	if (appName.indexOf(".mob") >= 0) {
		window.open(filePath, "EntlogicTest"); 
	} else {
		window.open(filePath, "MobileTest"); 
	}
};

/**
 * 
 */
function selStructureView_changed() {
	tvwHtmlCssNode.hide();
	tvwHtmlJsNode.hide();
	tvwHtmlBodyNode.hide();
	$("#btnAddCom").show();
	$("#btnDeleteCom").show();
	if (selStructureView.getValue() == "body") {
		tvwHtmlBodyNode.show();
		$("#btnAddCom").hide();
	} else if (selStructureView.getValue() == "css") {
		tvwHtmlCssNode.show();
	} else {
		tvwHtmlJsNode.show();
	}
};

/**
 * 添加组件
 */
function btnAddCom_click() {
	if (selStructureView.getValue() == "css") {
		localStorage.setItem("rootPath", "/common/css");
		popUpDialog("_FileBrowser.html", 800, 600, "添加引用CSS", "_CssFileBrowser_close");
	} else if (selStructureView.getValue() == "js") {
		localStorage.setItem("rootPath", "/common/js");
		popUpDialog("_FileBrowser.html", 800, 600, "添加引用JS", "_JsFileBrowser_close");
	} 
};

/**
 * 关闭CSS引用对话框
 */
function _CssFileBrowser_close() {
	closeDialog();
	loadDesign(true);	
};

/**
 * 关闭JS引用对话框
 */
function _JsFileBrowser_close() {
	closeDialog();
	loadDesign(true);	
};

/**
 * 删除组件
 */
function btnDeleteCom_click() {
	if (selStructureView.getValue() == "body") {
		deleteCom();
	} else if (selStructureView.getValue() == "css") {
		tvwHtmlCssNode.removeNode(tvwHtmlBodyNode.currentNode.id);
		saveHtmlFile();
		loadDesign(true);
	} else {
		tvwHtmlJsNode.removeNode(tvwHtmlBodyNode.currentNode.id);
		saveHtmlFile();
		loadDesign(true);
	}
};

/**
 * 
 */
function btnMoveUpCom_click() {
	if (selStructureView.getValue() == "body") {
		tvwHtmlBodyNode.moveUpNode();
	} else if (selStructureView.getValue() == "css") {
		tvwHtmlCssNode.moveUpNode();
	} else {
		tvwHtmlJsNode.moveUpNode();
	}
	saveHtmlFile();	
	loadDesign(true);
};

/**
 * 
 */
function btnMoveDownCom_click() {
	if (selStructureView.getValue() == "body") {
		tvwHtmlBodyNode.moveDownNode();
	} else if (selStructureView.getValue() == "css") {
		tvwHtmlCssNode.moveDownNode();
	} else {
		tvwHtmlJsNode.moveDownNode();
	}
	saveHtmlFile();	
	loadDesign(true);
};

/**
 * 
 */
function tvwHtmlCssNode_nodeClick() {
	if (tvwHtmlCssNode.currentNode == null) return;
	var dataRecord = tvwHtmlCssNode.currentNode.data;
	var oId = dataRecord.getItemByKey("id").value;
};

/**
 * 
 */
function tvwHtmlJsNode_nodeClick() {
	if (tvwHtmlJsNode.currentNode == null) return;
	var dataRecord = tvwHtmlJsNode.currentNode.data;
	var oId = dataRecord.getItemByKey("id").value;
};

/**
 * 
 */
function tvwHtmlBodyNode_nodeClick() {
	if (tvwHtmlBodyNode.currentNode == null) return;
	var dataRecord = tvwHtmlBodyNode.currentNode.data;
	var oid = dataRecord.getItemByKey("id").value;
	if (codeMode == "Design") mdiFrames.currentPage.prop("contentWindow").setHighlight(oid);
	docProperty.loadProperty(dataRecord);
};

/**
 * 
 */
function btnAddControl_click() {
	if (codeMode != "Design") return;
	
	var control = docToolBox.tvwControl.currentNode.data;
	if (control.getItemByKey("tagName").value == "") return;
	
	var id ="";
	for(var i = 0; i < 1000; i ++) {
		id = "tag_" + i;
		if (tvwHtmlBodyNode.getNode(id) == null) break;
	}
	var newData = new entlogic_data_record();
	newData.addItem("id",  id);
	newData.addItem("lv", "0");
	newData.addItem("text", "[" + control.getItemByKey("tagName").value + " id='" + id + "' class='" +  control.getItemByKey("id").value + "']");
	newData.addItem("tagName", control.getItemByKey("tagName").value);
	newData.addItem("type", control.getItemByKey("type").value);
	newData.addItem("class",  control.getItemByKey("id").value);
	newData.addItem("style", control.getItemByKey("style").value);
	newData.addItem("src", "");
	newData.addItem("pattem", "");
	newData.addItem("placeholder", "");
	newData.addItem("title", "");
	newData.addItem("value", "");
	newData.addItem("content", control.getItemByKey("template").value);	
	
	var newNode = new entlogic_ui_treeview_node();
	newNode.id = id;
	newNode.data = newData;
	tvwHtmlBodyNode.addNode(newNode);
	
	saveHtmlFile();	
	loadHtmlTree();
	tvwHtmlBodyNode.setValue(id);
	loadDesign(true);
};

/**
 * 
 */
function btnInsertControlB_click() {
	if (codeMode != "Design") return;
	
	var control = docToolBox.tvwControl.currentNode.data;
	if (control.getItemByKey("tagName").value == "") return;
	
	var id ="";
	for(var i = 0; i < 1000; i ++) {
		id = "tag_" + i;
		if (tvwHtmlBodyNode.getNode(id) == null) break;
	}
	var newData = new entlogic_data_record();
	newData.addItem("id",  id);
	newData.addItem("lv", "0");
	newData.addItem("text", "[" + control.getItemByKey("tagName").value + " id='" + id + "' class='" +  control.getItemByKey("id").value + "']");
	newData.addItem("tagName", control.getItemByKey("tagName").value);
	newData.addItem("type", control.getItemByKey("type").value);
	newData.addItem("class",  control.getItemByKey("id").value);
	newData.addItem("style", control.getItemByKey("style").value);
	newData.addItem("src", "");
	newData.addItem("pattem", "");
	newData.addItem("placeholder", "");
	newData.addItem("title", "");
	newData.addItem("value", "");
	newData.addItem("content", control.getItemByKey("template").value);	
	
	var newNode = new entlogic_ui_treeview_node();
	newNode.id = id;
	newNode.data = newData;
	tvwHtmlBodyNode.insertNode(newNode);

	saveHtmlFile();	
	loadHtmlTree();
	tvwHtmlBodyNode.setValue(id);	
	loadDesign(true);
};

/**
 * 
 */
function btnInsertControlN_click() {
	if (codeMode != "Design") return;
	
	if (tvwHtmlBodyNode.currentNode.childSn < tvwHtmlBodyNode.currentNode.parentNode.childNodes.length - 1) {
		tvwHtmlBodyNode.setValue(tvwHtmlBodyNode.currentNode.parentNode.childNodes[tvwHtmlBodyNode.currentNode.childSn + 1].id);
		btnInsertControlB_click();
	} else {
		btnAddControl_click();
	}
};

/**
 * 产看字符图表
*/
function btnLookupFontIcon_click() {
    popUpDialog("FontIconDialog.html", 300, 180, "查看字符图标", function() {});
};
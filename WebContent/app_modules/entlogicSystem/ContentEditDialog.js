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
//  数据组件声明 
var dtCodeCMT = null;
var dtCodeCMS = null;
var dboCM_CONTENT = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var selContentType = null;
var txtContentName = null;
var txtHead = null;
var txtSubhead = null;
var txtUrl = null;
var dtStartTime = null;
var dtEndTime = null;
var selStatus = null;
var txtNote = null;
var txtSrc = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var catalogOid = getUrlParam("catalogOid");
var contentOid = getUrlParam("contentOid");

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");

    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'CMT' order by ORDER_CODE";
    dtCodeCMT = dba.execQuery();

    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'CMS' order by ORDER_CODE";
    dtCodeCMS = dba.execQuery();

    dboCM_CONTENT = new entlogic_dbo("entlogicSystem", "CM_CONTENT");
   
	// 初始化交互组件
	selContentType = new entlogic_ui_select("selContentType", formControls);
    selContentType.setBindingData(dboCM_CONTENT.dataTable, "CONTENT_TYPE");
    selContentType.setOptionsData(dtCodeCMT);
    selContentType.changed = selContentType_changed; 
    
	txtContentName = new entlogic_ui_text("txtContentName", formControls);
    txtContentName.setBindingData(dboCM_CONTENT.dataTable, "CONTENT_NAME");
    
	txtHead = new entlogic_ui_text("txtHead", formControls);
    txtHead.setBindingData(dboCM_CONTENT.dataTable, "HEAD");
    
	txtSubhead = new entlogic_ui_text("txtSubhead", formControls);
    txtSubhead.setBindingData(dboCM_CONTENT.dataTable, "SUBHEAD");
    
	txtUrl = new entlogic_ui_text("txtUrl", formControls);
    txtUrl.setBindingData(dboCM_CONTENT.dataTable, "URL");
    
	dtStartTime = new entlogic_ui_datetime("dtStartTime", formControls);
    dtStartTime.setBindingData(dboCM_CONTENT.dataTable, "START_TIME");
    dtStartTime.setShowTime(true);
    
	dtEndTime = new entlogic_ui_datetime("dtEndTime", formControls);
    dtEndTime.setBindingData(dboCM_CONTENT.dataTable, "END_TIME");
    dtEndTime.setShowTime(true);

	selStatus = new entlogic_ui_select("selStatus", formControls);
    selStatus.setBindingData(dboCM_CONTENT.dataTable, "STATUS");
    selStatus.setOptionsData(dtCodeCMS);

	txtNote = new entlogic_ui_textarea("txtNote", formControls);
    txtNote.setBindingData(dboCM_CONTENT.dataTable, "NOTE");
    
	txtSrc = new entlogic_ui_text("txtSrc", formControls);
    txtSrc.setBindingData(dboCM_CONTENT.dataTable, "SRC");
    txtSrc.setEnabled(false);
   
    $("#btnSave").click(btnSave_click);
    $("#btnUploadFile").click(btnUploadFile_click);
};

// 加载数据
function loadData() {
    if (contentOid == null) {
      	var drNew = dboCM_CONTENT.execCreate();
        drNew.setItem("PARENT_OID", catalogOid);       
      	dboCM_CONTENT.dataTable.addRecord(drNew);
      	dboCM_CONTENT.dataTable.setSelectedIndex(0);
    }
    else {
        dboCM_CONTENT.whereClause = "where OID = '" + contentOid + "'";
        dboCM_CONTENT.execQuery();
    }
    showContent();
};

// 显示内容
function showContent() {
    var contentType = selContentType.getValue();
    if (contentType == "00") {
    	var url = encodeURI("../entlogicCommon/_PicViewer.html?picUrl=" + txtSrc.getValue());
		$("#iframeContent").attr("src", url);
    } else if (contentType == "01") {
    	var url = encodeURI("../entlogicCommon/_AudioPlayer.html?audioUrl=" + txtSrc.getValue());
		$("#iframeContent").attr("src", url);
    } else if (contentType == "02") {
    	var url = encodeURI("../entlogicCommon/_VideoPlayer.html?videoUrl=" + txtSrc.getValue());
		$("#iframeContent").attr("src", url);
    }
};

// 数据检查
function checkData() {
    // 检查结果
    var result = true;
    var prompt = "错误提示：";
    
    // 检查用户名冲突
    /*
    txtUserName.setErrMessage("");
    txtUserName.setErrMessage("");
    if (txtUserName.getValue() == "") {
        txtUserName.setErrMessage("登陆账号不能为空！！");
        prompt += "\n登陆账号不能为空！！";
        result = result & false;
    }
    var currentUser = dboFW_USER.dataTable.getRecord(0);
    if (currentUser.getValue("OID") == "" && dboFW_USER.getByOid(txtUserName.getValue()) != null) {
        txtUserName.setErrMessage("登录账号已存在！！");
        prompt += "\n登录账号已存在！！";
        result = result & false;
    }
    */
    
    // 弹出提示框
    if (!result) {
        alert(prompt);
    }
    
    return result;
};

// 保存数据
function saveData() {
	if (contentOid == null) {
        var sn = parseInt(dboCM_CONTENT.getMax("SN")) + 1;
        var dr = dboCM_CONTENT.dataTable.getRecord(0);
        contentOid = dr.getValue("id");
        dr.setItem("OID", contentOid);
        dr.setItem("CM_CATALOG", catalogOid);
        dr.setItem("SN", sn);
		dboCM_CONTENT.execInsert();
	} else {
		dboCM_CONTENT.execUpdate();
	}
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadData();
};

// 内容类型改变事件响应
function selContentType_changed() {
    showContent();
};

// 导入文件按钮单击事件响应
function btnUploadFile_click() {
    // 检查数据合法性
    if (!checkData()) return;
    
    // 上传资源
    var path = application.getAFSPath();
    path = path + "/" + contentOid;
    application.uploadBigFile(path, function(fPaht, fType) {
        txtSrc.setValue(fPaht);
        saveData();
        showContent();
    }); 
};

// 保存按钮单击事件响应
function btnSave_click() {
    // 检查数据合法性
    if (!checkData()) return;
    
    // 保存数据
    saveData();
	
	// 返回父窗口
	dialogCallBack(contentOid);
	closeDialog();
};

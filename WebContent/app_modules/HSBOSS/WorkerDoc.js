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
var dtCodeYoN = null;
var dtCodeSEX = null;
var dtCodePNC = null;
var dtCodePLG = null;
var dtCodeEDU = null;
var dtCodeCT = null;
var dtCodeNC = null;
var dtCodeCN_AD = null;
var dtCodeRSD_TYP = null;
var drCodeWKR_MRS = null;
var dtCodeWKR_WEH = null;
var drCodeWKR_SKL = null;
var dtCodeWKR_LAN = null;

var dboHS_WORKER = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtName = null;
var selSex = null;
var dtBirthday = null;
var selMaritalStatus = null;
var selCertType = null;
var txtCertCode = null;
var selEducation = null;
var selResidentType = null;
var selNation = null;
var selReligion = null;
var lkpNationality = null;
var lkpNativeArea = null;
var txtNativeAddress = null;
var lkpWorkplaceNation = null;
var lkpWorkplaceArea = null;
var txtWorkplaceAddress = null;
var txtMobile = null;
var txtPhone = null;
var numHeight = null;
var numWeight = null;
var numWorkingYears = null;
var selVehicleType = null;
var lstSkill = null;
var lstLanguage = null;
var txtNote = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var pageScale = 1;
var workerOid = getUrlParam("workerOid");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    var dba = new entlogic_dba("jdbc/entlogic");

    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'YoN' order by ORDER_CODE";
    dtCodeYoN = dba.execQuery();

    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'SEX' order by ORDER_CODE";
    dtCodeSEX = dba.execQuery();
 
    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'EDU' order by ORDER_CODE";
    dtCodeEDU = dba.execQuery();
   
    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'PNC' order by ORDER_CODE";
    dtCodePNC = dba.execQuery();
    
    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'PLG' order by ORDER_CODE";
    dtCodePLG = dba.execQuery();
    
    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'CT' order by ORDER_CODE";
	dtCodeCT = dba.execQuery();
    
    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'NC' order by ORDER_CODE";
	dtCodeNC = dba.execQuery();
    
    dba.SQL = "select CODE, CODE_NAME from FW_CODE where CODE_TYPE_OID = 'CN_AD' order by ORDER_CODE";
    dtCodeCN_AD = dba.execQuery();
    
    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'RSD_TYP' order by ORDER_CODE";
    dtCodeRSD_TYP = dba.execQuery();
    
    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'WKR_MRS' order by ORDER_CODE";
	dtCodeWKR_MRS = dba.execQuery();
    
    dba.SQL = "select CODE, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'WKR_VEH' order by ORDER_CODE";
	dtCodeWKR_VEH = dba.execQuery();
    
    dba.SQL = "select CODE as id, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'WKR_SKL' order by ORDER_CODE";
	drCodeWKR_SKL = dba.execQuery();
    
    dba.SQL = "select CODE as id, CODE_NAME from HS_CODE where HS_CODE_TYPE = 'WKR_LAN' order by ORDER_CODE";
	dtCodeWKR_LAN = dba.execQuery();
     
	dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");

	
	// 初始化交互组件
    txtName = new entlogic_ui_text("txtName", formControls);
    txtName.setBindingData(dboHS_WORKER.dataTable, "NAME");
    
    selSex = new entlogic_ui_select("selSex", formControls);
    selSex.setOptionsData(dtCodeSEX);
    selSex.setBindingData(dboHS_WORKER.dataTable, "SEX");
    
	dtBirthday = new entlogic_ui_datetime("dtBirthday", formControls);
    dtBirthday.setBindingData(dboHS_WORKER.dataTable, "BIRTHDAY");
    
    selMaritalStatus = new entlogic_ui_select("selMaritalStatus", formControls);
    selMaritalStatus.setOptionsData(dtCodeWKR_MRS);
    selMaritalStatus.setBindingData(dboHS_WORKER.dataTable, "MARITAL_STATUS");
    
	selCertType = new entlogic_ui_select("selCertType", formControls);
    selCertType.setOptionsData(dtCodeCT);
    selCertType.setBindingData(dboHS_WORKER.dataTable, "CERT_TYPE");
    
	txtCertCode = new entlogic_ui_text("txtCertCode", formControls);
    txtCertCode.setBindingData(dboHS_WORKER.dataTable, "CERT_CODE");
      
    selEducation = new entlogic_ui_select("selEducation", formControls);
    selEducation.setOptionsData(dtCodeEDU);
    selEducation.setBindingData(dboHS_WORKER.dataTable, "EDUCATION");
     
    selResidentType = new entlogic_ui_select("selResidentType", formControls);
    selResidentType.setOptionsData(dtCodeRSD_TYP);
    selResidentType.setBindingData(dboHS_WORKER.dataTable, "RESIDENT_TYPE");
    
    selNation = new entlogic_ui_select("selNation", formControls);
    selNation.setOptionsData(dtCodePNC);
    selNation.setBindingData(dboHS_WORKER.dataTable, "NATION");
     
    selReligion = new entlogic_ui_select("selReligion", formControls);
    selReligion.setOptionsData(dtCodePLG);
    selReligion.setBindingData(dboHS_WORKER.dataTable, "RELIGION");
   
	lkpNationality = new entlogic_ui_lookup("lkpNationality", formControls);
    lkpNationality.setBindingData(dboHS_WORKER.dataTable, "NATIONALITY", "NATIONALITY_TEXT");
    lkpNationality.lookupDialogUrl = "../entlogicSystem/CodeLookup.html?codeTypeOid=NC";
    
	lkpNativeArea = new entlogic_ui_lookup("lkpNativeArea", formControls);
    lkpNativeArea.setBindingData(dboHS_WORKER.dataTable, "NATIVE_AREA", "NATIVE_AREA_TEXT");
    lkpNativeArea.lookupDialogUrl = "../entlogicSystem/CodeLookup.html?codeTypeOid=CN_AD";
    
	txtNativeAddress = new entlogic_ui_text("txtNativeAddress", formControls);
    txtNativeAddress.setBindingData(dboHS_WORKER.dataTable, "NATIVE_ADDRESS");
    
	lkpWorkplaceNation = new entlogic_ui_lookup("lkpWorkplaceNation", formControls);
    lkpWorkplaceNation.setBindingData(dboHS_WORKER.dataTable, "WORKPLACE_NATION", "WORKPLACE_NATION_TEXT");
    lkpWorkplaceNation.lookupDialogUrl = "../entlogicSystem/CodeLookup.html?codeTypeOid=NC";
    
	lkpWorkplaceArea = new entlogic_ui_lookup("lkpWorkplaceArea", formControls);
    lkpWorkplaceArea.setBindingData(dboHS_WORKER.dataTable, "WORKPLACE_AREA", "WORKPLACE_AREA_TEXT");
    lkpWorkplaceArea.lookupDialogUrl = "../entlogicSystem/CodeLookup.html?codeTypeOid=CN_AD";
    
	txtWorkplaceAddress = new entlogic_ui_text("txtWorkplaceAddress", formControls);
    txtWorkplaceAddress.setBindingData(dboHS_WORKER.dataTable, "WORKPLACE_ADDRESS");
   
    txtMobile = new entlogic_ui_text("txtMobile", formControls);
    txtMobile.setBindingData(dboHS_WORKER.dataTable, "MOBILE");
   
    txtPhone = new entlogic_ui_text("txtPhone", formControls);
    txtPhone.setBindingData(dboHS_WORKER.dataTable, "PHONE");
   
    numHeight = new entlogic_ui_number("numHeight", formControls);
    numHeight.setBindingData(dboHS_WORKER.dataTable, "HEIGHT");
   
    numWeight = new entlogic_ui_number("numWeight", formControls);
    numWeight.setBindingData(dboHS_WORKER.dataTable, "WEIGHT");
   
    numWorkingYears = new entlogic_ui_number("numWorkingYears", formControls);
    
    selVehicleType = new entlogic_ui_select("selVehicleType", formControls);
    selVehicleType.setOptionsData(dtCodeWKR_VEH);
    selVehicleType.setBindingData(dboHS_WORKER.dataTable, "VEHICLE_TYPE");
   
	lstSkill = new entlogic_ui_list("lstSkill", formControls);
    lstSkill.setMultiselected(true);
    lstSkill.setBindingData(drCodeWKR_SKL);
    
	lstLanguage = new entlogic_ui_list("lstLanguage", formControls);
    lstLanguage.setMultiselected(true);
    lstLanguage.setBindingData(dtCodeWKR_LAN);
    
    txtNote = new entlogic_ui_textarea("txtNote", formControls);
    txtNote.setBindingData(dboHS_WORKER.dataTable, "NOTE");
    
    imgPic = new entlogic_ui_image("imgPic", formControls);
    imgPic.displayMode = "FitHeight";
    imgPic.setBindingData(dboHS_WORKER.dataTable, "HEAD_PIC");
      
    $("#btnUploadPic").click(btnUploadPic_click);
    $("#btnTakePic").click(btnTakePic_click);
    $("#btnSave").click(btnSave_click);
    
	$("#btnRestore").click(btnRestore_click);
	$("#btnZoomUp").click(btnZoomUp_click);
	$("#btnZoomDown").click(btnZoomDown_click);
	$("#btnFixHeight").click(btnFixHeight_click);
	$("#btnFixWidth").click(btnFixWidth_click);
    //btnFixHeight_click();
};

// 加载服务人员数据
function loadWorker() {
    // 查询获取数据
    if (workerOid == null) {
        var dr = dboHS_WORKER.execCreate();
        dr.setItem("NAME", "新人");
        dboHS_WORKER.dataTable.addRecord(dr);
        dboHS_WORKER.dataTable.setSelectedIndex(0);
        dboHS_WORKER.dataTable.synchronizeLayout();
    } else {
        dboHS_WORKER.whereClause = "where OID = '" + workerOid + "'";
        dboHS_WORKER.execQuery();
        var dr = dboHS_WORKER.dataTable.getRecord(0);
        lstSkill.setValues(dr.getValue("SKILL").split(","));
        lstLanguage.setValues(dr.getValue("LANGUAGE").split(","));
        var now = new Date();
        var nowYear = now.getFullYear();
        var workingYears = nowYear - dr.getValue("FROM_START_YEAR");
        numWorkingYears.setValue(workingYears);
    }
    
    if (imgPic.getValue() == "null" || imgPic.getValue() == "") {
        $("#divPic").css("width", "88px");
    } else {
        $("#divPic").css("width", "auto");
    }
};

// 保存服务人员数据
function saveWorker() {
    // 保存数据
    var dr = dboHS_WORKER.dataTable.getRecord(0);
    dr.setItem("SKILL", lstSkill.getValues().toString());
    dr.setItem("LANGUAGE", lstLanguage.getValues().toString());
    var now = new Date();
    var nowYear = now.getFullYear();
    var workingYears = nowYear - numWorkingYears.getValue();
    dr.setItem("FROM_START_YEAR", workingYears);

    if (workerOid == null) {
        workerOid = dr.getValue("id")
		dr.setItem("OID", workerOid);
        dboHS_WORKER.execInsert();
    } else {
        dboHS_WORKER.execUpdate();
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


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadWorker();
};

// 保存档案
function btnSave_click() {
	// 数据检查
    if (!checkData()) return;
    
    // 保存数据
	saveWorker();  
    
    // 保存成功提示
    popUpMessage("数据保存成功！");
    if (typeof(parent.setDocTitle) != "undefined") parent.setDocTitle();
};

// 上传照片文件
function filePic_change() {
    // 检查数据
    if (!checkData()) return;
    
    // 保存数据
    saveWorker();
    
    // 上传照片
    var file = $("#filePic")[0].files[0]; 
    var fileName = file.name;
    var fileType = getFileExt(fileName);
    var path = imgPic.getValue();
    if (path == "null") path = "";
    
    var fileReader = new FileReader();
    fileReader.onload = function() { 
        var data = this.result;
        var imgUrl = uploadFile(applicationRoot, "HSBOSS", workerOid + "." + fileType, data, path);
        if (imgUrl == null) return;
        
     	imgPic.setValue(imgUrl);
		dboHS_WORKER.execUpdate();  
    	$("#filePic").val("");  
	};
    fileReader.readAsDataURL(file);
};

// 上传照片按钮点击事件
function btnUploadPic_click() {
    var url = "../entlogicCommon/UploadBigFileDialog.html?appName=HSBOSS";
	popUpDialog(url, 200, 150, "上传图片文件", function(imgUrl, ft) {
        if (imgUrl == null) return;        
     	imgPic.setValue(imgUrl);
		dboHS_WORKER.execUpdate();  
    }); 
};

// 拍摄照片按钮点击事件
function btnTakePic_click() {
	popUpDialog("../entlogicCommon/CameraDialog.html", 200, 150, "拍摄用户照片", CameraDialog_close); 
};

// 拍摄照片后处理
function CameraDialog_close() {
};


////////////////////////////////////////////////////////
// 档案页视图控制函数：系统自带建议用户不要自行更改。 //       
////////////////////////////////////////////////////////

// 页面放大
function btnZoomUp_click() {
	var page = $("#divPage");
	
	pageScale += 0.1;
	page.css("transform", "scale(" + pageScale + ")");
};

/**
 * 页面缩小
 */
function btnZoomDown_click() {
	var page = $("#divPage");
	
	pageScale -= 0.1;
	page.css("transform", "scale(" + pageScale + ")");
};

// 适应页高
function btnFixHeight_click() {
	var pageView = $("#divPageView");
	var page = $("#divPage");
    
	var pageWidth = page.width();
	var pageHeight = page.height();
	var pageViewWidth = pageView.width();
	var pageViewHeight = pageView.height();
	
	pageScale = (pageViewHeight * 0.90) / pageHeight;
	page.css("transform", "scale(" + pageScale + ")");
};

// 适应页宽
function btnFixWidth_click() {
	var pageView = $("#divPageView");
	var page = $("#divPage");
    
	var pageWidth = page.width();
	var pageHeight = page.height();
	var pageViewWidth = pageView.width();
	var pageViewHeight = pageView.height();
	
	pageScale = (pageView.width() * 0.90) / page.width();
	page.css("transform", "scale(" + pageScale + ")");
};

// 页面还原
function btnRestore_click() {
	var pageView = $("#divPageView");
	var page = $("#divPage");

	pageScale = 1;
	page.css("transform", "scale(" + pageScale + ")");
};

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
var dboHS_CODE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtOrderCode = null;
var txtCode = null;
var txtCodeName = null;
var txtDescription = null;
var txtFontIcon = null;
var imgImageIcon = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var codeTypeOid = getUrlParam("codeTypeOid");
var codeOid = getUrlParam("codeOid");
   

/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	dboHS_CODE = new entlogic_dbo("HSBOSS", "HS_CODE");
   
	// 初始化交互组件
    txtOrderCode = new entlogic_ui_text("txtOrderCode", formControls);
    txtOrderCode.setBindingData(dboHS_CODE.dataTable, "ORDER_CODE");

    txtCode = new entlogic_ui_text("txtCode", formControls);
    txtCode.setBindingData(dboHS_CODE.dataTable, "CODE");

    txtCodeName = new entlogic_ui_text("txtCodeName", formControls);
    txtCodeName.setBindingData(dboHS_CODE.dataTable, "CODE_NAME");

    txtDescription = new entlogic_ui_textarea("txtDescription", formControls);
    txtDescription.setBindingData(dboHS_CODE.dataTable, "DESCRIPTION");
    
    txtFontIcon = new entlogic_ui_text("txtFontIcon", formControls);
    txtFontIcon.setBindingData(dboHS_CODE.dataTable, "FONT_ICON");
    
    imgImageIcon = new entlogic_ui_image("imgImageIcon", formControls);
    imgImageIcon.setBindingData(dboHS_CODE.dataTable, "IMAGE_ICON");

    $("#btnUploadFile").click(btnUploadFile_click);
    $("#btnSave").click(btnSave_click);
    OK = btnSave_click;
};

// 加载数据
function loadCode() {
    // 查询获取数据
	if (codeOid == null) {
        var dr = dboHS_CODE.execCreate();
        dr.setItem("CODE", "新编码");
        dr.setItem("CODE_NAME", "新编码");
        dboHS_CODE.dataTable.addRecord(dr);
        dboHS_CODE.dataTable.setSelectedIndex(0);
        dboHS_CODE.dataTable.synchronizeLayout();
        var url = encodeURI("AccessoryImageFrame.html");
        $("#iframeAccessory").attr("src", url);
	} else {
		dboHS_CODE.whereClause = "where OID = '" + codeOid + "'";
		dboHS_CODE.execQuery();
      	var dr = dboHS_CODE.dataTable.getRecord(0);
        codeTypeOid = dr.getValue("HS_CODE_TYPE");
        var url = encodeURI("AccessoryImageFrame.html?bizOid=" + codeOid);
        $("#iframeAccessory").attr("src", url);
   }
};

// 保存数据
function saveCode() {
	if (codeOid == null) { 
        var dr = dboHS_CODE.dataTable.getRecord(0);
        codeOid = codeTypeOid + "_" + txtCode.getValue();
        if (dboHS_CODE.getByOid(codeOid) != null) {
            alert("编码冲突！！");
            return false;
        }
        dr.setItem("OID", codeOid);
		dr.setItem("HS_CODE_TYPE", codeTypeOid);
		dboHS_CODE.execInsert();
        var url = encodeURI("AccessoryImageFrame.html?bizOid=" + codeOid);
        $("#iframeAccessory").attr("src", url);
	} else {
		dboHS_CODE.execUpdate();
	}
    
    return true;
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadCode();
};

// 导入文件按钮单击事件响应
function btnUploadFile_click() {
	popUpDialog("../entlogicCommon/UploadBigFileDialog.html", 200, 150, "上传图标", function(imgUrl) {
        imgImageIcon.setValue(imgUrl);
        dboHS_CODE.execUpdate();
    }); 
};

// 保存按钮单击事件响应
function btnSave_click() {    
    // 保存数据
 	if (!saveCode()) return;
    
    // 返回主页面回调
	dialogCallBack(codeOid);
    closeDialog();
};

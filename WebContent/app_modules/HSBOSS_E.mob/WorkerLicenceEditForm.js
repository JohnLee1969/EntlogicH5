/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 应用的根目录
var applicationRoot = getUrlParam("applicationRoot");

//应用的根目录
var sessionId = getUrlParam("sessionId");

//本页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据组件声明    
var dboHS_WORKER_LICENCE = null;
var dboHS_ACCESSORY_PIC = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lkpCertType = null;
var txtCertCode = null;
var dtEffectiveDate = null;
var dtExpiryDate = null;

var  lstPic = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var device = null;
var workerOid = null;
var workerLicenceOid = null;

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
    // 初始化设备
    device = getDevice();
    
	// 初始化数据组件
    dboHS_WORKER_LICENCE = new entlogic_dbo("HSBOSS", "HS_WORKER_LICENCE");
    dboHS_ACCESSORY_PIC = new entlogic_dbo("HSBOSS", "HS_ACCESSORY");
   
	// 初始化交互组件
	lkpCertType = new entlogic_mui_lookup("lkpCertType", formControls);
    lkpCertType.setBindingData(dboHS_WORKER_LICENCE.dataTable, "CERT_TYPE", "CERT_TYPE_TEXT");
    lkpCertType.lookupUrl = encodeURI("CodeLookup.html?codeTypeOid=LCS_TYP&title=选择工作证书");
    
    txtCertCode = new entlogic_mui_text("txtCertCode", formControls);
    txtCertCode.setBindingData(dboHS_WORKER_LICENCE.dataTable, "CERT_CODE");
    
	dtEffectiveDate = new entlogic_mui_date("dtEffectiveDate", formControls);
    dtEffectiveDate.setBindingData(dboHS_WORKER_LICENCE.dataTable, "EFFECTIVE_DATE");
     
	dtExpiryDate = new entlogic_mui_date("dtExpiryDate", formControls);
    dtExpiryDate.setBindingData(dboHS_WORKER_LICENCE.dataTable, "EXPIRY_DATE");
    
    lstPic = new entlogic_mui_list("lstPic", formControls);
    lstPic.setBindingData(dboHS_ACCESSORY_PIC.dataTable);
    lstPic.itemClick = lstPic_itemClick;
   
    $("#btnBack").click(btnBack_click);
    $("#btnSave").click(btnSave_click);
	$("#btnGetPhoto").click(btnGetPhoto_click);
	$("#btnTakePhoto").click(btnTakePhoto_click);
};

// 加载数据
function loadData() {
    if (workerLicenceOid == null) {
      	var drNew = dboHS_WORKER_LICENCE.execCreate();
      	dboHS_WORKER_LICENCE.dataTable.addRecord(drNew);
      	dboHS_WORKER_LICENCE.dataTable.setSelectedIndex(0);
    }
    else {
        dboHS_WORKER_LICENCE.whereClause = "where OID = '" + workerLicenceOid + "'";
        dboHS_WORKER_LICENCE.execQuery();
    }
};

// 数据检查
function checkData() {
    // 检查结果
    var result = true;
     var prompt = "";
	var flag = true;
    
    alert(lkpCertType.getValue());
	if (lkpCertType.getValue() === null || lkpCertType.getValue() === "") {
        prompt += "<br/>请选择证件类别!";
		flag = false;
	}
	if (txtCertCode.getValue() === "") {
        prompt += "<br/>请输入证件编号!";
		flag = false;
	} 
	if (dtEffectiveDate.getValue() === "") {
        prompt += "<br/>请输入生效日期!";
		flag = false;
	} 
	if (dtExpiryDate.getValue() === "") {
        prompt += "<br/>请输入失效日期!";
		flag = false;
	} 
    
    if (!flag) popUpMobError("错误提示", prompt);
	return flag;
};

// 保存数据
function saveData() {
	if (workerLicenceOid == null) {
        var drNew = dboHS_WORKER_LICENCE.dataTable.getRecord(0);
         workerLicenceOid = drNew.getValue("id");
        drNew.setItem("OID", workerLicenceOid);
        drNew.setItem("HS_WORKER", workerOid);
		dboHS_WORKER_LICENCE.execInsert();
	} else {
		dboHS_WORKER_LICENCE.execUpdate();
	}
}


// 加载图片
function loadPic() {    
    dboHS_ACCESSORY_PIC.whereClause = "where FILE_TYPE in('jpg','jpeg','png') and BIZ_OID = '" + workerLicenceOid + "' ";
	dboHS_ACCESSORY_PIC.orderByClause = " order by SN  ";
	dboHS_ACCESSORY_PIC.execQuery();
    $(".btnDeletePic").click(btnDeletePic_click);
};

// 上传人员证件图片
function uploadPhoto(data) {
    saveData();
    var dr = dboHS_ACCESSORY_PIC.execCreate();
    var oid = dr.getValue("id");
    
    var imgUrl = uploadFile(applicationRoot, "HSBOSS", oid + ".jpg", data, "");
    if (imgUrl == null) return;

    dr.setItem("OID", oid);
    dr.setItem("BIZ_OID", workerLicenceOid);
    dr.setItem("SN", lstPic.getSize() + 1);
    dr.setItem("FILE_TYPE", "jpg");
    dr.setItem("FILE_PATH", imgUrl);
    dboHS_ACCESSORY_PIC.execInsert(dr);
    
    loadPic();
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 接受传递参数
    workerOid = getUrlParam("workerOid");
    workerLicenceOid = getUrlParam("workerLicenceOid");

    // 调用组件初始化
	initComponents();
	
	// 用户定义初始化
	loadData();
    loadPic();
};

// 返回按钮单击事件
function btnBack_click() {
    // 返回父窗口
	subFormCallBack(workerLicenceOid);
    closeSubForm();
};

// 保存按钮单击事件响应
function btnSave_click() {
    // 检查数据合法性
    // 保存数据
    saveData();
    if (!checkData()) return;
    
	// 返回父窗口
	subFormCallBack(workerLicenceOid);
    closeSubForm();
};

// 打开相册
function btnGetPhoto_click() {
	device.onPhotoReturn = devPhoto_return;
	device.selectPhoto();
};

// 从相册获取图片
function devPhoto_return(res) {
	uploadPhoto(res);
	device.onPhotoReturn = function() {
	};
};

// 打开相机
function btnTakePhoto_click() {
	device.onPhotoReturn = devCamara_return;
	device.openCamara();
};

// 从相册获取图片
function devCamara_return(res) {
	uploadPhoto(res);
	device.onPhotoReturn = function() {
	};
};

// 删除照片
function btnDeletePic_click() {
    lstPic.itemClickTrigger = "btnDeletePic";
};

// 图片列表数据项点击事件
function lstPic_itemClick() {    
    if (lstPic.itemClickTrigger == "btnDeletePic") {
        var dr = dboHS_ACCESSORY_PIC.dataTable.getRecord(lstPic.getSelectedIndex());
        if (dr == null) return;
        var path = dr.getValue("FILE_PATH");
        deleteFile(path);
        dboHS_ACCESSORY_PIC.execDelete();
        loadPic();
    }
};

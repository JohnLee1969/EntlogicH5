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
var dboHS_WORKER = null;
var dboHS_ACCESSORY_PIC = null;
var dboHS_ACCESSORY_VIDEO = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明 
var device = null;
var imgHeadPic = null;
var lstPic = null;
var lstVideo = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var workerOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
    // 初始化设备
    device = getDevice();
    
	//初始化数据组件
    dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
    dboHS_ACCESSORY_PIC = new entlogic_dbo("HSBOSS", "HS_ACCESSORY");
    dboHS_ACCESSORY_VIDEO = new entlogic_dbo("HSBOSS", "HS_ACCESSORY");
	
	// 初始化交互组件
    imgHeadPic = new entlogic_mui_image("imgHeadPic", formControls);    
    
    lstPic = new entlogic_mui_list("lstPic", formControls);
    lstPic.setBindingData(dboHS_ACCESSORY_PIC.dataTable);
    lstPic.itemClick = lstPic_itemClick;
    
    lstVideo = new entlogic_mui_list("lstVideo", formControls);
    lstVideo.setBindingData(dboHS_ACCESSORY_VIDEO.dataTable);
    lstVideo.itemClick = lstVideo_itemClick;
    
    $("#btnBack").click(btnBack_click);
    $("#btnNext").click(btnNext_click);
    
    $("#tabBaseInfo").click(tabBaseInfo_click);
    $("#tabSkillInfo").click(tabSkillInfo_click);
    $("#tabServiceInfo").click(tabServiceInfo_click);
        
    $("#btnGetPhoto").click(btnGetPhoto_click);
    $("#btnTakePhoto").click(btnTakePhoto_click);
    $("#btnGetHeadPicPhoto").click(btnGetHeadPicPhoto_click);
    $("#btnTakeHeadPicPhoto").click(btnTakeHeadPicPhoto_click);
    $("#btnDeleteHeadPic").click(btnDeleteHeadPic_click);
};

// 加载服务人员数据
function loadWorker() {
	// 查询获取数据
    dboHS_WORKER.whereClause = "where OID = '" + workerOid + "'";
    dboHS_WORKER.execQuery();
    var dt = dboHS_WORKER.dataTable;
    if (dt != null && dt.getSize() > 0) {
        var dr = dt.getRecord(0);
        imgHeadPic.setValue(dr.getValue("HEAD_PIC"));
    }
};

// 加载图片
function loadPic() {    
    dboHS_ACCESSORY_PIC.whereClause = "where FILE_TYPE in('jpg','jpeg','png') and BIZ_OID = '" + workerOid + "' ";
	dboHS_ACCESSORY_PIC.orderByClause = " order by SN  ";
	dboHS_ACCESSORY_PIC.execQuery();
    $(".btnDeletePic").click(btnDeletePic_click);
};

// 加载视频
function loadVideo() {    
   	dboHS_ACCESSORY_VIDEO.whereClause = "where FILE_TYPE in('avi','mp4','flv','rmvb','rm','mov') and BIZ_OID = '" + workerOid + "' ";
	dboHS_ACCESSORY_VIDEO.orderByClause = " order by SN  ";
	dboHS_ACCESSORY_VIDEO.execQuery();
    $(".video-box").attr("controls", "controls");
    $(".btnDeleteVideo").click(btnDeleteVideo_click);
};

// 上传图片
function uploadPhoto(data) {
    var dr = dboHS_ACCESSORY_PIC.execCreate();
    var oid = dr.getValue("id");
    
    var imgUrl = uploadFile(applicationRoot, "HSBOSS", oid + ".jpg", data, "");
    if (imgUrl == null) return;

    dr.setItem("OID", oid);
    dr.setItem("BIZ_OID", workerOid);
    dr.setItem("SN", lstPic.getSize() + 1);
    dr.setItem("FILE_TYPE", "jpg");
    dr.setItem("FILE_PATH", imgUrl);
    dboHS_ACCESSORY_PIC.execInsert(dr);
    
    loadPic();
};

// 上传形象照片
function uploadHeadPic(data) {    
    var currentWorker = dboHS_WORKER.dataTable.getRecord(0);
	var path = currentWorker.getValue("HEAD_PIC");
	if (path == "null")
		path = "";
	var imgUrl = uploadFile(applicationRoot, "HSBOSS", workerOid + "_head.jpg",
			data, path);
	if (imgUrl == null)
		return;
	imgHeadPic.setValue(imgUrl);
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
    
    // 接受参数
    workerOid = getUrlParam("workerOid");
	
	// 用户定义初始化
    loadPic();
    loadVideo();	
    loadWorker();
};

// 返回按钮点击事件
function btnBack_click() {
    jumpTo("WorkerForm.html");
};

// 保存按钮单击事件
function btnNext_click() {
     var url = encodeURI("WorkerForm.html");
    jumpTo(url);
};

// 基本信息标签单击事件
function tabBaseInfo_click() {
     var url = encodeURI("WorkerBaseInfoForm.html?workerOid=" + workerOid);
    jumpTo(url);
};

// 工作技能标签单击事件
function tabSkillInfo_click() {
     var url = encodeURI("WorkerSkillInfoForm.html?workerOid=" + workerOid);
    jumpTo(url);
};

// 签约服务标签单击事件
function tabServiceInfo_click() {
     var url = encodeURI("WorkerServiceInfoForm.html?workerOid=" + workerOid);
    jumpTo(url);
};

// 形象照片删除事件
function btnDeleteHeadPic_click() {    
        var dr = dboHS_WORKER.dataTable.getRecord(0);
        if (dr == null) return;
        var path = dr.getValue("HEAD_PIC");
        deleteFile(path);
        dr.setItem("HEAD_PIC", "");
		dboHS_WORKER.execUpdate();
        imgHeadPic.setValue(dr.getValue("HEAD_PIC"));
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

// 图片列表数据项点击事件
function lstVideo_itemClick() {    
    if (lstVideo.itemClickTrigger == "") {
        var dr = dboHS_ACCESSORY_VIDEO.dataTable.getRecord(lstVideo.getSelectedIndex());
        if (dr == null) return;
        var path = dr.getValue("FILE_PATH");
        deleteFile(path);
        dboHS_ACCESSORY_VIDEO.execDelete();
        loadVideo();
    }
};

// 打开相册
function btnGetHeadPicPhoto_click() {            
    device.onPhotoReturn = devHeadPicPhoto_return;
    device.selectPhoto();
};

// 从相册获取图片
function devHeadPicPhoto_return(res) {
	uploadHeadPic(res);
    device.onPhotoReturn = function() {};
};

// 打开相机
function btnTakeHeadPicPhoto_click() {
    device.onCamaraReturn = devHeadPicCamara_return;
    device.openCamara();
};

// 从相册获取图片
function devHeadPicCamara_return(res) {
	uploadHeadPic(res);
    device.onCamaraReturn = function() {};
};
    
// 删除照片
function btnDeletePic_click() {
    lstPic.itemClickTrigger = "btnDeletePic";
};

// 打开相册
function btnGetPhoto_click() {            
    device.onPhotoReturn = devPhoto_return;
    device.selectPhoto();
};

// 从相册获取图片
function devPhoto_return(res) {
	uploadPhoto(res);
    device.onPhotoReturn = function() {};
};

// 打开相机
function btnTakePhoto_click() {
    device.onCamaraReturn = devCamara_return;
    device.openCamara();
};

// 从相册获取图片
function devCamara_return(res) {
	uploadPhoto(res);
    device.onCamaraReturn = function() {};
};
    
// 删除照片
function btnDeletePic_click() {
    lstPic.itemClickTrigger = "btnDeletePic";
};
   
// 删除照片
function btnDeleteVideo_click() {
    lstVideo.itemClickTrigger = "btnDeleteVideo";
}



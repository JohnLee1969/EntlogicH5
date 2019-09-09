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
var dboHS_DIRECTOR = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var imgCertPic = null;
var lkpSex = null;
var txtName = null;
var dtBirthday = null;
var txtCertCode = null;
var lkpNativeArea = null;
var txtAccount = null;
var txtCheckCode = null;
var txtPassword = null;
var txtConfirm = null;
var imgHeadPic = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var enterpriseOid = getUserSessionItem("enterpriseOid");
var directorOid  = getUserSessionItem("directorOid");
var smCheckCode = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	dboHS_DIRECTOR = new entlogic_dbo("HSBOSS", "HS_DIRECTOR");
	
	// 初始化交互组件
    imgCertPic = new entlogic_mui_image("imgCertPic", formControls);
    imgCertPic.setBindingData(dboHS_DIRECTOR.dataTable, "CERT_PIC");
    
    txtName = new entlogic_mui_text("txtName", formControls);
    txtName.setBindingData(dboHS_DIRECTOR.dataTable, "NAME");

    lkpSex = new entlogic_mui_lookup("lkpSex", formControls);
    lkpSex.setBindingData(dboHS_DIRECTOR.dataTable, "SEX", "SEX_TEXT");
    lkpSex.lookupUrl = encodeURI("../entlogicCommon.mob/SysCodeLookup.html?codeTypeOid=SEX&title=选择性别");
    
    dtBirthday = new entlogic_mui_datetime("dtBirthday", formControls);
    dtBirthday.setBindingData(dboHS_DIRECTOR.dataTable, "BIRTHDAY");
    
    txtCertCode = new entlogic_mui_text("txtCertCode", formControls);
    txtCertCode.setBindingData(dboHS_DIRECTOR.dataTable, "CERT_CODE");

    lkpNativeArea = new entlogic_mui_lookup("lkpNativeArea", formControls);
    lkpNativeArea.setBindingData(dboHS_DIRECTOR.dataTable, "NATIVE_AREA", "NATIVE_AREA_TEXT");
    lkpNativeArea.lookupUrl = encodeURI("../entlogicCommon.mob/SysCodeLookup.html?codeTypeOid=CN_AD&title=选择籍贯属地");
        
    txtAccount = new entlogic_mui_text("txtAccount", formControls);
    txtAccount.setBindingData(dboHS_DIRECTOR.dataTable, "ACCOUNT");
    
    txtCheckCode = new entlogic_mui_text("txtCheckCode", formControls);
    btnGetCheckCode = new entlogic_mui_sm_checkcode("btnGetCheckCode", txtAccount);
    btnGetCheckCode.buttonClick = btnGetCheckCode_click;
    
    txtPassword = new entlogic_mui_text("txtPassword", formControls);
    txtPassword.setBindingData(dboHS_DIRECTOR.dataTable, "PASSWORD");
    
    txtConfirm = new entlogic_mui_text("txtConfirm", formControls);
    txtConfirm.setBindingData(dboHS_DIRECTOR.dataTable, "PASSWORD");
    
    imgHeadPic = new entlogic_mui_image("imgHeadPic", formControls);
    imgHeadPic.setBindingData(dboHS_DIRECTOR.dataTable, "HEAD_PIC");

    $("#btnGetCertPic").click(btnGetCertPic_click);
    $("#btnTakeCertPic").click(btnTakeCertPic_click);   
    $("#btnGetHeadPic").click(btnGetHeadPic_click);
    $("#btnTakeHeadPic").click(btnTakeHeadPic_click);   

    
    $("#btnBack").click(btnBack_click);
    $("#btnSave").click(btnSave_click);
};

//加载服务人员数据
function loadData() {
    // 查询获取数据
    if (directorOid == null) {
        var drNew = dboHS_DIRECTOR.execCreate();
        dboHS_DIRECTOR.dataTable.addRecord(drNew);
        dboHS_DIRECTOR.dataTable.setSelectedIndex(0);
    } else {
        dboHS_DIRECTOR.whereClause = "where OID = '" + directorOid + "'";
        dboHS_DIRECTOR.execQuery();
    }
};

// 数据合法性检查
function checkData() {
    // 检查结果
    var result = true;
    var prompt = "错误提示：";
    
    // 检查老师证件为空
    if (imgCertPic.getValue() == "" || imgCertPic.getValue() == "null") {
		prompt += "老师证件图片不能为空！！<br/>";
        result = result & false;
    }

    // 检查老师姓名
    if (txtName.getValue() == "" || txtName.getValue() == "null") {
        prompt += "老师姓名不能为空！！<br/>";
        result = result & false;
    }
    
    // 检查老师证件号为空
    if (txtCertCode.getValue() == "" || txtCertCode.getValue() == "null") {
        prompt += "老师证件号不能为空！！<br/>";
        result = result & false;
    }
    
    // 检查老师籍贯为空
    if (lkpNativeArea.getValue() == "" || lkpNativeArea.getValue() == null) {
        prompt += "老师籍贯不能为空！！<br/>";
        result = result & false;
    }
    
    // 检查老师登录账号为空
    if (txtAccount.getValue() == "" || txtAccount.getValue() == "null") {
        prompt += "老师登录手机号不能为空！！<br/>";
        result = result & false;
    } else {
        var dba = new entlogic_dba("jdbc/entlogic");
        dba.SQL = "select OID from HS_DIRECTOR where ACCOUNT = '" + txtAccount.getValue() + "'";
        var dt = dba.execQuery();
        if (dt != null && dt.getSize() > 1) {
            prompt += "老师登录手机号已被使用过！！<br/>";
            result = result & false;
        }
    }
    
    // 检查验证码
    if (txtPassword.getValue() != txtConfirm.getValue()) {
        prompt += "输入密码与密码确认不一致！！<br/>";
        result = result & false;
    }
  
    // 弹出提示框
    if (!result) popUpMobError("错误提示", prompt);
   
    return result;
};

// 保存服务人员数据
function saveData() {
    // 保存数据
    if (directorOid == null) {
        var drNew = dboHS_DIRECTOR.dataTable.getRecord(0);
        directorOid = drNew.getValue("id")
		drNew.setItem("OID", directorOid);
        drNew.setItem("HS_ENTERPRISE", enterpriseOid);
        dboHS_DIRECTOR.execInsert();
    } else {
        dboHS_DIRECTOR.execUpdate();
    }   
};

// 上传人员证件图片
function uploadCertPic(data) {
    if (directorOid == null) saveData();
     
    var path = imgCertPic.getValue("CERT_PIC");
    if (path == "null") path = "";
    var imgUrl = uploadFile(applicationRoot, "HSBOSS", directorOid + "_C.jpg", data, path);
    if (imgUrl == null) return;
    imgCertPic.setValue(imgUrl);
    
    var result = EntlogicUtilAI.recognizeSFZ(imgUrl);
    var jsonObj = $.parseJSON(result); 
    txtName.setValue(jsonObj["words_result"]["姓名"]["words"]);
    txtCertCode.setValue(jsonObj["words_result"]["公民身份号码"]["words"]);
    var sex = jsonObj["words_result"]["性别"]["words"];
    if (sex == "男") {
        lkpSex.setValue("1");
        lkpSex.setText("男");
    } else {
        lkpSex.setValue("0");
        lkpSex.setText("女");
    }    
    var strDate = jsonObj["words_result"]["出生"]["words"];
   	var birthdayStr = strDate.substring(0, 4) + "-" + strDate.substring(4,6) + "-" + strDate.substring(6,8);
    dtBirthday.setValue(birthdayStr);
    
    dboHS_DIRECTOR.execUpdate();
};

// 上传人员头像图片
function uploadHeadPic(data) {
    if (directorOid == null) saveData();
    
    var path = imgHeadPic.getValue();
    if (path == "null") path = "";
    var imgUrl = uploadFile(applicationRoot, "HSBOSS", directorOid + "_H.jpg", data, path);
    if (imgUrl == null) return;
    imgHeadPic.setValue(imgUrl);
    
    dboHS_DIRECTOR.execUpdate();
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
    
	// 用户定义初始化
	loadData();
};

// 打开相册取证件图片
function btnGetCertPic_click() {
    device.onPhotoReturn = devCertPic_return;
    device.selectPhoto();
};

// 从相册获取证件图片
function devCertPic_return(res) {
	uploadCertPic(res);
    device.onPhotoReturn = function() {};
};

// 打开相机获取证件图片
function btnTakeCertPic_click() {
    device.onPhotoReturn = devCertCamara_return;
    device.openCamara();
};

// 从相相机获取证件图片
function devCertCamara_return(res) {
	uploadCertPic(res);
    device.onPhotoReturn = function() {};
};

// 打开相册取头像图片
function btnGetHeadPic_click() {
    device.onPhotoReturn = devHeadPic_return;
    device.selectPhoto();
};

// 从相册获取头像图片
function devHeadPic_return(res) {
	uploadHeadPic(res);
    device.onPhotoReturn = function() {};
};

// 打开相机获取头像图片
function btnTakeHeadPic_click() {
    device.onPhotoReturn = devHeadCamara_return;
    device.openCamara();
};

// 从相相机获取头像图片
function devHeadCamara_return(res) {
	uploadHeadPic(res);
    device.onPhotoReturn = function() {};
};

// 点击验证码
function btnGetCheckCode_click() {
    txtCheckCode.setValue(btnGetCheckCode.smCheckCode);
}

// 返回按钮点击事件
function btnBack_click() {
    // 返回
    jumpTo("DirectorForm.html");    
};

// 保存按钮点击事件
function btnSave_click() {
    // 保存数据
    saveData();
    
    // 数据检查
    var dr = dboHS_DIRECTOR.dataTable.getRecord(0);
    if (!checkData()) {
        dr.setItem("STATUS", "9");
        dboHS_DIRECTOR.execUpdate();
        return false;
    } else {
        dr.setItem("STATUS", "2");
        dboHS_DIRECTOR.execUpdate();
    }  
    
    // 返回
    jumpTo("DirectorForm.html");    
};





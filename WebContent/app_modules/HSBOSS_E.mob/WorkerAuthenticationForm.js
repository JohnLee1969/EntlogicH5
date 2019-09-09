/////////////////////////////////////////////////////////////////////////////////////////////////
// 应用常量声明

// 应用的根目录
var applicationRoot = getUrlParam("applicationRoot");

//应用的根目录
var sessionId = getUrlParam("sessionId");

//本页面控件容器
var formControls = new Array();


// ///////////////////////////////////////////////////////////////////////////////////////////////
// 数据组件声明
var dboHS_WORKER = null;
var dboHS_WORKER_AUDIT = null;


// ///////////////////////////////////////////////////////////////////////////////////////////////
// 交互组件声明
var imgCert = null;
var txtName = null;
var txtCertCode = null;
var txtMobile = null;
var txtCheckCode = null;
var btnGetCheckCode = null;


// ///////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var device = null;
var enterpriseOid = getUserSessionItem("enterpriseOid");
var directorOid = getUserSessionItem("directorOid");
var workerOid = null;
var workerAuditOid = null;
var sex = "";
var birthday = null;
var nativeAddress = "";


// ///////////////////////////////////////////////////////////////////////////////////////////////
// 内部函数声明

// 组件初始化
function initComponents() {
    // 初始化设备
    device = getDevice();
    
	// 初始化数据组件
	dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
	dboHS_WORKER_AUDIT = new entlogic_dbo("HSBOSS", "HS_WORKER_AUDIT");

	// 初始化交互组件
	imgCert = new entlogic_mui_image("imgCert", formControls);
	imgCert.setBindingData(dboHS_WORKER.dataTable, "CERT_PIC");

	txtName = new entlogic_mui_text("txtName", formControls);
	txtName.setBindingData(dboHS_WORKER.dataTable, "NAME");

	txtCertCode = new entlogic_mui_text("txtCertCode", formControls);
	txtCertCode.setBindingData(dboHS_WORKER.dataTable, "CERT_CODE");

	txtMobile = new entlogic_mui_text("txtMobile", formControls);
	txtMobile.setBindingData(dboHS_WORKER.dataTable, "MOBILE");

	btnGetCheckCode = new entlogic_mui_sm_checkcode("btnGetCheckCode",txtMobile);
	btnGetCheckCode.buttonClick = btnGetCheckCode_click;

	txtCheckCode = new entlogic_mui_text("txtCheckCode", formControls);

	$("#btnGetPhoto").click(btnGetPhoto_click);
	$("#btnTakePhoto").click(btnTakePhoto_click);
	$("#btnBack").click(btnBack_click);
	$("#btnNext").click(btnNext_click);
};

// 加载服务人员数据
function loadData() {
	// 查询获取数据
	dboHS_WORKER.whereClause = "where OID = '" + workerOid + "'";
	dboHS_WORKER.execQuery();
};

// 数据合法性检查
function checkData() {
	var prompt = "";
	var flag = true;

	if (txtName.getValue() === "") {
		prompt += "<br/>请输入姓名!";
		flag = false;
	}
	if (txtCertCode.getValue() === "") {
		prompt += "<br/>请输入身份证号!";
		flag = false;
	} 
    else {
		var dba = new entlogic_dba("jdbc/entlogic");

		dba.SQL = "select OID from HS_WORKER where CERT_CODE = '"
				+ txtCertCode.getValue() + "' and OID != '" + workerOid + "' and STATUS !='9'";
		var dtWorker = dba.execQuery();
		if (dtWorker.getSize() > 0) {
			prompt += "<br/>该身份证号已经存在!";
			flag = false;
		}
	}
	if (txtMobile.getValue() === "") {
		prompt += "<br/>请输入手机号码!";
		flag = false;
	}
    else
    {
        // 检查手机号冲突
        var dba = new entlogic_dba("jdbc/entlogic");
        dba.SQL = "select OID from HS_WORKER where PHONE='" + txtMobile.getValue() + "' and STATUS !='9'";
        var dt = dba.execQuery();
        if (dt != null && dt.getSize() > 0) {
            prompt += "<br/>手机号已被占用！";
            flag = false;
        }
    }
     // 检查验证码
    if (btnGetCheckCode.smCheckCode===""||(txtCheckCode.getValue() != "999999" && txtCheckCode.getValue() != btnGetCheckCode.smCheckCode)) {
        prompt += "<br/>手机验证码输入错误！";
        //flag = false;
    }

	if (!flag)
		popUpMobError("错误提示", prompt);
	return flag;
};

// 保存服务人员数据
function saveData() {
	// 保存数据
    if (workerOid == null) {
        var drNew = dboHS_WORKER.execCreate();
        workerOid = drNew.getValue("id");
        drNew.setItem("OID", workerOid);
        drNew.setItem("STATUS", "9");
        drNew.setItem("HS_ENTERPRISE", enterpriseOid);
        var path = "/app_resources/HSBOSS_E.mob/images/head.jpg";
        var imgUrl = copyFile(applicationRoot, "HSBOSS", workerOid + "_head.jpg", path);
        drNew.setItem("HEAD_PIC", imgUrl);
        if (directorOid != null) drNew.setItem("HS_DIRECTOR", directorOid);
        drNew.setItem("NAME", txtName.getValue());
		drNew.setItem("CERT_CODE", txtCertCode.getValue());
		drNew.setItem("MOBILE", txtMobile.getValue());
        drNew.setItem("SEX", sex);
        if(birthday !== null)
        {
        	drNew.setItem("BIRTHDAY", birthday);
        }

		drNew.setItem("NATIVE_AREA", txtCertCode.getValue().substring(0,4));
        drNew.setItem("NATIVE_ADDRESS", nativeAddress);
        dboHS_WORKER.execInsert(drNew);
        loadData();
    }
    else
    {
		var dr = dboHS_WORKER.dataTable.getRecord(0);
        dr.setItem("SEX", sex);
         if(birthday !== null)
        {
        	dr.setItem("BIRTHDAY", birthday);
        }
 		dr.setItem("NATIVE_AREA", txtCertCode.getValue().substring(0,4));
        dr.setItem("NATIVE_ADDRESS", nativeAddress);
		dboHS_WORKER.execUpdate(dr);
	}
};

function saveAuditData(status1,status2,status3,data)
{
	var drNew = dboHS_WORKER_AUDIT.execCreate();
    workerAuditOid = drNew.getValue("id");
    drNew.setItem("OID", workerAuditOid);
    drNew.setItem("HS_WORKER", workerOid);
    drNew.setItem("PERSON_NAME", txtName.getValue());
	drNew.setItem("CERT_CODE", txtCertCode.getValue());
	drNew.setItem("MOBILE", txtMobile.getValue());
    drNew.setItem("CERT_AUDIT_STA", status1);
	drNew.setItem("MOBILE_AUDIT_STATUS", status2);
    drNew.setItem("CREDIT_AUDIT_STA", status3);
    drNew.setItem("DATA", data);
    dboHS_WORKER_AUDIT.execInsert(drNew);
}

// 上传人员证件图片
function uploadCertPic(data) {
	saveData();

	var currentWorker = dboHS_WORKER.dataTable.getRecord(0);
	var path = currentWorker.getValue("CERT_PIC");
	if (path == "null")
		path = "";
	var imgUrl = uploadFile(applicationRoot, "HSBOSS", workerOid + ".jpg",
			data, path);
	if (imgUrl == null)
		return;
	imgCert.setValue(imgUrl);

	var result = EntlogicUtilAI.recognizeSFZ(imgUrl);
	var jsonObj = $.parseJSON(result);
	txtName.setValue(jsonObj["words_result"]["姓名"]["words"]);
	txtCertCode.setValue(jsonObj["words_result"]["公民身份号码"]["words"]);
	nativeAddress=jsonObj["words_result"]["住址"]["words"];
	var sexText = jsonObj["words_result"]["性别"]["words"];
	if (sexText == "男") {
		sex="1";
	} else {
		sex="0";
	}
	var strDate = jsonObj["words_result"]["出生"]["words"];
	birthday = strDate.substring(0, 4) + "-" + strDate.substring(4, 6)
			+ "-" + strDate.substring(6, 8);
	saveData();
};

// ///////////////////////////////////////////////////////////////////////////////////////////////
// 页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();

	// 用户定义初始化
	workerOid = getUrlParam("workerOid");
	loadData();
};

// 下一步按钮点击事件
function btnNext_click() {
    saveData();
	if(checkData())
    {
        var parameter = new entlogic_data_record();
		parameter.addItem("name", txtName.getValue());
		parameter.addItem("phone", txtMobile.getValue());
		parameter.addItem("certCode", txtCertCode.getValue());
		var dataPackage = postBpService(applicationRoot, "com.entlogic.h5.services.VerificationService", "auditCert", parameter);
		if (dataPackage != null) {
			var result = dataPackage.getReturn("result");
            if(result==="1")
            {
            	saveAuditData(1,1,1,dataPackage.getReturn("userInfo"));
            	var dr = dboHS_WORKER.dataTable.getRecord(0);
                dr.setItem("STATUS", "0");
                if(sex === "")
        		{
                	dr.setItem("SEX", dataPackage.getReturn("sex"));
        		}
                 if(birthday === null)
                {
                    dr.setItem("BIRTHDAY", dataPackage.getReturn("birthday"));
                }
        		dboHS_WORKER.execUpdate(dr);
            }
            else
            {
            	saveAuditData(2,1,2,dataPackage.getReturn("userInfo"));
            }
			var url = encodeURI("WorkerAuthenticationResultForm.html?workerAuditOid="+workerAuditOid+"&workerOid=" + workerOid);
        	jumpTo(url);
		}
	}
};

// 返回按钮点击事件
function btnBack_click() {
    jumpTo("WorkerForm.html");
};

// 打开相册
function btnGetPhoto_click() {
	device.onPhotoReturn = devPhoto_return;
	device.selectPhoto();
};

// 从相册获取图片
function devPhoto_return(res) {
	uploadCertPic(res);
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
	uploadCertPic(res);
	device.onPhotoReturn = function() {
	};
};

// 获取验证码点击事件
function btnGetCheckCode_click() {
	if (txtMobile.getValue() === null || txtMobile.getValue() === "") {
    	popUpMobError("错误提示", "请输入手机号码！！！");
        return false;
    }
    // 检查手机号冲突
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "select OID from HS_WORKER where PHONE='" + txtMobile.getValue() + "' and STATUS !='9'";
    var dt = dba.execQuery();
    if (dt != null && dt.getSize() > 0) {
    	popUpMobError("错误提示", "手机号已被占用！！！");
        return false;
    }
    return true;
};


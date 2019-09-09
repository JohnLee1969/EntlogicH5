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
var dboHS_ENTERPRISE = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var lkpRegionCode = null;
var imgLicencePic = null;
var txtEnterpriseName = null;
var txtCreditCode = null;
var imgLpCertPicA = null;
var imgLpCertPicB = null;
var txtLegalPerson = null;
var txtLpCertCode = null;
var lkpBank = null;
var txtSubbank = null;
var txtBankAccount = null;
var txtInvoiceCode = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var device = null;
var enterpriseOid = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
    // 初始化设备
    device = getDevice();
    
	//初始化数据组件
    dboFW_GROUP = new entlogic_dbo("entlogicSystem", "FW_GROUP");
    dboFW_USER = new entlogic_dbo("entlogicSystem", "FW_USER");    
    dboHS_ENTERPRISE = new entlogic_dbo("HSBOSS", "HS_ENTERPRISE");
	
	// 初始化交互组件
    lkpRegionCode = new entlogic_mui_lookup("lkpRegionCode", formControls);
    lkpRegionCode.setBindingData(dboHS_ENTERPRISE.dataTable, "REGION_CODE", "REGION_CODE_TEXT");
    lkpRegionCode.lookupUrl = encodeURI("../entlogicCommon.mob/SysCodeLookup.html?codeTypeOid=CN_AD&title=选择企业归属地");
    
    imgLicencePic = new entlogic_mui_image("imgLicencePic", formControls);
    imgLicencePic.setBindingData(dboHS_ENTERPRISE.dataTable, "LICENCE_PIC");
    
    txtEnterpriseName = new entlogic_mui_text("txtEnterpriseName", formControls);
    txtEnterpriseName.setBindingData(dboHS_ENTERPRISE.dataTable, "NAME");
     
    txtCreditCode = new entlogic_mui_text("txtCreditCode", formControls);
    txtCreditCode.setBindingData(dboHS_ENTERPRISE.dataTable, "CREDIT_CODE");
    
    lkpMasterType = new entlogic_mui_lookup("lkpMasterType", formControls);
    lkpMasterType.setBindingData(dboHS_ENTERPRISE.dataTable, "MASTER_TYPE", "MASTER_TYPE_TEXT");
    lkpMasterType.lookupUrl = encodeURI("CodeLookup.html?codeTypeOid=ENT_TYP&title=选择企业类型");
    
    imgLpCertPicA = new entlogic_mui_image("imgLpCertPicA", formControls);
    imgLpCertPicA.setBindingData(dboHS_ENTERPRISE.dataTable, "LP_CERT_PIC_A");
     
    imgLpCertPicB = new entlogic_mui_image("imgLpCertPicB", formControls);
    imgLpCertPicB.setBindingData(dboHS_ENTERPRISE.dataTable, "LP_CERT_PIC_B");
   
    txtLegalPerson = new entlogic_mui_text("txtLegalPerson", formControls);
    txtLegalPerson.setBindingData(dboHS_ENTERPRISE.dataTable, "LEGAL_PERSON");
        
    txtLpCertCode = new entlogic_mui_text("txtLpCertCode", formControls);
    txtLpCertCode.setBindingData(dboHS_ENTERPRISE.dataTable, "LP_CERT_CODE");

	lkpBank = new entlogic_mui_lookup("lkpBank", formControls);
	lkpBank.setBindingData(dboHS_WORKER.dataTable, "BANK", "BANK_TEXT");
    lkpBank.lookupUrl = encodeURI("../entlogicCommon.mob/SysCodeLookup.html?codeTypeOid=BANK&title=选择所属银行");

    txtSubbank = new entlogic_mui_text("txtSubbank", formControls);
    txtSubbank.setBindingData(dboHS_ENTERPRISE.dataTable, "SUBBANK");
    
    txtBankAccount = new entlogic_mui_text("txtBankAccount", formControls);
    txtBankAccount.setBindingData(dboHS_ENTERPRISE.dataTable, "BANK_ACCOUNT");
    
    txtInvoiceCode = new entlogic_mui_text("txtInvoiceCode", formControls);
    txtInvoiceCode.setBindingData(dboHS_ENTERPRISE.dataTable, "INVOICE_CODE");
       
    // 重要事件声明
    $("#btnBack").click(btnBack_click);
    $("#btnNext").click(btnNext_click);
      
    $("#btnGetLicencePhoto").click(btnGetLicencePhoto_click);
    $("#btnTakeLicencePhoto").click(btnTakeLicencePhoto_click);
      
    $("#btnGetLpCertPhotoA").click(btnGetLpCertPhotoA_click);
    $("#btnTakeLpCertPhotoA").click(btnTakeLpCertPhotoA_click);
      
    $("#btnGetLpCertPhotoB").click(btnGetLpCertPhotoB_click);
    $("#btnTakeLpCertPhotoB").click(btnTakeLpCertPhotoB_click);
};

//加载服务人员数据
function loadData() {
    // 查询获取数据
	dboHS_ENTERPRISE.whereClause = "where OID = '" + enterpriseOid + "'";
	dboHS_ENTERPRISE.execQuery();
};

// 保存服务人员数据
function saveData() {
    // 保存数据
    dboHS_ENTERPRISE.execUpdate();       
};

// 数据合法性检查
function checkData() {
    // 检查结果
    var result = true;
    var prompt = "错误提示：";
    
    // 检查企业名为空
    if (lkpRegionCode.getValue() == "") {
		prompt += "企业归属地不能为空！！<br/>";
        result = result & false;
    }

    // 检查企业名为空
    if (txtEnterpriseName.getValue() == "") {
        prompt += "企业名称不能为空！！<br/>";
        result = result & false;
    }
    else
    {
        var dba = new entlogic_dba("jdbc/entlogic");

    	dba.SQL = "select OID from HS_ENTERPRISE where NAME = '"+txtEnterpriseName.getValue()+"' and OID != '" +enterpriseOid+ "'";
    	var dtEnterprise = dba.execQuery();
    	if(dtEnterprise.getSize()>0)
        {
            prompt += "企业名称已经存在！！<br/>";
			result = result & false;
        }
    }
    
    // 检查企业编码为空
    if (txtCreditCode.getValue() == "") {
        prompt += "企业社会信用编号不能为空！！<br/>";
        result = result & false;
    }
    else
    {
        var dba = new entlogic_dba("jdbc/entlogic");

    	dba.SQL = "select OID from HS_ENTERPRISE where CREDIT_CODE = '"+txtCreditCode.getValue()+"' and OID != '" +enterpriseOid+ "'";
    	var dtEnterprise = dba.execQuery();
    	if(dtEnterprise.getSize()>0)
        {
            prompt += "企业社会信用编号已经存在！！<br/>";
			result = result & false;
        }
    }
    
    // 检查企业类型为空
    if (lkpMasterType.getValue() == "" || lkpMasterType.getValue() == null) {
        prompt += "企业类型不能为空！！<br/>";
        result = result & false;
    }
    
    // 检查法人为空
    if (txtLegalPerson.getValue() == "") {
        prompt += "法人姓名不能为空！！<br/>";
        result = result & false;
    }
    
    // 检查法人身份证号
    if (txtLpCertCode.getValue() == "") {
        prompt += "法人身份证号不能为空！！<br/>";
        result = result & false;
    }
    // 归属银行检查
    if (lkpBank.getValue() === null || lkpBank.getValue() === "") {
        prompt += "归属银行不能为空！！\n";
        result = result & false;
    }
     
    // 开户银行检查
    if (txtSubbank.getValue() == "") {
        prompt += "开户银行不能为空！！\n";
        result = result & false;
    }
      
    // 银行账户检查
    if (txtBankAccount.getValue() == "") {
        prompt += "银行账户不能为空！！\n";
        result = result & false;
    }
 
    // 弹出提示框
    if (!result) popUpMobError("错误提示", prompt);
    
    return result;
};

// 企业验证
function checkEnterprise() {
    var imgUrl = imgLicencePic.getValue();
    var result = EntlogicUtilAI.recognizeYYZZ(imgUrl);
    var jsonObj = $.parseJSON(result); 
    var eName = jsonObj["words_result"]["单位名称"]["words"];
    var eCode = jsonObj["words_result"]["社会信用代码"]["words"];
    var ePerson = jsonObj["words_result"]["法人"]["words"];
    
    txtEnterpriseName.setValue(eName);
	txtCreditCode.setValue(eCode);
    txtLegalPerson.setValue(ePerson);
};

// 企业法人
function checkPerson() {
    var imgUrl = imgLpCertPicA.getValue();
    var result = EntlogicUtilAI.recognizeSFZ(imgUrl);
    var jsonObj = $.parseJSON(result); 
    var eName = jsonObj["words_result"]["姓名"]["words"];
    var eCode = jsonObj["words_result"]["公民身份号码"]["words"];
    
    txtLegalPerson.setValue(eName);
    txtLpCertCode.setValue(eCode);
};

// 上传企业营业执照副本
function uploadLicencePic(data) {
	if (enterpriseOid == null) saveData();

    var path = imgLicencePic.getValue();
    if (path == "null") path = "";
    var imgUrl = uploadFile(applicationRoot, "HSBOSS", enterpriseOid + ".jpg", data, path);
    imgLicencePic.setValue(imgUrl);
    if (imgUrl == null) return;   
    checkEnterprise();
    saveData();
};

// 上传法人证件图片正面
function uploadLpCertPicA(data) {
	if (enterpriseOid == null) saveData();

    var path = imgLpCertPicA.getValue();
    if (path == "null") path = "";
    var imgUrl = uploadFile(applicationRoot, "HSBOSS", enterpriseOid + "_A.jpg", data, path);
    if (imgUrl == null) return;
    imgLpCertPicA.setValue(imgUrl);
    checkPerson();
    saveData();    
};

// 上传法人证件图片背面
function uploadLpCertPicB(data) {
	if (enterpriseOid == null) saveData();

    var path = imgLpCertPicB.getValue();
    if (path == "null") path = "";
    var imgUrl = uploadFile(applicationRoot, "HSBOSS", enterpriseOid + "_B.jpg", data, path);
    if (imgUrl == null) return;
    imgLpCertPicB.setValue(imgUrl);    
    saveData();
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化
    enterpriseOid = getUrlParam("enterpriseOid");
    loadData();
};

// 返回按钮单击事件
function btnBack_click() {
    if(localStorage.getItem("userName")===null)
    {
        var url = encodeURI("LoginForm.html");
        jumpTo(url);   
    }
    else
    {
        var url = encodeURI("MainForm.html");
        jumpTo(url);   
    }
    
     
};

// 下一步按钮单击事件
function btnNext_click() {        
    // 保存数据
    saveData();
    
    // 数据完整性检查
    if (!checkData()) return false;
    
    // 更新状态
    var dr = dboHS_ENTERPRISE.dataTable.getRecord(0);
    dr.setItem("STATUS", "2");
    dboHS_ENTERPRISE.execUpdate(dr);
    
    // 跳转到下一步
    var url = encodeURI("AuditEnterpriseForm2.html?enterpriseOid=" + enterpriseOid);
    jumpTo(url);
};

// 打开相册获取营业执照图片
function btnGetLicencePhoto_click() {
    device.onPhotoReturn = devLicencePhoto_return;
    device.selectPhoto();
};

// 从相册获取营业执照图片返回
function devLicencePhoto_return(res) {
	uploadLicencePic(res);
    device.onPhotoReturn = function() {};
};

// 打开相机获取营业执照图片
function btnTakeLicencePhoto_click() {
    device.onPhotoReturn = devLicenceCamara_return;
    device.openCamara();
};

// 从相机获取营业执照图片返回
function devLicenceCamara_return(res) {
	uploadLicencePic(res);
    device.onPhotoReturn = function() {};
};

// 打开相册获取身份证图片A
function btnGetLpCertPhotoA_click() {
    device.onPhotoReturn = devLpCertPhotoA_return;
    device.selectPhoto();
};

// 从相册获取身份证图片A返回
function devLpCertPhotoA_return(res) {
	uploadLpCertPicA(res);
    device.onPhotoReturn = function() {};
};

// 打开相机获取身份证图片A
function btnTakeLpCertPhotoA_click() {
    device.onPhotoReturn = devLpCertCamaraA_return;
    device.openCamara();
};

// 从相机获取营身份证图片A返回
function devLpCertCamaraA_return(res) {
	uploadLpCertPicA(res);
    device.onPhotoReturn = function() {};
};


// 打开相册获取身份证图片B
function btnGetLpCertPhotoB_click() {
    device.onPhotoReturn = devLpCertPhotoB_return;
    device.selectPhoto();
};

// 从相册获取身份证图片B返回
function devLpCertPhotoB_return(res) {
	uploadLpCertPicB(res);
    device.onPhotoReturn = function() {};
};

// 打开相机获取身份证图片B
function btnTakeLpCertPhotoB_click() {
    device.onPhotoReturn = devLpCertCamaraB_return;
    device.openCamara();
};

// 从相机获取营身份证图片B返回
function devLpCertCamaraB_return(res) {
	uploadLpCertPicB(res);
    device.onPhotoReturn = function() {};
};


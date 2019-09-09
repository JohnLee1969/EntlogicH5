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


// ///////////////////////////////////////////////////////////////////////////////////////////////
// 交互组件声明
var txtName = null;
var lkpSex = null;
var dtBirthday = null;
var txtCertCode = null;
var lkpEducation = null;
var txtPhone = null;
var lkpMaritalStatus = null;
var lkpReligion = null;
var txtAnimal = null;
var txtAstro = null;
var numHeight = null;
var numWeight = null;
var lkpResidentType = null;
var lkpVehicleType = null;
var lkpNationality = null;
var lkpNation = null;
var lkpNativeArea = null;
var txtNativeAddress = null;
var lkpWorkplaceArea = null;
var txtWorkplaceAddress = null;
var lkpBank = null;
var txtSubbank = null;
var txtBankAccount = null;

// ///////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var workerOid = null;

// ///////////////////////////////////////////////////////////////////////////////////////////////
// 内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
	dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");

	// 初始化交互组件
    txtName = new entlogic_mui_text("txtName", formControls);
	txtName.setBindingData(dboHS_WORKER.dataTable, "NAME");
    
    dtBirthday = new entlogic_mui_date("dtBirthday", formControls);
	dtBirthday.setBindingData(dboHS_WORKER.dataTable, "BIRTHDAY");
    
    txtCertCode = new entlogic_mui_text("txtCertCode", formControls);
	txtCertCode.setBindingData(dboHS_WORKER.dataTable, "CERT_CODE");

	lkpResidentType = new entlogic_mui_lookup("lkpResidentType", formControls);
	lkpResidentType.setBindingData(dboHS_WORKER.dataTable, "RESIDENT_TYPE", "RESIDENT_TYPE_TEXT");

	lkpEducation = new entlogic_mui_lookup("lkpEducation", formControls);
	lkpEducation.setBindingData(dboHS_WORKER.dataTable, "EDUCATION", "EDUCATION_TEXT");

	txtPhone = new entlogic_mui_text("txtPhone", formControls);
	txtPhone.setBindingData(dboHS_WORKER.dataTable, "PHONE");

	lkpVehicleType = new entlogic_mui_lookup("lkpVehicleType", formControls);
	lkpVehicleType.setBindingData(dboHS_WORKER.dataTable, "VEHICLE_TYPE", "VEHICLE_TYPE_TEXT");

	lkpMaritalStatus = new entlogic_mui_lookup("lkpMaritalStatus", formControls);
	lkpMaritalStatus.setBindingData(dboHS_WORKER.dataTable, "MARITAL_STATUS","MARITAL_STATUS_TEXT");

	lkpReligion = new entlogic_mui_lookup("lkpReligion", formControls);
	lkpReligion.setBindingData(dboHS_WORKER.dataTable, "RELIGION", "RELIGION_TEXT");

	txtAstro = new entlogic_mui_text("txtAstro", formControls);
	txtAstro.setEnabled(false);

	txtAnimal = new entlogic_mui_text("txtAnimal", formControls);
	txtAnimal.setEnabled(false);

	numHeight = new entlogic_mui_number("numHeight", formControls);
	numHeight.setBindingData(dboHS_WORKER.dataTable, "HEIGHT");

	numWeight = new entlogic_mui_number("numWeight", formControls);
	numWeight.setBindingData(dboHS_WORKER.dataTable, "WEIGHT");
    
    lkpSex = new entlogic_mui_lookup("lkpSex", formControls);
	lkpSex.setBindingData(dboHS_WORKER.dataTable, "SEX","SEX_TEXT");

	lkpNationality = new entlogic_mui_lookup("lkpNationality", formControls);
	lkpNationality.setBindingData(dboHS_WORKER.dataTable, "NATIONALITY","NATIONALITY_TEXT");
    
    lkpNation = new entlogic_mui_lookup("lkpNation", formControls);
	lkpNation.setBindingData(dboHS_WORKER.dataTable, "NATION","NATION_TEXT");

	lkpNativeArea = new entlogic_mui_lookup("lkpNativeArea", formControls);
	lkpNativeArea.setBindingData(dboHS_WORKER.dataTable, "NATIVE_AREA", "NATIVE_AREA_TEXT");

	txtNativeAddress = new entlogic_mui_text("txtNativeAddress", formControls);
	txtNativeAddress.setBindingData(dboHS_WORKER.dataTable, "NATIVE_ADDRESS");

	lkpWorkplaceArea = new entlogic_mui_lookup("lkpWorkplaceArea", formControls);
	lkpWorkplaceArea.setBindingData(dboHS_WORKER.dataTable, "WORKPLACE_AREA","WORKPLACE_AREA_TEXT");

	txtWorkplaceAddress = new entlogic_mui_text("txtWorkplaceAddress",formControls);
	txtWorkplaceAddress.setBindingData(dboHS_WORKER.dataTable,"WORKPLACE_ADDRESS");

	lkpBank = new entlogic_mui_lookup("lkpBank", formControls);
	lkpBank.setBindingData(dboHS_WORKER.dataTable, "BANK", "BANK_TEXT");

	txtSubbank = new entlogic_mui_text("txtSubbank", formControls);
	txtSubbank.setBindingData(dboHS_WORKER.dataTable, "SUBBANK");

	txtBankAccount = new entlogic_mui_text("txtBankAccount", formControls);
	txtBankAccount.setBindingData(dboHS_WORKER.dataTable, "BANK_ACCOUNT");
    
    $("#btnBack").click(btnBack_click);
    $("#btnSave").click(btnSave_click);
    $("#btnNext").click(btnNext_click);
    
    $("#tabSkillInfo").click(tabSkillInfo_click);
    $("#tabServiceInfo").click(tabServiceInfo_click);
    $("#tabMediaInfo").click(tabMediaInfo_click);
};

// 加载服务人员数据
function loadData() {
	// 查询获取数据
    dboHS_WORKER.whereClause = "where OID = '" + workerOid + "'";
    dboHS_WORKER.execQuery();
    var dt = dboHS_WORKER.dataTable;
    if (dt != null && dt.getSize() > 0) {
        var dr = dt.getRecord(0);
        var birthday = dr.getValue("BIRTHDAY");
        txtAstro.setValue(EntlogicUtilCalendar.getAstro(birthday));
        txtAnimal.setValue(EntlogicUtilCalendar.getAnimal(birthday));

        loadLookupUrl();
    }
};

function loadLookupUrl()
{
    lkpSex.lookupUrl = encodeURI("../entlogicCommon.mob/SysCodeLookup.html?codeTypeOid=SEX&codeOid="+lkpSex.getValue()+"&title=选择性别");
    lkpEducation.lookupUrl = encodeURI("../entlogicCommon.mob/SysCodeLookup.html?codeTypeOid=EDU&codeOid="+lkpEducation.getValue()+"&title=选择学历");
    lkpResidentType.lookupUrl = encodeURI("CodeLookup.html?codeTypeOid=RSD_TYP&codeOid="+lkpResidentType.getValue()+"&title=选择户口性质");
    lkpVehicleType.lookupUrl = encodeURI("CodeLookup.html?codeTypeOid=WKR_VEH&codeOid="+lkpVehicleType.getValue()+"&title=选择交通工具");
    lkpNationality.lookupUrl = encodeURI("../entlogicCommon.mob/SysCodeLookup.html?codeTypeOid=NC&codeOid="+lkpNationality.getValue()+"&title=选择国籍");
    lkpNativeArea.lookupUrl = encodeURI("../entlogicCommon.mob/SysCodeLookup.html?codeTypeOid=CN_AD&codeOid="+lkpNativeArea.getValue()+"&title=选择籍贯属地");
    lkpWorkplaceArea.lookupUrl = encodeURI("../entlogicCommon.mob/SysCodeLookup.html?codeTypeOid=CN_AD&codeOid="+lkpWorkplaceArea.getValue()+"&title=选择居住地区");
    lkpMaritalStatus.lookupUrl = encodeURI("CodeLookup.html?codeTypeOid=WKR_MRS&codeOid="+lkpMaritalStatus.getValue()+"&title=选择婚姻状况");
    lkpReligion.lookupUrl = encodeURI("../entlogicCommon.mob/SysCodeLookup.html?codeTypeOid=PLG&codeOid="+lkpReligion.getValue()+"&title=选择宗教信仰");
    lkpBank.lookupUrl = encodeURI("../entlogicCommon.mob/SysCodeLookup.html?codeTypeOid=BANK&codeOid="+lkpBank.getValue()+"&title=选择所属银行");
    lkpNation.lookupUrl = encodeURI("../entlogicCommon.mob/SysCodeLookup.html?codeTypeOid=PNC&codeOid="+lkpNation.getValue()+"&title=选择民族");
}

// 数据合法性检查
function checkData() {
    var prompt = "";
	var flag = true;
    
	if (lkpEducation.getValue() === null || lkpEducation.getValue() === "") {
        prompt += "<br/>请选择最高学历!";
		flag = false;
	} 
	if (txtPhone.getValue() == "") {
        prompt += "<br/>请输入紧急电话!";
		flag = false;
	}
	if (lkpVehicleType.getValue() === null || lkpVehicleType.getValue() === "") {
        prompt += "<br/>请选择交通工具!";
		flag = false;
	} 
	if (lkpResidentType.getValue() === null || lkpResidentType.getValue() === "") {
        prompt += "<br/>请选择户口性质!";
		flag = false;
	}
	if (lkpMaritalStatus.getValue() === null || lkpMaritalStatus.getValue() === "") {
        prompt += "<br/>请选择婚姻状况!";
		flag = false;
	}
	if (lkpReligion.getValue() === null || lkpReligion.getValue() === "") {
        prompt += "<br/>请选择宗教信仰!";
		flag = false;
	}
	if (numHeight.getValue() === "0") {
        prompt += "<br/>请输入身高!";
		flag = false;
	}
	if (numWeight.getValue() === "0") {
        prompt += "<br/>请输入体重!";
		flag = false;
	}
	if (lkpSex.getValue() === null || lkpSex.getValue() === "") {
        prompt += "<br/>请选择性别!";
		flag = false;
	}
	if (lkpNationality.getValue() === null || lkpNationality.getValue() === "") {
        prompt += "<br/>请选择籍贯!";
		flag = false;
	}
	if (lkpNation.getValue() === null || lkpNation.getValue() === "") {
        prompt += "<br/>请选择民族!";
		flag = false;
	}
	if (lkpNativeArea.getValue() === null || lkpNativeArea.getValue() === "") {
        prompt += "<br/>请选择户口地址!";
		flag = false;
	}
	if (txtNativeAddress.getValue() === "") {
        prompt += "<br/>请输入户口地址门牌号!";
		flag = false;
	}
	if (lkpWorkplaceArea.getValue() === null || lkpWorkplaceArea.getValue() === "") {
        prompt += "<br/>请选择居住地址!";
		flag = false;
	}
	if (txtWorkplaceAddress.getValue() === "") {
        prompt += "<br/>请输入居住地址门牌号!";
		flag = false;
	}
	if (lkpBank.getValue() === null || lkpBank.getValue() === "") {
        prompt += "<br/>请输入所属银行!";
		flag = false;
	}
	if (txtSubbank.getValue() === "") {
        prompt += "<br/>请输入开户银行!";
		flag = false;
	}
	if (txtBankAccount.getValue() === "") {
        prompt += "<br/>请输入银行卡号!";
		flag = false;
	}
    
    if (!flag) popUpMobError("错误提示", prompt);
	return flag;
};

// ///////////////////////////////////////////////////////////////////////////////////////////////
// 页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();

	// 用户定义初始化
	// 接受传递参数
	workerOid = getUrlParam("workerOid");
	loadData();
};

// 返回按钮点击事件
function btnBack_click() {
    jumpTo("WorkerForm.html");
};

// 保存按钮单击事件
function btnSave_click() {
    // 保存数据
	var dr = dboHS_WORKER.dataTable.getRecord(0);
	dboHS_WORKER.execUpdate();
    loadLookupUrl();
    if(checkData())
    {
    	popUpMobMessage("数据保存成功！","&#xe656;");
    }
};

// 保存按钮单击事件
function btnNext_click() {
    var dr = dboHS_WORKER.dataTable.getRecord(0);
	dboHS_WORKER.execUpdate();
     var url = encodeURI("WorkerSkillInfoForm.html?workerOid=" + workerOid);
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

// 照片视频标签单击事件
function tabMediaInfo_click() {
     var url = encodeURI("WorkerMediaInfoForm.html?workerOid=" + workerOid);
    jumpTo(url);
};



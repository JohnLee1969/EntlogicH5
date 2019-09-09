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
var dtSex = null;
var dtAge = null;
var dtWorkingYears = null;
var dtLanguage = null;
var dtSkill = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var txtCertCode = null;
var txtName = null;
var lstSex = null;
var lstAge = null;
var lstWorkingYears = null;
var lstLanguage = null;
var lstSkill = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明

 
/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	// 初始化数据组件
    dtSex = new entlogic_data_table();
    dtAge = new entlogic_data_table();
    dtWorkingYears = new entlogic_data_table();
    dtLanguage = new entlogic_data_table();
    dtSkill = new entlogic_data_table();
   
	// 初始化交互组件
    txtCertCode = new entlogic_ui_text("txtCertCode", formControls);
    
    txtName = new entlogic_ui_text("txtName", formControls);
    
    lstSex = new entlogic_ui_list("lstSex", formControls);
    lstSex.setRadioBoxMode(true);
    lstSex.setBindingData(dtSex);
    
    lstAge = new entlogic_ui_list("lstAge", formControls);
    lstAge.setRadioBoxMode(true);
    lstAge.setBindingData(dtAge);
    
    lstWorkingYears = new entlogic_ui_list("lstWorkingYears", formControls);
    lstWorkingYears.setRadioBoxMode(true);
    lstWorkingYears.setBindingData(dtWorkingYears);
    
    lstLanguage = new entlogic_ui_list("lstLanguage", formControls);
    lstLanguage.setMultiselected(true);
    lstLanguage.setBindingData(dtLanguage);
    
    lstSkill = new entlogic_ui_list("lstSkill", formControls);
    lstSkill.setMultiselected(true);
    lstSkill.setBindingData(dtSkill);
   
    $("#btnSearch").click(btnSearch_click);
    $("#btnClose").click(btnClose_click);
};

// 加载常量数据
function loadConsts() {
    var dr = new entlogic_data_record();
    dr.addItem("id", "-1");
    dr.addItem("text", "全部");
    dtSex.addRecord(dr);
    dr = new entlogic_data_record();
    dr.addItem("id", "1");
    dr.addItem("text", "男");
    dtSex.addRecord(dr);
    dr = new entlogic_data_record();
    dr.addItem("id", "0");
    dr.addItem("text", "女");
    dtSex.addRecord(dr);
    dtSex.synchronizeLayout(false);
    
    dr = new entlogic_data_record();
    dr.addItem("id", "0,100");
    dr.addItem("text", "不限");
    dtAge.addRecord(dr);
	dr = new entlogic_data_record();
    dr.addItem("id", "0,20");
    dr.addItem("text", "20岁以下");
    dtAge.addRecord(dr);
	dr = new entlogic_data_record();
    dr.addItem("id", "21,30");
    dr.addItem("text", "21-30岁");
    dtAge.addRecord(dr);
	dr = new entlogic_data_record();
    dr.addItem("id", "31,40");
    dr.addItem("text", "31-40岁");
    dtAge.addRecord(dr);
	dr = new entlogic_data_record();
    dr.addItem("id", "41,50");
    dr.addItem("text", "41-50岁");
    dtAge.addRecord(dr);
	dr = new entlogic_data_record();
    dr.addItem("id", "51,100");
    dr.addItem("text", "50岁以上");
    dtAge.addRecord(dr);
    dtAge.synchronizeLayout();
    
    dr = new entlogic_data_record();
    dr.addItem("id", "0,100");
    dr.addItem("text", "不限");
    dtWorkingYears.addRecord(dr);
	dr = new entlogic_data_record();
    dr.addItem("id", "0,5");
    dr.addItem("text", "5年以下");
    dtWorkingYears.addRecord(dr);
	dr = new entlogic_data_record();
    dr.addItem("id", "6,10");
    dr.addItem("text", "6-10年");
    dtWorkingYears.addRecord(dr);
	dr = new entlogic_data_record();
    dr.addItem("id", "11,15");
    dr.addItem("text", "11-15年");
    dtWorkingYears.addRecord(dr);
	dr = new entlogic_data_record();
    dr.addItem("id", "16,20");
    dr.addItem("text", "16-20年");
    dtWorkingYears.addRecord(dr);
	dr = new entlogic_data_record();
    dr.addItem("id", "21,100");
    dr.addItem("text", "20年以上");
    dtWorkingYears.addRecord(dr);
    dtWorkingYears.synchronizeLayout();
    
    var dba = new entlogic_dba("jdbc/entlogic");
    dba.SQL = "select CODE as id, CODE_NAME as text from HS_CODE where HS_CODE_TYPE = 'WKR_LAN' order by ORDER_CODE";
    dtLanguage.loadXML(dba.execQuery().toXML());
    dtLanguage.synchronizeLayout();
    
    dba.SQL = "select CODE as id, CODE_NAME as text from HS_CODE where HS_CODE_TYPE = 'WKR_SKL' order by ORDER_CODE";
    dtSkill.loadXML(dba.execQuery().toXML());
    dtSkill.synchronizeLayout();
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
    initKeys();
	initComponents();
	
	// 用户定义初始化
	loadConsts();
};

// 执行搜索
function btnSearch_click() {
    var whereClause = "where 1=1 ";
    
    if (txtCertCode.getValue() != "") {
        whereClause += "and CERT_CODE='" + txtCertCode.getValue() + "'";
    }
    
    if (txtName.getValue() != "") {
        whereClause += "and NAME='" + txtName.getValue() + "'";
    }
     
    if (lstSex.getValue() != "-1") {
        whereClause += "and SEX='" + lstSex.getValue() + "'";
    }
   
    var age = lstAge.getValue();
    if (age != "0,100") {
        var a = age.split(",");
        whereClause += "and dbo.fwGetAge(BIRTHDAY, getDate()) between " + a[0] + " and " + a[1] + " ";
    }
   
    var workingYears = lstWorkingYears.getValue();
    if (workingYears != "0,100") {
        var a = workingYears.split(",");
        whereClause += "and dateName(year,getDate())-FROM_START_YEAR between " + a[0] + " and " + a[1] + " ";
    }
    
    var languages = lstLanguage.getValues();
    for (var i = 0; i < languages.length; i++) {
        whereClause += "and LANGUAGE like '%" + languages[i] + "%' ";
    }
    
    var skills = lstSkill.getValues();
    for (var i = 0; i < skills.length; i++) {
        whereClause += "and SKILL like '%" + skills[i] + "%' ";
    }

    parent.loadWorkers(whereClause);
};

// 关闭搜索
function btnClose_click() {
    parent.WorkSearch_close();
};

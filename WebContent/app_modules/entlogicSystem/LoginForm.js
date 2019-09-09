/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据声明    

// 全局应用
var application = parent.application;

// 应用的根目录
var applicationRoot = parent.applicationRoot;

//应用的根目录
var sessionId = parent.sessionId;

// 页面控件容器
var formControls = new Array();


/////////////////////////////////////////////////////////////////////////////////////////////////
//  数据声明    
var dboFW_PARAMETER = null;
var dboFW_GROUP = null;
var dboFW_USER = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  组件声明
var txtUserName = null;
var txtPassword = null;
var txtCheckCode = null;
var imgCheckCode = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//私有变量声明   
var checkCode = "";


/////////////////////////////////////////////////////////////////////////////////////////////////
//内部函数声明

/**
 * 初始化組件
 */
function initComponents() {
	//初始化数据
	dboFW_PARAMETER = new entlogic_dbo("entlogicSystem", "FW_PARAMETER");
	dboFW_GROUP = new entlogic_dbo("entlogicSystem", "FW_GROUP");
	dboFW_USER = new entlogic_dbo("entlogicSystem", "FW_USER");
	
	// 初始化组件
	txtUserName = new entlogic_ui_text("txtUserName", formControls);
	txtPassword = new entlogic_ui_text("txtPassword", formControls);
	txtCheckCode = new entlogic_ui_text("txtCheckCode", formControls);
	imgCheckCode = new entlogic_ui_image("imgCheckCode", formControls);
	
	$("#btnGetCheckCode").click(btnGetCheckCode_onClick);
	$("#btnLogin").click(btnLogin_onClick);
    OK = btnLogin_onClick;    
};

/**
 * 加载系统参数
 */
function loadParameter() {
	dboFW_PARAMETER.orderByClause = "order by ORDER_CODE";
	dboFW_PARAMETER.execQuery();
	var appName = dboFW_PARAMETER.dataTable.getRecord(0).getValue("PARAM_VALUE");
	var appNameEn = dboFW_PARAMETER.dataTable.getRecord(1).getValue("PARAM_VALUE");
	
	$("#divAppName").html(appName);
	$("#divAppNameEn").html(appNameEn);
};


/////////////////////////////////////////////////////////////////////////////////////////////////
//页面事件响应

/**
 * 页面打开事件响应
 */
function bodyOnload() {
    initKeys();
	initComponents();
	
	loadParameter();
    imgCheckCode.setValue(getCheckCodeImage());  
};

/**
 * 菜单树控件节点单击事件响应
 */
function btnLogin_onClick() {
    var b = login("jdbc/entlogic", "FW_USER", "USER_NAME", "PASSWORD",  txtUserName.getValue(), txtPassword.getValue(), txtCheckCode.getValue());
    if (b) {
        // 获取用户数据
        var userOid = getUserSessionItem("userOid");
        var user = dboFW_USER.getByOid(userOid);
        
        // 保存当前用户组OID
        var groupOid = user.getValue("GROUP_OID");
        setUserSessionItem("groupOid", groupOid);
        
         // 保存当前用户组织OID
        var orgOid = groupOid;
        var group = dboFW_GROUP.getByOid(orgOid);
        var parentOid = group.getValue("PARENT_OID");
        while(parentOid != "-") {
            orgOid = parentOid;
            group = dboFW_GROUP.getByOid(orgOid);
            parentOid = group.getValue("PARENT_OID");
        }
        setUserSessionItem("orgOid", orgOid);
       
        // 跳转至主页面
         jumpTo("MainForm.html");
    }
};

// 重新获取验证码
function btnGetCheckCode_onClick() {
    imgCheckCode.setValue(getCheckCodeImage());
};


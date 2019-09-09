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
var lstDirector = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var enterpriseOid = getUserSessionItem("enterpriseOid");
var directorOid = getUserSessionItem("directorOid");


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
	 dboHS_DIRECTOR = new entlogic_dbo("HSBOSS", "HS_DIRECTOR");
	
	// 初始化交互组件   
    lstDirector = new entlogic_mui_list("lstDirector", formControls);
    lstDirector.setBindingData(dboHS_DIRECTOR.dataTable);
    lstDirector.itemClick = lstDirector_itemClick;
    
	// 初始化交互组件
    $("#btnBack").click(btnBack_click);
    $("#btnAdd").click(btnAdd_click);
};

// 加载工作人员列表数据
function loadDirectors(whereClause) {
	dboHS_DIRECTOR.whereClause = "where HS_ENTERPRISE = '" + enterpriseOid + "' ";
    dboHS_DIRECTOR.orderByClause = "order by CREATE_TIME desc";
    dboHS_DIRECTOR.execQuery();
    if (lstDirector.getSize() > 0) {
        $(".btnTel").click(btnTel_click);
        if (directorOid != null) 
            $(".btnEdit").hide();
        else
    		$(".btnEdit").click(btnEdit_click);
        lstDirector.setSelectedIndex(0);
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
    // 调用组件初始化
	initComponents();
	
	// 用户定义初始化
	loadDirectors("");
};

// 客户单击事件响应
function btnBack_click() {
    jumpTo("MainForm.html");
	return;
};

// 阿姨列表项点击事件
function lstDirector_itemClick() {
    var directorOid = lstDirector.getValue();
    if (lstDirector.itemClickTrigger == "btnTel"){
        var dr = dboHS_DIRECTOR.dataTable.getRecord(lstDirector.getSelectedIndex());
        var mobile = dr.getValue("ACCOUNT");
    	device.openCall(mobile);
    } else if (lstDirector.itemClickTrigger == "btnEdit"){
        var url = encodeURI("DirectorEditForm.html?directorOid=" + directorOid);
    	jumpTo(url);
    } else {
        var url = encodeURI("DirectorDetailForm.html?directorOid=" + directorOid);
        jumpTo(url);
    }
    lstDirector.itemClickTrigger = "";
};

// 添加服务人员数据
function btnAdd_click() {
	jumpTo("DirectorEditForm.html");
	return;
};

// 编辑服务人员数据
function btnEdit_click() {
    lstDirector.itemClickTrigger = "btnEdit";
};

// 拨打服务人员电话
function btnTel_click() {
    lstDirector.itemClickTrigger = "btnTel";
};

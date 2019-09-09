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
var dboHS_WORKER_AUDIT = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  交互组件声明   
var imgHead = null;
var lblName = null;
var lblTime = null;
var lblCertCode = null;
var imgCertResult = null;
var lblCertResult = null;
var lblCertResultText = null;
var lblCertInfo = null;
var imgCreditResult = null;
var lblCreditResult = null;
var lblCreditResultText = null;
var imgPhoneResult = null;
var lblPhoneResult = null;
var lblPhoneResultText = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
// 内部变量声明
var workerOid = null;
var workerAuditOid = null;
var status = null;


/////////////////////////////////////////////////////////////////////////////////////////////////
//  内部函数声明

// 组件初始化
function initComponents() {
	//初始化数据组件
    dboHS_WORKER = new entlogic_dbo("HSBOSS", "HS_WORKER");
	dboHS_WORKER_AUDIT = new entlogic_dbo("HSBOSS", "HS_WORKER_AUDIT");
	
	// 初始化交互组件
    imgHead = new entlogic_mui_image("imgHead", formControls);
	imgHead.setBindingData(dboHS_WORKER.dataTable, "HEAD_PIC");
    
	lblName = new entlogic_mui_output("lblName", formControls);
	lblName.setBindingData(dboHS_WORKER_AUDIT.dataTable, "PERSON_NAME");
    
	lblTime = new entlogic_mui_output("lblTime", formControls);
    
	lblCertCode = new entlogic_mui_output("lblCertCode", formControls);
	lblCertCode.setBindingData(dboHS_WORKER_AUDIT.dataTable, "CERT_CODE");

	imgCertResult = new entlogic_mui_image("imgCertResult", formControls);
	lblCertResult = new entlogic_mui_output("lblCertResult", formControls);
	lblCertResultText = new entlogic_mui_output("lblCertResultText", formControls);
	lblCertInfo = new entlogic_mui_output("lblCertInfo", formControls);

	imgCreditResult = new entlogic_mui_image("imgCreditResult", formControls);
	lblCreditResult = new entlogic_mui_output("lblCreditResult", formControls);
	lblCreditResultText = new entlogic_mui_output("lblCreditResultText", formControls);

	imgPhoneResult = new entlogic_mui_image("imgPhoneResult", formControls);
	lblPhoneResult = new entlogic_mui_output("lblPhoneResult", formControls);
	lblPhoneResultText = new entlogic_mui_output("lblPhoneResultText", formControls);
    
    $("#btnBack").click(btnBack_click);
    $("#btnNext").click(btnNext_click);
};


// 加载服务人员数据
function loadData() {
	// 查询获取数据
	dboHS_WORKER.whereClause = "where OID = '" + workerOid + "'";
	dboHS_WORKER.execQuery();
    var dtWorker = dboHS_WORKER.dataTable;
    if(dtWorker.getSize()>0)
    {
        var dr=dtWorker.getRecord(0);
        status = dr.getValue("STATUS");
        if(status==='9')
        {
        	$("#btnNext").removeClass("hsboss-background-color-blue");
        	$("#btnNext").addClass("hsboss-background-color-orange");
        	$("#btnNext").html("验证失败，无法建卡立档");
        }
    }
    // 查询获取数据
	dboHS_WORKER_AUDIT.whereClause = "where OID = '" + workerAuditOid + "' ";
	dboHS_WORKER_AUDIT.execQuery();
    var dtWorkerAudit = dboHS_WORKER_AUDIT.dataTable;
    if(dtWorkerAudit.getSize()>0)
    {
        var drWorkerAudit=dtWorkerAudit.getRecord(0);
        var time = drWorkerAudit.getValue("CREATE_TIME");
        lblTime.setValue(time.substring(5,16));
        lblCertInfo.setValue(drWorkerAudit.getValue("DATA"));
        getResultImg(drWorkerAudit.getValue("CERT_AUDIT_STA"),imgCertResult,lblCertResult,lblCertResultText,"查询结果一致","查询结果不一致");
        getResultImg(drWorkerAudit.getValue("MOBILE_AUDIT_STATUS"),imgCreditResult,lblCreditResult,lblCreditResultText,"无失信记录","有失信记录");
        getResultImg(drWorkerAudit.getValue("CREDIT_AUDIT_STA"),imgPhoneResult,lblPhoneResult,lblPhoneResultText,"查询结果一致","查询结果不一致");
    }
};

function getResultImg(result,imgResult,lblResult,lblResultText,successText,faildText)
{
    if(result==="1")
    {
        imgResult.setValue("/app_resources/HSBOSS_E.mob/images/verify-success.png");
        lblResult.setValue("验证成功");
        $("#"+lblResult.id).addClass("hsboss-color-green");
        lblResultText.setValue(successText);
        $("#"+lblCertInfo.id).addClass("hsboss-color-green");
    }
    else
    {
        imgResult.setValue("/app_resources/HSBOSS_E.mob/images/verify-exception.png");
        lblResult.setValue("验证异常");
        $("#"+lblResult.id).addClass("hsboss-color-orage");
        lblResultText.setValue(faildText);
        $("#"+lblCertInfo.id).addClass("hsboss-color-orage");
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////
//  页面事件响应

// 组件事件响应
function bodyOnload() {
	// 调用组件初始化
	initComponents();
	
	// 用户定义初始化
	// 接受传递参数
	workerOid = getUrlParam("workerOid");
    workerAuditOid = getUrlParam("workerAuditOid");
	loadData();
};


function btnBack_click() {
    var url = encodeURI("WorkerAuthenticationForm.html?workerOid=" + workerOid);
    jumpTo(url);
};


function btnNext_click() {
	if(status==='9')
    {
		var url = encodeURI("WorkerAuthenticationForm.html?workerOid=" + workerOid);
	    jumpTo(url);
    }
	else
	{
		var url = encodeURI("WorkerEditForm.html?workerOid=" + workerOid);
	    jumpTo(url);
	}
};


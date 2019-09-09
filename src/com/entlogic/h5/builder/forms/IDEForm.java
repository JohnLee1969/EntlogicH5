package com.entlogic.h5.builder.forms;

import java.io.File;
import java.util.Arrays;

import com.entlogic.h5.Application;
import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.builder.Coders.CoderHtml;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;
import com.entlogic.h5.db.BD_MODULE;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;
import com.entlogic.h5.utils.FileUtils;
import com.entlogic.h5.utils.FileComparator;

/**
 * TITLE : 主桌面
 * 
 * @author LIJING
 * 
 */
public class IDEForm
{
	@BpCommand(registedName = "加载应用模块", logged = false)
	public static DataPackage loadApps(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String userOid = parameters.getValue("userOid");
			
			DataTable dtModules = new DataTable();
			dtModules.id = "dtModules";
		
			String contextRealPath = Application.getParameter("ContextRealPath");
			File appRoot = new File(contextRealPath + "app_modules");
			File[] appDirectorys = appRoot.listFiles();
			Arrays.sort(appDirectorys, new FileComparator());
			File appDirectory;
			File[] formHtmls;
			File formHtml;
			DataRecord dr;
			String moduleOid = "";
			String[] moduleStatus = null;
			for(int i = 0; i < appDirectorys.length; i++)
			{
				appDirectory = appDirectorys[i];
				dr = new DataRecord();
				dr.addData("id",appDirectory.getName());
				dr.addData("lv", "0");
				dr.addData("text", appDirectory.getName());
				dr.addData("icon", "&#xe64b;");
				dr.addData("appName", appDirectory.getName());
				dr.addData("formName", "*");
				
				moduleOid = appDirectory.getName() + "_*";
				moduleStatus = BD_MODULE.getStatus(moduleOid, userOid);
				if (moduleStatus == null) 
				{
					BD_MODULE.add(moduleOid, userOid);
					moduleStatus = BD_MODULE.getStatus(moduleOid, userOid);
				}
				
				dr.addData("status", moduleStatus[0]);
				dr.addData("user", moduleStatus[1]);
				dr.addData("mark", moduleStatus[2]);
				dtModules.addRecord(dr);
				
				formHtmls = appDirectory.listFiles();
				if(formHtmls == null) continue;
				
				Arrays.sort(formHtmls, new FileComparator());
				for (int j = 0; j < formHtmls.length; j++)
				{
					formHtml = formHtmls[j];
					if (formHtml.getName().indexOf(".js") >= 0)
					{
						moduleOid = appDirectory.getName() + "_" +  formHtml.getName().replaceAll(".js", "");
						dr = new DataRecord();
						dr.addData("id", moduleOid);
						dr.addData("lv", "1");
						dr.addData("text", formHtml.getName().replaceAll(".js", ""));
						dr.addData("icon", "&#xe616;");
						dr.addData("appName", appDirectory.getName());
						dr.addData("formName", formHtml.getName().replaceAll(".js", ""));
						
						moduleStatus = BD_MODULE.getStatus(moduleOid, userOid);
						if (moduleStatus == null) 
						{
							BD_MODULE.add(moduleOid, userOid);
							moduleStatus = BD_MODULE.getStatus(moduleOid, userOid);
						}
						
						dr.addData("status", moduleStatus[0]);
						dr.addData("user", moduleStatus[1]);
						dr.addData("mark", moduleStatus[2]);
						dtModules.addRecord(dr);
					}
				}				
			}
			
			dpOut.addDataTable(dtModules);
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage",e.getMessage());
				dpOut.addReturn("result", "faild");
				
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}

	@BpCommand(registedName = "删除应用模块", logged = false)
	public static DataPackage deleteApp(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String appName = parameters.getValue("appName");
			
			String contextRealPath = Application.getParameter("ContextRealPath");
			String filePath;
			File f;
			
			filePath = contextRealPath + "app_modules/" + appName;
			f = new File(filePath);
			File[] fs = f.listFiles();
			String moduleOid = "";
			for (int i = 0; i < fs.length; i++)
			{
				moduleOid = f.getName() + "_" +  fs[i].getName().replaceAll(".js", "");
				BD_MODULE.delete(moduleOid);
			}				
			FileUtils.deleteFile(f);
			
			filePath = contextRealPath + "app_resources/" + appName;
			f = new File(filePath);
			FileUtils.deleteFile(f);
			
			filePath = contextRealPath + "app_data/" + appName;
			f = new File(filePath);
			FileUtils.deleteFile(f);
			
			filePath = contextRealPath + "app_dbos/" + appName;
			f = new File(filePath);
			FileUtils.deleteFile(f);
			
			BD_MODULE.delete(appName + "_*");
			
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage",e.getMessage());
				dpOut.addReturn("result", "faild");
				
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}
	
	@BpCommand(registedName = "删除应用页面", logged = false)
	public static DataPackage deleteForm(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String appName = parameters.getValue("appName");
			String formName = parameters.getValue("formName");

			String contextRealPath = Application.getParameter("ContextRealPath");
			String filePath;
			File f;
			
			filePath = contextRealPath + "app_modules/" + appName + "/" + formName + ".html";
			f = new File(filePath);
			if (f.exists()) FileUtils.deleteFile(f);
			
			filePath = contextRealPath + "app_modules/" + appName + "/" + formName + "_D.html";
			f = new File(filePath);
			if (f.exists()) FileUtils.deleteFile(f);
			
			filePath = contextRealPath + "app_modules/" + appName + "/" + formName + ".css";
			f = new File(filePath);
			if (f.exists()) FileUtils.deleteFile(f);
			
			filePath = contextRealPath + "app_modules/" + appName + "/" + formName + ".js";
			f = new File(filePath);
			if (f.exists()) FileUtils.deleteFile(f);
						
			BD_MODULE.delete(appName + "_" + formName);
			
			dpOut.addReturn("result", "success");			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage",e.getMessage());
				dpOut.addReturn("result", "faild");
				
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}

	@BpCommand(registedName = "加载页面结构", logged = false)
	public static DataPackage loadHtmlTree(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String appName = parameters.getValue("appName");
			String formName = parameters.getValue("formName");
			
			DataTable dtHtmlCssNode = new DataTable();
			dtHtmlCssNode.id = "dtHtmlCssNode";
			
			DataTable dtHtmlJsNode = new DataTable();
			dtHtmlJsNode.id = "dtHtmlJsNode";
			
			DataTable dtHtmlBodyNode = new DataTable();
			dtHtmlBodyNode.id = "dtHtmlBodyNode";

			CoderHtml coderHtml = new CoderHtml(appName, formName);
			if (coderHtml.load()) 
			{
				dtHtmlCssNode = coderHtml.htmlCss.exportToDataTable(dtHtmlCssNode, coderHtml.htmlCss, 0);
				dtHtmlJsNode = coderHtml.htmlJs.exportToDataTable(dtHtmlJsNode, coderHtml.htmlJs, 0);
				dtHtmlBodyNode = coderHtml.htmlBody.exportToDataTable(dtHtmlBodyNode, coderHtml.htmlBody, 0);
			}
		
			dpOut.addDataTable(dtHtmlCssNode);
			dpOut.addDataTable(dtHtmlJsNode);
			dpOut.addDataTable(dtHtmlBodyNode);
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage",e.getMessage());
				dpOut.addReturn("result", "faild");
				
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}
	
	@BpCommand(registedName = "更新应用页面", logged = false)
	public static DataPackage updateHtmlTree(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String appName = parameters.getValue("appName");
			String formName = parameters.getValue("formName");
			String xmlCss =  parameters.getValue("xmlCss");
			String xmlJs =  parameters.getValue("xmlJs");
			String xmlBody =  parameters.getValue("xmlBody");			
			
			DataTable dtHtmlCssNode = new DataTable();
			dtHtmlCssNode.loadXML(xmlCss);
		
			DataTable dtHtmlJsNode = new DataTable();
			dtHtmlJsNode.loadXML(xmlJs);
	
			DataTable dtHtmlBodyNode = new DataTable();
			dtHtmlBodyNode.loadXML(xmlBody);			
			
			CoderHtml coderHtml = new CoderHtml(appName, formName);
			coderHtml.htmlCss.load(dtHtmlCssNode);
			coderHtml.htmlJs.load(dtHtmlJsNode);
			coderHtml.htmlBody.load(dtHtmlBodyNode);			
			coderHtml.exportDesign();	
			coderHtml.export();	
			
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage",e.getMessage());
				dpOut.addReturn("result", "faild");
				
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}
}

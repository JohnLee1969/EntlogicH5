package com.entlogic.h5.builder.forms;

import java.io.File;

import com.entlogic.h5.Application;
import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;
import com.entlogic.h5.db.BD_MODULE;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;
import com.entlogic.h5.utils.FileUtils;

/**
 * 
 * @author John
 *
 */
public class AddPageDialog
{
	@BpCommand(registedName = "获取应用页面模板", logged = false)
	public static DataPackage getPageTemplates(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();			

		try
		{
			String appName =  parameters.getValue("appName");
			
			String contextRealPath = Application.getParameter("ContextRealPath");
			String templatePath = contextRealPath + "app_modules/entlogicTemplates";
			if  (appName.indexOf(".mob") >= 0 )
			{
				templatePath = contextRealPath + "app_modules/entlogicTemplates.mob";
			}
			
			DataTable dtTemplates = new DataTable();
			File templateDir = new File(templatePath);
			File[] templateFiles = templateDir.listFiles();
			String fileName = "";
			for (int i = 0; i < templateFiles.length; i++)
			{
				DataRecord dr = new DataRecord();
				fileName = templateFiles[i].getName();
				if (fileName.indexOf(".js") > 0) 
				{
					fileName = fileName.replaceAll(".js", "");
					if (fileName.equals("app")) continue;
					dr.addData("id", fileName);
					dtTemplates.addRecord(dr);
				}
			}
			
			dtTemplates.id = "dtTemplates";
			dpOut.addDataTable(dtTemplates);
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

	@BpCommand(registedName = "添加应用页面", logged = false)
	public static DataPackage addPage(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();			

		try
		{
			String userOid =  parameters.getValue("userOid");
			String appName =  parameters.getValue("appName");
			String pageType = parameters.getValue("selPageType");
			String pageName = parameters.getValue("txtPageName");
			
			String contextRealPath = Application.getParameter("ContextRealPath");
			
			String appPath = contextRealPath + "app_modules/" + appName + "/";
			String fileHtml = appPath + pageName + ".html";
			String fileCss = appPath + pageName + ".css";
			String fileJs = appPath + pageName + ".js";
			
			String templatesPaht = contextRealPath + "app_modules/entlogicTemplates/";
			if (appName.indexOf(".mob") > 0 ) 	templatesPaht = contextRealPath + "app_modules/entlogicTemplates.mob/";
			String templateHtml = templatesPaht + pageType + ".html";
			String templateCss = templatesPaht + pageType + ".css";
			String templateJs = templatesPaht + pageType + ".js";
			
			String htmlContent = FileUtils.readToString(templateHtml);
			htmlContent = htmlContent.replaceAll(pageType, pageName);
			FileUtils.writeToFile(htmlContent, fileHtml);
			
			FileUtils.copy(templateCss, fileCss);
			FileUtils.copy(templateJs, fileJs);	
			
			BD_MODULE.add(appName + "_" + pageName, userOid);
			
			dpOut.addReturn("modulePath", appName + "_" + pageName);
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

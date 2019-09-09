package com.entlogic.h5.builder.forms;

import java.io.File;

import com.entlogic.h5.Application;
import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.db.BD_MODULE;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;
import com.entlogic.h5.utils.FileUtils;

/**
 * 
 * @author John
 *
 */
public class AddModuleDialog
{
	@BpCommand(registedName = "加载应用模块", logged = false)
	public static DataPackage addModule(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();			

		try
		{
			String userOid = parameters.getValue("userOid");
			String moduleType = parameters.getValue("selModuleType");
			String moduleName = parameters.getValue("txtModuleName");			
			if (moduleType.equals("Mobile")) moduleName += ".mob";
			
			String contextRealPath = Application.getParameter("ContextRealPath");
			String appRootPath = contextRealPath + "app_modules/" + moduleName;
			String appResourcePath = contextRealPath + "app_resources/" + moduleName;
			String appDataPath = contextRealPath + "app_data/" + moduleName;
			String appDboPath = contextRealPath + "app_dbos/" + moduleName;
			
			File f;
			f = new File(appRootPath);
			if (! f.exists()) f.mkdir();
			if (moduleType.equals("Mobile")) 
			{
				String appPath = contextRealPath + "app_modules/" + moduleName + "/";
				String fileHtml = appPath + "app.html";
				String fileCss = appPath + "app.css";
				String fileJs = appPath + "app.js";
				
				String templatesPaht = contextRealPath + "app_modules/entlogicTemplates.mob/";
				String templateHtml = templatesPaht + "app.html";
				String templateCss = templatesPaht + "app.css";
				String templateJs = templatesPaht + "app.js";
				
				String htmlContent = FileUtils.readToString(templateHtml);
				htmlContent = htmlContent.replaceAll("app", "app");
				FileUtils.writeToFile(htmlContent, fileHtml);				
				FileUtils.copy(templateCss, fileCss);
				FileUtils.copy(templateJs, fileJs);	
			}
			else
			{
				String appPath = contextRealPath + "app_modules/" + moduleName + "/";
				String fileHtml = appPath + "app.html";
				String fileCss = appPath + "app.css";
				String fileJs = appPath + "app.js";
				
				String templatesPaht = contextRealPath + "app_modules/entlogicTemplates/";
				String templateHtml = templatesPaht + "app.html";
				String templateCss = templatesPaht + "app.css";
				String templateJs = templatesPaht + "app.js";
				
				String htmlContent = FileUtils.readToString(templateHtml);
				htmlContent = htmlContent.replaceAll("app", "app");
				FileUtils.writeToFile(htmlContent, fileHtml);				
				FileUtils.copy(templateCss, fileCss);
				FileUtils.copy(templateJs, fileJs);			
			}
			
			f = new File(appResourcePath);
			if (! f.exists()) f.mkdir();
			
			f = new File(appResourcePath + "/iconfont");
			if (! f.exists()) f.mkdir();			
			
			f = new File(appResourcePath + "/icons");
			if (! f.exists()) f.mkdir();
			
			f = new File(appResourcePath + "/images");
			if (! f.exists()) f.mkdir();
			
			f = new File(appResourcePath + "/js");
			if (! f.exists()) f.mkdir();
			
			f = new File(appResourcePath + "/css");
			if (! f.exists()) f.mkdir();		
			
			f = new File(appDataPath);
			if (! f.exists()) f.mkdir();
			
			f = new File(appDboPath);
			if (! f.exists()) f.mkdir();
			
			dpOut.addReturn("modulePath", moduleName);
			dpOut.addReturn("result", "success");
			
			BD_MODULE.add(moduleName + "_app", userOid);
			
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

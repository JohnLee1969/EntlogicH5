package com.entlogic.h5.builder.forms;

import java.io.File;

import com.entlogic.h5.Application;
import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;
import com.entlogic.h5.db.BD_MODULE;
import com.entlogic.h5.db.QueryStatement;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;
import com.entlogic.h5.utils.FileUtils;

/**
 * 
 * @author John
 *
 */
public class RenameDialog
{
	@BpCommand(registedName = "修改模块名", logged = false)
	public static DataPackage rename(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();			

		try
		{
			String userOid =  parameters.getValue("userOid");
			String appName =  parameters.getValue("appName");
			String formName = parameters.getValue("formName");
			String oldModuleName = parameters.getValue("txtOldModuleName");
			String newModuleName = parameters.getValue("txtNewModuleName");
			
			
			String contextRealPath = Application.getParameter("ContextRealPath");
			String oldPath = null;
			String newPaht = null;
			String contentStr = null;
			
			String oid, newOid;
			
			// 如果该模块名
			if (formName.equals("*"))
			{
				oldPath = contextRealPath + "app_modules/" + oldModuleName;
				newPaht = contextRealPath + "app_modules/" +newModuleName;
				
				File from = new File(oldPath);
				File to = new File(newPaht);
				from.renameTo(to);
				
				BD_MODULE.rename(oldModuleName + "_*", newModuleName + "_*", userOid);	
				
				QueryStatement query = new QueryStatement();
				query.SQL = "selsect OID from BD_MODULE where OID like '" + appName + "_%'";
				DataTable dt = query.excute("jdbc/entlogic", null);
				for (int i = 0; i < dt.getSize(); i++)
				{
					oid = dt.getRecord(i).getValue("OID");
					newOid = oid.replace(oldModuleName, newModuleName);
					BD_MODULE.rename(oid, newOid, userOid);
				}
				
				dpOut.addReturn("modulePath", newModuleName + "_" + formName);
				dpOut.addReturn("result", "success");
			}
			else
			{
				oldPath = contextRealPath + "app_modules/" + appName + "/" + oldModuleName + "_D.html";
				newPaht = contextRealPath + "app_modules/" + appName + "/" + newModuleName + "_D.html";
				if (new File(oldPath).exists()) 
				{
					contentStr = FileUtils.readToString(oldPath);
					contentStr = contentStr.replaceAll(oldModuleName, newModuleName );
					FileUtils.writeToFile(contentStr, newPaht);
					FileUtils.deleteFile(new File(oldPath));
				}
				
				oldPath = contextRealPath + "app_modules/" + appName + "/" + oldModuleName + ".html";
				newPaht = contextRealPath + "app_modules/" + appName + "/" + newModuleName + ".html";
				contentStr = FileUtils.readToString(oldPath);
				contentStr = contentStr.replaceAll(oldModuleName, newModuleName );
				FileUtils.writeToFile(contentStr, newPaht);
				FileUtils.deleteFile(new File(oldPath));
				
				oldPath = contextRealPath + "app_modules/" + appName + "/" + oldModuleName + ".css";
				newPaht = contextRealPath + "app_modules/" + appName + "/" + newModuleName + ".css";
				contentStr = FileUtils.readToString(oldPath);
				FileUtils.writeToFile(contentStr, newPaht);
				FileUtils.deleteFile(new File(oldPath));
				
				oldPath = contextRealPath + "app_modules/" + appName + "/" + oldModuleName + ".js";
				newPaht = contextRealPath + "app_modules/" + appName + "/" + newModuleName + ".js";
				contentStr = FileUtils.readToString(oldPath);
				FileUtils.writeToFile(contentStr, newPaht);
				FileUtils.deleteFile(new File(oldPath));
				
				BD_MODULE.rename(appName + "_" + oldModuleName, appName + "_" + newModuleName, userOid);
				
				dpOut.addReturn("modulePath", appName + "_" + newModuleName);
				dpOut.addReturn("result", "success");
			}
			
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

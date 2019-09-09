package com.entlogic.h5.builder.forms;

import java.io.File;

import net.sf.json.JSONObject;

import com.entlogic.h5.Application;
import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;
import com.entlogic.h5.utils.FileUtils;

/**
 * 
 * @author John
 * 
 */
public class _DBO
{
	/**
	 * 加载数据库服务目录
	 * 
	 * @return
	 */
	@BpCommand(registedName = "加载DBO服务目录", logged = false)
	public static DataPackage loadDBOCatalog(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			// 创建返回数据包
			DataTable dtDBOCatalog = new DataTable();
			
			// 接收参数
			String appName = parameters.getValue("appName");
			// 获取目录数据
			String contextRealPath = Application.getParameter("ContextRealPath");
			File dboRoot = new File(contextRealPath + "app_dbos/" + appName);
			if (dboRoot.exists())
			{			
				File[] dboFiles = dboRoot.listFiles();
				File dboFile;
				JSONObject dboObj;
				JSONObject dboFunction;
				DataRecord dr;
				for (int i = 0; i < dboFiles.length; i++)
				{
					dboFile = dboFiles[i];
					dboObj = JSONObject.fromObject(FileUtils.readToString(dboFile.getAbsolutePath()));
					
					dr = new DataRecord();
					dr.addData("id", dboFile.getPath());
					dr.addData("lv", "0");
					dr.addData("text", dboFile.getName().replaceAll(".dbo", ""));
					dr.addData("dsn", dboObj.getString("dsn"));
					dr.addData("dboName", dboObj.getString("dboName"));
					dr.addData("dboFunction", "");
					dr.addData("SQL", "");
					dr.addData("SQL_MSSQL", "");
					dr.addData("SQL_ORACLE", "");
					dtDBOCatalog.addRecord(dr);
					
					dboFunction = dboObj.getJSONObject("create");
					dr = new DataRecord();
					dr.addData("id", dboFile.getPath() + "_create");
					dr.addData("lv", "1");
					dr.addData("text", "create");
					dr.addData("dsn", "jdbc/entlogic");
					dr.addData("dboName", dboObj.getString("dboName"));
					dr.addData("dboFunction", "create");
					dr.addData("SQL", dboFunction.getString("SQL"));
					dr.addData("SQL_MSSQL", dboFunction.getString("SQL_MSSQL"));
					dr.addData("SQL_ORACLE", dboFunction.getString("SQL_ORACLE"));
					dtDBOCatalog.addRecord(dr);
					
					dboFunction = dboObj.getJSONObject("insert");
					dr = new DataRecord();
					dr.addData("id", dboFile.getPath() + "_insert");
					dr.addData("lv", "1");
					dr.addData("text", "insert");
					dr.addData("dsn", dboObj.getString("dsn"));
					dr.addData("dboName", dboObj.getString("dboName"));
					dr.addData("dboFunction", "insert");
					dr.addData("SQL", dboFunction.getString("SQL"));
					dr.addData("SQL_MSSQL", dboFunction.getString("SQL_MSSQL"));
					dr.addData("SQL_ORACLE", dboFunction.getString("SQL_ORACLE"));
					dtDBOCatalog.addRecord(dr);
					
					dboFunction = dboObj.getJSONObject("delete");
					dr = new DataRecord();
					dr.addData("id", dboFile.getPath() + "_delete");
					dr.addData("lv", "1");
					dr.addData("text", "delete");
					dr.addData("dsn", dboObj.getString("dsn"));
					dr.addData("dboName", dboObj.getString("dboName"));
					dr.addData("dboFunction", "delete");
					dr.addData("SQL", dboFunction.getString("SQL"));
					dr.addData("SQL_MSSQL", dboFunction.getString("SQL_MSSQL"));
					dr.addData("SQL_ORACLE", dboFunction.getString("SQL_ORACLE"));
					dtDBOCatalog.addRecord(dr);
					
					dboFunction = dboObj.getJSONObject("update");
					dr = new DataRecord();
					dr.addData("id", dboFile.getPath() + "_update");
					dr.addData("lv", "1");
					dr.addData("text", "update");
					dr.addData("dsn", dboObj.getString("dsn"));
					dr.addData("dboName", dboObj.getString("dboName"));
					dr.addData("dboFunction", "update");
					dr.addData("SQL", dboFunction.getString("SQL"));
					dr.addData("SQL_MSSQL", dboFunction.getString("SQL_MSSQL"));
					dr.addData("SQL_ORACLE", dboFunction.getString("SQL_ORACLE"));
					dtDBOCatalog.addRecord(dr);
					
					dboFunction = dboObj.getJSONObject("query");
					dr = new DataRecord();
					dr.addData("id", dboFile.getPath() + "_query");
					dr.addData("lv", "1");
					dr.addData("text", "query");
					dr.addData("dsn", dboObj.getString("dsn"));
					dr.addData("dboName", dboObj.getString("dboName"));
					dr.addData("dboFunction", "query");
					dr.addData("SQL", dboFunction.getString("SQL"));
					dr.addData("SQL_MSSQL", dboFunction.getString("SQL_MSSQL"));
					dr.addData("SQL_ORACLE", dboFunction.getString("SQL_ORACLE"));
					dtDBOCatalog.addRecord(dr);
				}
			}
			dtDBOCatalog.id = "dtDBOCatalog";
			dpOut.addDataTable(dtDBOCatalog);
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
	
	/**
	 * 修改应用编码类型数据
	 * 
	 * @param parameters
	 * @return
	 */
	@BpCommand(registedName = "保存DBO配置数据", logged = true)
	public static DataPackage saveDBO(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String id = parameters.getValue("id");
			String level = parameters.getValue("level");
			String dboFunction = parameters.getValue("dboFunction");
			
			if (!level.equals("0")) 
			{
				id = id.replaceAll("_" + dboFunction, "");
			}
			
			JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(id));
			if (level.equals("0"))
			{
				dboObj.element("dsn", parameters.getValue("txtDsn"));
			}
			else
			{
				JSONObject functionObj = dboObj.getJSONObject(dboFunction);
				functionObj.element("SQL", parameters.getValue("txtSql"));
				functionObj.element("SQL_MSSQL", parameters.getValue("txtSqlMssql"));
				functionObj.element("SQL_ORACLE", parameters.getValue("txtSqlOracle"));
				dboObj.element(dboFunction, functionObj);
			}
			FileUtils.writeToFile(dboObj.toString(), id);
			
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
	
	@BpCommand(registedName = "删除DBO配置", logged = true)
	public static DataPackage deleteDBO(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String id = parameters.getValue("id");
			String dboFunction = parameters.getValue("dboFunction");
			if (!dboFunction.equals(""))
			{
				id = id.replaceAll("_" + dboFunction, "");
			}
			FileUtils.deleteFile(new File(id));
			
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

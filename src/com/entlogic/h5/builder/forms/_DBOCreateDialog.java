package com.entlogic.h5.builder.forms;

import net.sf.json.JSONObject;

import com.entlogic.h5.Application;
import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;
import com.entlogic.h5.db.DBA;
import com.entlogic.h5.db.QueryStatement;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;
import com.entlogic.h5.utils.FileUtils;

/**
 * 
 * @author John
 *
 */
public class _DBOCreateDialog
{
	@BpCommand(registedName = "创建DBO服务对象", logged = true)
	public static DataPackage createDBO(DataRecord parameters, UserSession session)
	{
		String transactionId = null;
		DataPackage dpOut = new DataPackage();		
		
		try
		{
			// 获取参数
			String appName = parameters.getValue("appName");
			String dsn = parameters.getValue("txtDsn");
			String dboName = parameters.getValue("txtTableName");
			
			// 获取表的所有字段
			QueryStatement sqlQuery = new QueryStatement();
			sqlQuery.SQL = ""
					+ "select "
					+ "	syscolumns.name as COL_NAME,"
					+ "	systypes.name as COL_NAME "
					+ "from "
					+ "	syscolumns,"
					+ "	systypes "
					+ "where "
					+ "	syscolumns.xusertype=systypes.xusertype and "
					+ "	syscolumns.id=object_id('" + dboName + "')";
			DataTable dtSections = sqlQuery.excute(dsn, null);
			
			String colName, colType;
			
			// 创建create子对象
			JSONObject createObj = new JSONObject();
			
			String createSql = "";
			createSql += "select \n";
			createSql += "  '' as id,\n";
			createSql += "  '' as lv";
			for (int i = 0; i < dtSections.getSize(); i++)
			{
				colName = dtSections.getRecord(i).getValue(0);
				colType = dtSections.getRecord(i).getValue(1);
				if (colType.indexOf("char") >= 0 || colType.indexOf("date") >= 0 || colType.indexOf("text") >= 0)
				{
					createSql += ",\n  '' as " + colName;
				}
				else
				{
					createSql += ",\n  0 as " + colName;
				}
			}
			createSql += "\nfrom\n";
			createSql += "  FW_PARAMETER \n";
			createSql += "where \n";
			createSql += "  OID = 'SYS_APP_NAME'\n";
			createObj.put("SQL", createSql);
			createObj.put("SQL_MSSQL", "");
			createObj.put("SQL_ORACLE", "");
			
			// 创建insert子对象
			JSONObject insertObj = new JSONObject();

			String insertSql = "";
			insertSql += "insert into " + dboName + " (\n";
			for (int i = 0; i < dtSections.getSize(); i++)
			{
				colName = dtSections.getRecord(i).getValue(0);
				if ( i > 0) 
				{
					insertSql += ",\n";
				}
				insertSql += "  " + colName;
			}
			insertSql += "\n) values (\n";
			for (int i = 0; i < dtSections.getSize(); i++)
			{
				colName = dtSections.getRecord(i).getValue(0);
				colType = dtSections.getRecord(i).getValue(1);
				if ( i > 0) 
				{
					insertSql += ",\n";
				}
				if (colType.indexOf("char") >= 0 || colType.indexOf("date") >= 0 || colType.indexOf("text") >= 0)
				{
					insertSql += "  '#" + colName + "#'";
				}
				else
				{
					insertSql += "  #" + colName + "#";
				}
			}
			insertSql += " \n)\n";
			insertObj.put("SQL", insertSql);
			insertObj.put("SQL_MSSQL", "");
			insertObj.put("SQL_ORACLE", "");
			
			// 创建delete子对象
			JSONObject deleteObj = new JSONObject();
			deleteObj.put("SQL", "delete " + dboName + " where OID = '#OID#'");
			deleteObj.put("SQL_MSSQL", "");
			deleteObj.put("SQL_ORACLE", "");		
			
			// 创建update子对象
			JSONObject updateObj = new JSONObject();
			
			String updateSql = "";
			updateSql += "update " + dboName + " set \n";
			for (int i = 0; i < dtSections.getSize(); i++)
			{
				colName = dtSections.getRecord(i).getValue(0);
				colType = dtSections.getRecord(i).getValue(1);
				if ( i > 0) 
				{
					updateSql += ",\n";
				}
				updateSql += "  " + colName + " = ";
				if (colType.indexOf("char") >= 0 || colType.indexOf("date") >= 0 || colType.indexOf("text") >= 0)
				{
					updateSql += "  '#" + colName + "#'";
				}
				else
				{
					updateSql += "  #" + colName + "#";
				}				
			}
			updateSql += "\nwhere OID = '#id#' \n";
			
			updateObj.put("SQL", updateSql);
			updateObj.put("SQL_MSSQL", "");
			updateObj.put("SQL_ORACLE", "");
			
			// 创建query子对象
			JSONObject queryObj = new JSONObject();

			String querySql = "";
			querySql += "select \n";
			querySql += "  OID as id,\n";
			querySql += "  '0' as lv, \n";
			querySql += "  row_number() over(#ORDER_BY_CLAUSE#) as rn";
			for (int i = 0; i < dtSections.getSize(); i++)
			{
				colName = dtSections.getRecord(i).getValue(0);
				querySql += ",\n  " + colName;
			}
			querySql += "\nfrom\n";
			querySql += "  " + dboName;
			querySql += "\n#WHERE_CLAUSE#\n";
			
			queryObj.put("SQL", querySql);
			queryObj.put("SQL_MSSQL", querySql);
			String sqlOracle = querySql;
			sqlOracle = sqlOracle.replaceAll("row_number\\(\\) over\\(#ORDER_BY_CLAUSE#\\)", "ROWNUM");
			sqlOracle += "#ORDER_BY_CLAUSE#\n";
			queryObj.put("SQL_ORACLE", sqlOracle);
			
			// 创建DBO对象
			JSONObject dboObj = new JSONObject();
			dboObj.put("dsn", dsn);
			dboObj.put("dboName", dboName);
			dboObj.put("create", createObj);
			dboObj.put("insert", insertObj);
			dboObj.put("delete", deleteObj);
			dboObj.put("update", updateObj);
			dboObj.put("query", queryObj);
			
			// 创建DBO文件
			String contextRealPath = Application.getParameter("ContextRealPath");
			String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
			String dboString = dboObj.toString();
			FileUtils.writeToFile(dboString, dboFilePath);
			
			// 返回成功
			dpOut.addReturn("result", "success");

			return dpOut;
		}
		catch (Exception e)
		{
			DBA.transactionRollback(transactionId);
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

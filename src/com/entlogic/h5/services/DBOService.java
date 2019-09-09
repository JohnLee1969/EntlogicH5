package com.entlogic.h5.services;

import net.sf.json.JSONObject;

import com.entlogic.h5.Application;
import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;
import com.entlogic.h5.db.QueryStatement;
import com.entlogic.h5.db.UpdateStatement;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;
import com.entlogic.h5.utils.FileUtils;
import com.entlogic.h5.utils.IDGenerater;

/**
 * TITLE : 数据访问服务
 * 
 * @author LIJING
 * 
 */
public class DBOService
{
	@BpCommand(registedName = "创建DBO数据", logged = false)
	public static DataPackage create(DataRecord parameters, UserSession session)
	{
		QueryStatement sqlQuery = new QueryStatement();
		DataPackage dpOut = new DataPackage();
		
		try
		{
			String transactionId = parameters.getValue("transactionId");
			String appName = parameters.getValue("appName");			
			String dboName = parameters.getValue("dboName");			
			
			String contextRealPath = Application.getParameter("ContextRealPath");
			String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
			JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
			JSONObject queryObj = dboObj.getJSONObject("create");
			
			sqlQuery.SQL = queryObj.getString("SQL");
			sqlQuery.SQL_MSSQL = queryObj.getString("SQL_MSSQL");
			sqlQuery.SQL_ORACLE = queryObj.getString("SQL_ORACLE");

			DataTable dtNew = sqlQuery.excute(dboObj.getString("dsn"), transactionId);
			dtNew.getRecord(0).setData("id", IDGenerater.UUID());
			
			dtNew.id = "dtNew";
			dpOut.addDataTable(dtNew);
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage", sqlQuery.execSql);
				dpOut.addReturn("result", "faild");
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}

	@BpCommand(registedName = "查询DBO数据", logged = false)
	public static DataPackage query(DataRecord parameters, UserSession session)
	{
		QueryStatement sqlQuery = new QueryStatement();
		DataPackage dpOut = new DataPackage();

		try
		{
			String transactionId = parameters.getValue("transactionId");
			String appName = parameters.getValue("appName");			
			String dboName = parameters.getValue("dboName");			
			String whereClause = parameters.getValue("whereClause");
			String whereClauseMssql = parameters.getValue("whereClauseMssql");
			String whereClauseOracle = parameters.getValue("whereClauseOracle");
			String orderByClause = parameters.getValue("orderByClause");
			int pageSize = Integer.parseInt(parameters.getValue("pageSize"));
			int pageIndex = Integer.parseInt(parameters.getValue("pageIndex"));
			int minRn = pageIndex * pageSize;
			int maxRn = minRn + pageSize;
			
			if (whereClauseMssql.equals(""))
			{
				whereClauseMssql = whereClause;
			}
			if (whereClauseOracle.equals(""))
			{
				whereClauseOracle = whereClause;
			}
			
			String contextRealPath = Application.getParameter("ContextRealPath");
			String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
			JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
			JSONObject queryObj = dboObj.getJSONObject("query");
			
			sqlQuery.SQL = queryObj.getString("SQL").replaceAll("#WHERE_CLAUSE#", whereClause);
			sqlQuery.SQL_MSSQL = queryObj.getString("SQL_MSSQL").replaceAll("#WHERE_CLAUSE#", whereClauseMssql);
			sqlQuery.SQL_ORACLE = queryObj.getString("SQL_ORACLE").replaceAll("#WHERE_CLAUSE#", whereClauseOracle);
			sqlQuery.setParameter("ORDER_BY_CLAUSE", orderByClause);
			
			sqlQuery.SQL = "select * from (" + sqlQuery.SQL + ") TT where TT.rn > " + minRn + " and TT.rn <= " + maxRn;
			sqlQuery.SQL_MSSQL = "select * from (" + sqlQuery.SQL_MSSQL + ") TT where TT.rn > " + minRn + " and TT.rn <= " + maxRn;
			sqlQuery.SQL_ORACLE = "select * from (" + sqlQuery.SQL_ORACLE + ") TT where TT.rn >= " + minRn + " and TT.rn < " + maxRn;

			DataTable dtQuery = sqlQuery.excute(dboObj.getString("dsn"), transactionId);
			
			dtQuery.id = "dtQuery";
			dpOut.addDataTable(dtQuery);
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage", sqlQuery.execSql);
				dpOut.addReturn("result", "faild");
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}
	
	@BpCommand(registedName = "创建DBO数据", logged = false)
	public static DataPackage insert(DataRecord parameters, UserSession session)
	{
		UpdateStatement sqlInsert = new UpdateStatement();
		DataPackage dpOut = new DataPackage();

		try
		{
			String transactionId = parameters.getValue("transactionId");
			String appName = parameters.getValue("appName");			
			String dboName = parameters.getValue("dboName");			
			
			String contextRealPath = Application.getParameter("ContextRealPath");
			String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
			JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
			JSONObject insertObj = dboObj.getJSONObject("insert");

			sqlInsert.SQL = insertObj.getString("SQL");
			sqlInsert.SQL_MSSQL = insertObj.getString("SQL_MSSQL");
			sqlInsert.SQL_ORACLE = insertObj.getString("SQL_ORACLE");		
			
			String xmlData = parameters.getValue("xmlData");
			DataRecord dr = new DataRecord();
			dr.loadXML(xmlData);
			String key, val;
			for (int i = 0; i < dr.getSize(); i++)
			{
				key = dr.getKey(i);
				val = dr.getValue(i);
				sqlInsert.setParameter(key, val);
			}
			
			sqlInsert.excute(dboObj.getString("dsn"), transactionId);
			
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage", sqlInsert.execSql);
				dpOut.addReturn("result", "faild");
				
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}
	
	@BpCommand(registedName = "跟新DBO数据", logged = false)
	public static DataPackage update(DataRecord parameters, UserSession session)
	{
		UpdateStatement sqlUpdate = new UpdateStatement();
		DataPackage dpOut = new DataPackage();

		try
		{
			String transactionId = parameters.getValue("transactionId");
			String appName = parameters.getValue("appName");			
			String dboName = parameters.getValue("dboName");			
			
			String contextRealPath = Application.getParameter("ContextRealPath");
			String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
			JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
			JSONObject updateObj = dboObj.getJSONObject("update");

			sqlUpdate.SQL = updateObj.getString("SQL");
			sqlUpdate.SQL_MSSQL = updateObj.getString("SQL_MSSQL");
			sqlUpdate.SQL_ORACLE = updateObj.getString("SQL_ORACLE");		
			
			String xmlData = parameters.getValue("xmlData");
			DataRecord dr = new DataRecord();
			dr.loadXML(xmlData);
			String key, val;
			for (int i = 0; i < dr.getSize(); i++)
			{
				key = dr.getKey(i);
				val = dr.getValue(i);
				sqlUpdate.setParameter(key, val);
			}
			
			sqlUpdate.excute(dboObj.getString("dsn"), transactionId);
			
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage", sqlUpdate.execSql);
				dpOut.addReturn("result", "faild");
				
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}
	
	@BpCommand(registedName = "删除DBO数据", logged = false)
	public static DataPackage delete(DataRecord parameters, UserSession session)
	{
		UpdateStatement sqlDelete = new UpdateStatement();
		DataPackage dpOut = new DataPackage();

		try
		{
			String transactionId = parameters.getValue("transactionId");
			String appName = parameters.getValue("appName");			
			String dboName = parameters.getValue("dboName");			
			
			String contextRealPath = Application.getParameter("ContextRealPath");
			String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
			JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
			JSONObject deleteObj = dboObj.getJSONObject("delete");

			sqlDelete.SQL = deleteObj.getString("SQL");
			sqlDelete.SQL_MSSQL = deleteObj.getString("SQL_MSSQL");
			sqlDelete.SQL_ORACLE = deleteObj.getString("SQL_ORACLE");		
			sqlDelete.setParameter("OID",  parameters.getValue("OID"));
			sqlDelete.excute(dboObj.getString("dsn"), transactionId);
			
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage", sqlDelete.execSql);
				dpOut.addReturn("result", "faild");
				
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}
	
	@BpCommand(registedName = "取记录数", logged = false)
	public static DataPackage count(DataRecord parameters, UserSession session)
	{
		QueryStatement sqlQuery = new QueryStatement();
		DataPackage dpOut = new DataPackage();

		try
		{
			String transactionId = parameters.getValue("transactionId");
			String appName = parameters.getValue("appName");			
			String dboName = parameters.getValue("dboName");			
			String whereClause = parameters.getValue("whereClause");
			String whereClauseMssql = parameters.getValue("whereClauseMssql");
			String whereClauseOracle = parameters.getValue("whereClauseOracle");
			
			if (whereClauseMssql.equals(""))
			{
				whereClauseMssql = whereClause;
			}
			if (whereClauseOracle.equals(""))
			{
				whereClauseOracle = whereClause;
			}
			
			String contextRealPath = Application.getParameter("ContextRealPath");
			String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
			JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
			JSONObject queryObj = dboObj.getJSONObject("query");
					
			sqlQuery.SQL = queryObj.getString("SQL");
			sqlQuery.SQL = "select count(*) as C " + sqlQuery.SQL.substring(sqlQuery.SQL.indexOf("from"));
			sqlQuery.SQL += whereClause;
			
			sqlQuery.SQL_MSSQL = queryObj.getString("SQL_MSSQL");
			sqlQuery.SQL_MSSQL = "select count(*) as C " + sqlQuery.SQL_MSSQL.substring(sqlQuery.SQL_MSSQL.indexOf("from"));
			sqlQuery.SQL_MSSQL += whereClauseMssql;
			
			sqlQuery.SQL_ORACLE = queryObj.getString("SQL_ORACLE");
			sqlQuery.SQL_ORACLE = "select count(*) as C " + sqlQuery.SQL_ORACLE.substring(sqlQuery.SQL_ORACLE.indexOf("from"));
			sqlQuery.SQL_ORACLE += whereClauseOracle;

			DataTable dtQuery = sqlQuery.excute(dboObj.getString("dsn"), transactionId);
			
			String returnString = dtQuery.getRecord(0).getValue(0);
			dpOut.addReturn("count", returnString);
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage", sqlQuery.execSql);
				dpOut.addReturn("result", "faild");
				
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}
	
	@BpCommand(registedName = "取最大值", logged = false)
	public static DataPackage max(DataRecord parameters, UserSession session)
	{
		QueryStatement sqlQuery = new QueryStatement();
		DataPackage dpOut = new DataPackage();
		
		try
		{
			String transactionId = parameters.getValue("transactionId");
			String appName = parameters.getValue("appName");			
			String dboName = parameters.getValue("dboName");			
			String colName = parameters.getValue("colName");			
			String whereClause = parameters.getValue("whereClause");
			String whereClauseMssql = parameters.getValue("whereClauseMssql");
			String whereClauseOracle = parameters.getValue("whereClauseOracle");
			
			if (whereClauseMssql.equals(""))
			{
				whereClauseMssql = whereClause;
			}
			if (whereClauseOracle.equals(""))
			{
				whereClauseOracle = whereClause;
			}
			
			String contextRealPath = Application.getParameter("ContextRealPath");
			String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
			JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
			JSONObject queryObj = dboObj.getJSONObject("query");
					
			sqlQuery.SQL = queryObj.getString("SQL");
			sqlQuery.SQL = "select max(" + colName + ") as MAX " + sqlQuery.SQL.substring(sqlQuery.SQL.indexOf("from"));
			sqlQuery.SQL += whereClause;
			
			sqlQuery.SQL_MSSQL = queryObj.getString("SQL_MSSQL");
			sqlQuery.SQL_MSSQL = "select max(" + colName + ") as MAX " + sqlQuery.SQL_MSSQL.substring(sqlQuery.SQL_MSSQL.indexOf("from"));
			sqlQuery.SQL_MSSQL += whereClauseMssql;
			
			sqlQuery.SQL_ORACLE = queryObj.getString("SQL_ORACLE");
			sqlQuery.SQL_ORACLE = "select max(" + colName + ") as MAX " + sqlQuery.SQL_ORACLE.substring(sqlQuery.SQL_ORACLE.indexOf("from"));
			sqlQuery.SQL_ORACLE += whereClauseOracle;

			DataTable dtQuery = sqlQuery.excute(dboObj.getString("dsn"), transactionId);
			
			String returnString = "";
			if (dtQuery.getSize() > 0) 
			{
				returnString = dtQuery.getRecord(0).getValue(0);
			}
			
			dpOut.addReturn("max", returnString);
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage", sqlQuery.execSql);
				dpOut.addReturn("result", "faild");
				
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}
	
	@BpCommand(registedName = "取最大值", logged = false)
	public static DataPackage min(DataRecord parameters, UserSession session)
	{
		QueryStatement sqlQuery = new QueryStatement();
		DataPackage dpOut = new DataPackage();

		try
		{
			String transactionId = parameters.getValue("transactionId");
			String appName = parameters.getValue("appName");			
			String dboName = parameters.getValue("dboName");			
			String colName = parameters.getValue("colName");			
			String whereClause = parameters.getValue("whereClause");
			String whereClauseMssql = parameters.getValue("whereClauseMssql");
			String whereClauseOracle = parameters.getValue("whereClauseOracle");
			
			if (whereClauseMssql.equals(""))
			{
				whereClauseMssql = whereClause;
			}
			if (whereClauseOracle.equals(""))
			{
				whereClauseOracle = whereClause;
			}
			
			String contextRealPath = Application.getParameter("ContextRealPath");
			String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
			JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
			JSONObject queryObj = dboObj.getJSONObject("query");
					
			sqlQuery.SQL = queryObj.getString("SQL");
			sqlQuery.SQL = "select min(" + colName + ") as MIN " + sqlQuery.SQL.substring(sqlQuery.SQL.indexOf("from"));
			sqlQuery.SQL += whereClause;
			
			sqlQuery.SQL_MSSQL = queryObj.getString("SQL_MSSQL");
			sqlQuery.SQL_MSSQL = "select min(" + colName + ") as MIN " + sqlQuery.SQL_MSSQL.substring(sqlQuery.SQL_MSSQL.indexOf("from"));
			sqlQuery.SQL_MSSQL += whereClauseMssql;
			
			sqlQuery.SQL_ORACLE = queryObj.getString("SQL_ORACLE");
			sqlQuery.SQL_ORACLE = "select min(" + colName + ") as MIN " + sqlQuery.SQL_ORACLE.substring(sqlQuery.SQL_ORACLE.indexOf("from"));
			sqlQuery.SQL_ORACLE += whereClauseOracle;

			DataTable dtQuery = sqlQuery.excute(dboObj.getString("dsn"), transactionId);
					
			String returnString = "";
			if (dtQuery.getSize() > 0) 
			{
				returnString = dtQuery.getRecord(0).getValue(0);
			}
			
			dpOut.addReturn("min", returnString);
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage", sqlQuery.execSql);
				dpOut.addReturn("result", "faild");
				
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}
	
	@BpCommand(registedName = "从新排序", logged = false)
	public static DataPackage  resetOrderCode(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String transactionId = parameters.getValue("transactionId");
			String appName = parameters.getValue("appName");			
			String dboName = parameters.getValue("dboName");			

			String contextRealPath = Application.getParameter("ContextRealPath");
			String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
			JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
			
			String dsn = dboObj.getString("dsn");
					
			_resetOrderCode(transactionId, dsn, dboName, "-", "");
			
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage", e.getMessage());
				dpOut.addReturn("result", "faild");
				
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}
	
	private static void _resetOrderCode(String transactionId, String dsn, String dboName, String parentOid, String parentOrderCode) throws Exception
	{
		UpdateStatement sqlUpdate = new UpdateStatement();
		
		QueryStatement sqlQuery = new QueryStatement();
		sqlQuery.SQL = "select OID, ORDER_CODE from " + dboName + " where PARENT_OID = '" + parentOid + "' order by ORDER_CODE";
		DataTable dtQuery = sqlQuery.excute(dsn, transactionId);
		
		String oid = "";
		String orderCode = "";
		for(int i = 0; i < dtQuery.getSize(); i++)
		{
			oid = dtQuery.getRecord(i).getValue("OID");
			
			if (i < 100)
			{
				orderCode ="0";
			} 
			if (i < 10) 
			{
				orderCode += "0";
			}
			orderCode += i;
			orderCode = parentOrderCode + orderCode;
			
			sqlUpdate.SQL = "update " + dboName + " set PARENT_OID = '" + parentOid + "', ORDER_CODE = '" + orderCode + "' where OID = '" + oid + "'";
			sqlUpdate.excute(dsn, transactionId);
			
			_resetOrderCode(transactionId, dsn, dboName, oid, orderCode);
		}		
	}
}

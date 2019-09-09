package com.entlogic.h5.db;

import com.entlogic.h5.Application;
import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;
import com.entlogic.h5.utils.FileUtils;
import com.entlogic.h5.utils.IDGenerater;

import net.sf.json.JSONObject;

public class DBO
{
	public String appName;
	public String dboName;
	
	public String whereClause;
	public String whereClauseMssql;
	public String whereClauseOracle;
	public String orderByClause;
	
	int pageSize = 8000;
	int pageIndex =0;
	
	/**
	 * 构造函数 
	 * 
	 * @param appN
	 * @param dboN
	 */
	public DBO(String appN, String dboN)
	{
		appName = appN;
		dboName = dboN;
	}
	
	/**
	 * 
	 * @param transactionId
	 * @return
	 * @throws Exception
	 */
	public DataRecord create(String transactionId) throws Exception
	{
		QueryStatement sqlQuery = new QueryStatement();
		
		String contextRealPath = Application.getParameter("ContextRealPath");
		String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
		JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
		JSONObject queryObj = dboObj.getJSONObject("create");
		
		sqlQuery.SQL = queryObj.getString("SQL");
		sqlQuery.SQL_MSSQL = queryObj.getString("SQL_MSSQL");
		sqlQuery.SQL_ORACLE = queryObj.getString("SQL_ORACLE");

		DataTable dtNew = sqlQuery.excute(dboObj.getString("dsn"), transactionId);
		DataRecord drNew = dtNew.getRecord(0);
		drNew.setData("id", IDGenerater.UUID());
		
		return drNew;
	}

	/**
	 * 查询
	 * 
	 * @param transactionId
	 * @return
	 * @throws Exception
	 */
	public DataTable query(String transactionId) throws Exception
	{
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
		
		QueryStatement sqlQuery = new QueryStatement();
		sqlQuery.SQL = queryObj.getString("SQL").replaceAll("#WHERE_CLAUSE#", whereClause);
		sqlQuery.SQL_MSSQL = queryObj.getString("SQL_MSSQL").replaceAll("#WHERE_CLAUSE#", whereClauseMssql);
		sqlQuery.SQL_ORACLE = queryObj.getString("SQL_ORACLE").replaceAll("#WHERE_CLAUSE#", whereClauseOracle);
		sqlQuery.setParameter("ORDER_BY_CLAUSE", orderByClause);
		
		sqlQuery.SQL = "select * from (" + sqlQuery.SQL + ") TT where TT.rn > " + minRn + " and TT.rn <= " + maxRn;
		sqlQuery.SQL_MSSQL = "select * from (" + sqlQuery.SQL_MSSQL + ") TT where TT.rn > " + minRn + " and TT.rn <= " + maxRn;
		sqlQuery.SQL_ORACLE = "select * from (" + sqlQuery.SQL_ORACLE + ") TT where TT.rn >= " + minRn + " and TT.rn < " + maxRn;

		DataTable dtQuery = sqlQuery.excute(dboObj.getString("dsn"), transactionId);
		
		return dtQuery;
	}
	
	/**
	 * 插入数据
	 * @param transactionId
	 * @param dr
	 */
	public void insert(String transactionId, DataRecord  dr) throws Exception
	{	
		String contextRealPath = Application.getParameter("ContextRealPath");
		String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
		JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
		JSONObject insertObj = dboObj.getJSONObject("insert");

		UpdateStatement sqlInsert = new UpdateStatement();
		sqlInsert.SQL = insertObj.getString("SQL");
		sqlInsert.SQL_MSSQL = insertObj.getString("SQL_MSSQL");
		sqlInsert.SQL_ORACLE = insertObj.getString("SQL_ORACLE");		
		
		String key, val;
		for (int i = 0; i < dr.getSize(); i++)
		{
			key = dr.getKey(i);
			val = dr.getValue(i);
			sqlInsert.setParameter(key, val);
		}
		
		sqlInsert.excute(dboObj.getString("dsn"), transactionId);
	}
	
	/**
	 * 跟新数据
	 * @param transactionId
	 * @param dr
	 * @throws Exception
	 */
	public void update(String transactionId, DataRecord  dr) throws Exception
	{
		String contextRealPath = Application.getParameter("ContextRealPath");
		String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
		JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
		JSONObject updateObj = dboObj.getJSONObject("update");

		UpdateStatement sqlUpdate = new UpdateStatement();
		sqlUpdate.SQL = updateObj.getString("SQL");
		sqlUpdate.SQL_MSSQL = updateObj.getString("SQL_MSSQL");
		sqlUpdate.SQL_ORACLE = updateObj.getString("SQL_ORACLE");		
		
		String key, val;
		for (int i = 0; i < dr.getSize(); i++)
		{
			key = dr.getKey(i);
			val = dr.getValue(i);
			sqlUpdate.setParameter(key, val);
		}
		
		sqlUpdate.excute(dboObj.getString("dsn"), transactionId);
	}
	
	/**
	 * 
	 * @param transactionId
	 * @param oid
	 * @return
	 * @throws Exception
	 */
	public void delete(String transactionId, String oid) throws Exception
	{
		UpdateStatement sqlDelete = new UpdateStatement();
		
		String contextRealPath = Application.getParameter("ContextRealPath");
		String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
		JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
		JSONObject deleteObj = dboObj.getJSONObject("delete");

		sqlDelete.SQL = deleteObj.getString("SQL");
		sqlDelete.SQL_MSSQL = deleteObj.getString("SQL_MSSQL");
		sqlDelete.SQL_ORACLE = deleteObj.getString("SQL_ORACLE");		
		sqlDelete.setParameter("OID",  oid);
		sqlDelete.excute(dboObj.getString("dsn"), transactionId);
	}
	
	/**
	 * 获取记录数
	 * 
	 * @param transactionId
	 * @return
	 * @throws Exception
	 */
	public int count(String transactionId) throws Exception
	{
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
				
		QueryStatement sqlQuery = new QueryStatement();
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
		return Integer.parseInt(returnString);
	}
	
	/**
	 * 获取列最大值
	 * @param transactionId
	 * @param colName
	 * @return
	 * @throws Exception
	 */
	public String max(String transactionId, String colName) throws Exception
	{
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
				
		QueryStatement sqlQuery = new QueryStatement();
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
		
		return returnString;
	}
	
	/**
	 * 获取列最小值
	 * @param transactionId
	 * @param colName
	 * @return
	 * @throws Exception
	 */
	public String min(String transactionId, String colName) throws Exception
	{
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
				
		QueryStatement sqlQuery = new QueryStatement();
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
		
		return returnString;
	}
	
	/**
	 * 重新生成层级编码
	 * @param transactionId
	 * @throws Exception
	 */
	public void resetOrderCode(String transactionId) throws Exception
	{
		String contextRealPath = Application.getParameter("ContextRealPath");
		String dboFilePath = contextRealPath + "app_dbos/" + appName + "/" + dboName + ".dbo";
		JSONObject dboObj = JSONObject.fromObject(FileUtils.readToString(dboFilePath));
		
		String dsn = dboObj.getString("dsn");
				
		_resetOrderCode(transactionId, dsn, dboName, "-", "");
	}
	
	/**
	 *  重新生成层级编码，递归函数
	 * @param transactionId
	 * @param dsn
	 * @param dboName
	 * @param parentOid
	 * @param parentOrderCode
	 * @throws Exception
	 */
	private void _resetOrderCode(String transactionId, String dsn, String dboName, String parentOid, String parentOrderCode) throws Exception
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

package com.entlogic.h5.db;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;

import com.entlogic.h5.Application;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;
import com.entlogic.h5.db.DBA;

public class QueryStatement
{
	/**
	 *  sql
	 */
	public String SQL = "";

	/**
	 * Oracle sql
	 */
	public String SQL_ORACLE = "";
	
	
	/**
	 * MSSQL sql
	 */
	public String SQL_MSSQL = "";
	
	/**
	 * 执行SQL
	 */
	public String execSql = "";
	
	/**
	 * 设置参数
	 * 
	 * @throws Exception
	 */
	public void setParameter(String parKey, String parValue ) throws Exception
	{
		SQL = SQL.replaceAll("#" + parKey + "#", parValue);
		SQL_ORACLE = SQL_ORACLE.replaceAll("#" + parKey + "#", parValue);
		SQL_MSSQL = SQL_MSSQL.replaceAll("#" + parKey + "#", parValue);
	}
	
	/**
	 * 执行
	 * 
	 * @return
	 * @throws Exception
	 */
	public DataTable excute(String dsn, String transactionId) throws Exception
	{
		DataTable dataTable = new DataTable();
		
		Connection cnn = DBA.openConnnection(dsn, transactionId);
		Statement statement = cnn.createStatement();
		String dbType = Application.getParameter(dsn);
		if (dbType.equals("ORACLE") && !SQL_ORACLE.equals(""))
		{
			execSql = SQL_ORACLE;
		}
		else if (dbType.equals("MSSQL") && !SQL_MSSQL.equals(""))
		{
			execSql = SQL_MSSQL;
		}
		else 
		{
			execSql = SQL;
		}
		if (execSql.equals(""))
		{
			throw new Exception("查询SQL语句为空！！！");
		}
		
		ResultSet rset = statement.executeQuery(execSql);
		
		ResultSetMetaData rsmd = rset.getMetaData() ;   
		int cols = rsmd.getColumnCount();
		int i = 0;
		String key, value;
		DataRecord record;
		while(rset.next())
		{
			record = new DataRecord();
			for (i = 0; i < cols; i++)
			{
				key = rsmd.getColumnName(i + 1);
				value = rset.getString(i + 1);
				record.addData(key, value);
			}
			dataTable.addRecord(record);
		}
		
		statement.close();
		if (transactionId == null || transactionId.equals(""))
		{
			cnn.close();
		}
		
		return dataTable;
	}

	/**
	 * 查询
	 * 
	 * @return
	 * @throws Exception
	 */
	public ResultSet excuteQuery(String dsn, String transactionId) throws Exception
	{	
		Connection cnn = DBA.openConnnection(dsn, transactionId);
		Statement statement = cnn.createStatement();
		String dbType = Application.getParameter(dsn);
		if (dbType.equals("ORACLE") && !SQL_ORACLE.equals(""))
		{
			execSql = SQL_ORACLE;
		}
		else if (dbType.equals("MSSQL") && !SQL_MSSQL.equals(""))
		{
			execSql = SQL_MSSQL;
		}
		else 
		{
			execSql = SQL;
		}
		if (execSql.equals(""))
		{
			throw new Exception("查询SQL语句为空！！！");
		}
		
		ResultSet rset = statement.executeQuery(execSql);
		
		statement.close();
		if (transactionId == null || transactionId.equals(""))
		{
			cnn.close();
		}

		return rset;
	}
}

package com.entlogic.h5.db;

import java.sql.Connection;
import java.sql.Statement;

import com.entlogic.h5.Application;
import com.entlogic.h5.db.DBA;

public class UpdateStatement
{
	/**
	 * Oracle sql
	 */
	public String SQL_ORACLE = "";
	
	/**
	 * MsSQL sql
	 */
	public String SQL = "";
	
	/**
	 * MySQL sql
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
	public void excute(String dsn, String transactionId) throws Exception
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
			throw new Exception("更新SQL语句为空！！！");
		}
		
		statement.execute(execSql);
		statement.close();
		if (transactionId == null || transactionId.equals(""))
		{
			cnn.close();
		}
	}
}

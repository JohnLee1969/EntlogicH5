package com.entlogic.h5.services;

import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;
import com.entlogic.h5.db.DBA;
import com.entlogic.h5.db.QueryStatement;
import com.entlogic.h5.db.UpdateStatement;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;

/**
 * TITLE : 数据访问服务
 * 
 * @author LIJING
 * 
 */
public class DBAService
{
	
	/**
	 * 查询
	 * 
	 * @return
	 */
	@BpCommand(registedName = "执行DBA查询", logged = false)
	public static DataPackage query(DataRecord parameters, UserSession session)
	{
		QueryStatement sqlQuery = new QueryStatement();
		DataPackage dpOut = new DataPackage();

		try
		{
			String transactionId = parameters.getValue("transactionId");
			String dsn = parameters.getValue("dsn");
			String sql =  parameters.getValue("SQL");
			String sqlMssql =  parameters.getValue("SQL_MSSQL");
			String sqlOracle =  parameters.getValue("SQL_ORACLE");

			sqlQuery.SQL = sql;
			sqlQuery.SQL_MSSQL = sqlMssql;
			sqlQuery.SQL_ORACLE = sqlOracle;
			
			DataTable dtQuery = sqlQuery.excute(dsn, transactionId);
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
	
	/**
	 * 更新
	 * 
	 * @param parameters
	 * @return
	 */
	@BpCommand(registedName = "执行DBA更新", logged = false)
	public static DataPackage update(DataRecord parameters, UserSession session)
	{
		UpdateStatement sqlUpdate = new UpdateStatement();
		DataPackage dpOut = new DataPackage();
		
		try
		{
			String transactionId = parameters.getValue("transactionId");
			String dsn = parameters.getValue("dsn");
			String sql =  parameters.getValue("SQL");
			String sqlMssql =  parameters.getValue("SQL_MSSQL");
			String sqlOracle =  parameters.getValue("SQL_ORACLE");

			sqlUpdate.SQL = sql;
			sqlUpdate.SQL_MSSQL = sqlMssql;
			sqlUpdate.SQL_ORACLE = sqlOracle;
			sqlUpdate.excute(dsn, transactionId);
			
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
	
	/**
	 * 开始交易
	 * 
	 * @param parameters
	 * @return
	 */
	@BpCommand(registedName = "开启前端事务", logged = false)
	public static DataPackage transactionBegin(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String tId = DBA.transactionBegin();			
			
			dpOut.addReturn("transactionId", tId);
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
	
	/**
	 * 提交交易
	 * 
	 * @param parameters
	 * @return
	 */
	@BpCommand(registedName = "提交前端事务", logged = false)
	public static DataPackage transactionCommit(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String transactionId = parameters.getValue("transactionId");
			DBA.transactionCommit(transactionId);
			
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
	
	/**
	 * 提交交易
	 * 
	 * @param parameters
	 * @return
	 */
	@BpCommand(registedName = "回滚前端事务", logged = false)
	public static DataPackage transactionRollback(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String transactionId = parameters.getValue("transactionId");
			DBA.transactionRollback(transactionId);
			
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
}

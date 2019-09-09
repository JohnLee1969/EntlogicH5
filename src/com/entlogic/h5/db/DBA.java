package com.entlogic.h5.db;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.Hashtable;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import com.entlogic.h5.Application;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.db.Transaction;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.utils.IDGenerater;

/**
 * 数据库访问
 * 
 * @author John
 *
 */
public class DBA
{
	/**
	 * 事物容器
	 */
	public static Hashtable<String, Transaction> transactionBuffer = new Hashtable<String, Transaction>();
	
	/**
	 * 根据数据源创建数据库连接
	 *  
	 * @param dsn
	 * @return
	 * @throws Exception
	 */
	public static Connection openConnnection(String dsn, String transactionId) throws Exception
	{
		// 获取事务对象
		Connection connection = null;
		Transaction transaction = null;
		if (transactionId != null && !transactionId.equals(""))
		{
			transaction = transactionBuffer.get(transactionId);
			if (transaction != null)
			{
				connection = transaction.connections.get(dsn);
			}
			if (connection != null)
			{
				Log.info("获取到事务中数据库连接: " + dsn);
				return connection;
			}
		}
		
        // 获取数据源
        Context initcontext = new InitialContext();
        Context context=(Context) initcontext.lookup("java:comp/env");
        DataSource datasource=(DataSource)context.lookup(dsn);
        connection = datasource.getConnection();
        
        // 如果存在事物，将连接加入事物连接缓存中
        if (transaction != null)
        {
            connection.setAutoCommit(false);
            transaction.connections.put(dsn, connection);
            Log.info("新建事务中数据库连接: " + dsn);
        }
        else
        {
        	connection.setAutoCommit(true);
        	Log.info("新建无事务数据库连接: " + dsn);
        }
        
        // 返回数据连接
        return connection;
	}
	
	/**
	 * 开启线程事务
	 * 
	 * @throws Exception
	 */
	public static String transactionBegin()
	{
		try
		{
			int timeOut = Integer.parseInt((String)Application.getParameter("TransactionTimeOut"));
			
			Transaction transaction = new Transaction();
			String tId = IDGenerater.UUID();
			transaction.timeOut = timeOut;
			transactionBuffer.put(tId, transaction);
			transaction.start();
			
			return tId;
		}
		catch(Exception err)
		{
			Log.error(err);
			return null;
		}
 	}
	
	/**
	 * 提交线程事务
	 * 
	 * @throws Exception
	 */
	public static void transactionCommit(String transactionId)
	{
		try
		{
			Transaction transaction = transactionBuffer.get(transactionId);
			transaction.commit();
			transactionBuffer.remove(transactionId);
		}
		catch(Exception err)
		{
			Log.error(err);
		}
	}
	
	/**
	 * 回滚线程事务
	 * 
	 * @throws Exception
	 */
	public static void transactionRollback(String transactionId)
	{
		try
		{
			Transaction transaction = transactionBuffer.get(transactionId);
			transaction.rollBack();
			transactionBuffer.remove(transactionId);
		}
		catch(Exception err)
		{
			Log.error(err);
		}
	}

	/**
	 * 根据OID返回一条数据记录
	 * 
	 * @param dsn
	 * @param tableName
	 * @param oid
	 * @return
	 * @throws Exception
	 */
	public static DataRecord getByOid(String dsn, String tableName, String oid) throws Exception
	{
		Connection cnn = DBA.openConnnection(dsn, null);
		Statement statement = cnn.createStatement();
		String sql = "select * from " + tableName + " where oid = '" + oid + "'";
		
		ResultSet rset = statement.executeQuery(sql);
		ResultSetMetaData rsmd = rset.getMetaData() ;   
		int cols = rsmd.getColumnCount();
		int i = 0;
		String key, value;
		DataRecord record = null;
		while(rset.next())
		{
			record = new DataRecord();
			for (i = 0; i < cols; i++)
			{
				key = rsmd.getColumnName(i + 1);
				value = rset.getString(i + 1);
				record.addData(key, value);
			}
		}
		
		return record;
	}
	
	/**
	 * 获取记录数量
	 * 
	 * @param dsn
	 * @param tableName
	 * @param whereClause
	 * @return
	 * @throws Exception
	 */
	public static long getCount(String dsn, String tableName, String whereClause) throws Exception
	{
		Connection cnn = DBA.openConnnection(dsn, null);
		Statement statement = cnn.createStatement();
		String sql = "select count(*) from " + tableName + " " + whereClause;
		
		ResultSet rset = statement.executeQuery(sql);
		long size = 0;
		while(rset.next())
		{
			size = rset.getLong(1);
		}
		
		return size;
	}

}

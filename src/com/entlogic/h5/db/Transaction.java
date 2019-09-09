package com.entlogic.h5.db;

import java.sql.Connection;
import java.util.Date;
import java.util.Enumeration;
import java.util.Hashtable;

import com.entlogic.h5.logs.Log;

/**
 * 
 * @author John
 *
 */
public class Transaction extends Thread
{
	/**
	 * 事务超时时长
	 */
	public int timeOut = 1000;
	
	/**
	 * 事务中包含的数据链接
	 */
	public Hashtable<String, Connection> connections = new Hashtable<String, Connection>();
	
	/**
	 * 终止标志
	 */
	private boolean _stop = false;
	
	/**
	 * 线程运行接口
	 */
	public void run()
	{
		try
		{
			Log.info("事务开始");
			long t1 = new Date().getTime();
			long t2 = new Date().getTime();
			while(t2 - t1 < timeOut)
			{
				t2 = new Date().getTime();
				if (_stop)
				{
					Log.info("事务终止");
					return;
				}
			}
			Log.info("事务超时");
			rollBack();
		}
		catch(Exception err)
		{
			rollBack();
			Log.error(err);
		}
	}
	
	public void begin()
	{
		start();
	}
	
	public void end()
	{
		_stop = true;
	}

	public void commit()
	{
		try
		{
			Enumeration<String> e = connections.keys();
			while (e.hasMoreElements())
			{
				String key = e.nextElement();
				Connection cnn =  connections.get(key);
				cnn.commit();
				cnn.close();
				connections.remove(key);
			}		
			Log.info("事务已提交");
			end();
		}
		catch(Exception err)
		{
			Log.error(err);
			rollBack();
		}
	}
	
	public void rollBack() 
	{
		try
		{
			Enumeration<String> e = connections.keys();
			while (e.hasMoreElements())
			{
				String key = e.nextElement();
				Connection cnn =  connections.get(key);
				cnn.rollback();
				cnn.close();
				connections.remove(key);
			}
			Log.info("事务已回滚");
		}
		catch(Exception err)
		{
			Log.error(err);
		}
		finally
		{
			end();
		}
	}
}

package com.entlogic.h5.securitys;

import java.util.Date;
import java.util.HashMap;

import com.entlogic.h5.logs.Log;
import com.entlogic.h5.utils.IDGenerater;

public class UserSession
{
	private String _sessionID;
	private long _createTime;
	private Boolean _isLogin;	
	private HashMap<String, String> _items;
	
	/**
	 * 构造函数
	 */
	public UserSession()
	{
		try
		{
			_sessionID = IDGenerater.UUID();
			_createTime = (new Date()).getTime();
			_isLogin = false;
			_items = new HashMap<String, String>();
		}
		catch(Exception e)
		{
			
		}
	}
	
	/**
	 * 获取创建时间
	 * 
	 * @return
	 */
	public String getSessionID()
	{
		return _sessionID;
	}
	
	/**
	 * 获取回话ID
	 * 
	 * @return
	 */
	public long getCreateTime()
	{
		return _createTime;
	}
	
	/**
	 * 是否登录
	 * 
	 * @return
	 */
	public Boolean isLogin()
	{
		return _isLogin;
	}
	
	/**
	 * 设置登录
	 */
	public void setLogin() 
	{
		_isLogin = true;
	}
	
	/**
	 * 获取数据项
	 * 
	 * @param key
	 * @return
	 */
	public String getItem(String key)
	{
		Log.info("session: " + _sessionID + ", getting key: " + key);
		return _items.get(key);
	}
	
	/**
	 * 设置数据项
	 * 
	 * @param key
	 * @param value
	 */
	public void setItem(String key, String value)
	{
		Log.info("session: " + _sessionID + ", putting key: " + key + ", putting value: " + value);
		_items.put(key, value);
	}
	
	/**
	 * 删除数据项
	 * 
	 * @param key
	 */
	public void removeItem(String key) 
	{
		_items.remove(key);
	}
}

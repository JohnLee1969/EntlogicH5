package com.entlogic.h5;

import java.util.HashMap;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;

/**
 * 应用全局类
 * 
 * @author John
 *
 */
public class Application
{
	/**
	 * 应用全局参数
	 */
	private static HashMap<String, Object> prameters;

	/**
	 * 在线用户
	 */
	private static HashMap<String, UserSession> userSessions;

	/**
	 * 设置应用程序参数
	 * 
	 * @param key
	 *            参数名
	 * @param value
	 *            参数值
	 * 
	 * @throws Exception
	 */
	public static void setParameter(String key, Object value) throws Exception
	{
		if (null == prameters)
		{
			prameters = new HashMap<String, Object>();
		}
	
		prameters.put(key, value);
		Log.info(key + " : " + value + "");
	}

	/**
	 * 通过参数名获取应用参数值，如果取不到返回null值
	 * 
	 * @param key
	 *            参数名
	 * @return 对应参数名的值
	 * @throws Exception
	 */
	public static <T extends Object> T getParameter(String key)
	{
		if (null == prameters)
		{
			prameters = new HashMap<String, Object>();
		}

		return getParameter(key, null);
	}

	/**
	 * 通过参数名获取应用参数值，如果取不到，返回参数defaultValue的值
	 * 
	 * @param key
	 *            参数名
	 * @param defaultValue
	 *            默认值
	 * @return 对应参数名的值
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public static <T extends Object> T getParameter(String key, Object defaultValue)
	{
		if (null == prameters)
		{
			prameters = new HashMap<String, Object>();
		}
		
		Object value = prameters.get(key);
		if (null == value)
			return (T) defaultValue;
		else
			return (T) value;
	}

	/**
	 * 添加用户回话。
	 * 
	 * @param key
	 * @param value
	 * @throws Exception
	 */
	public static UserSession addUserSession() throws Exception
	{
		if (null == userSessions)
		{
			userSessions = new HashMap<String, UserSession>();
		}
		
		UserSession sess = new UserSession();
		userSessions.put(sess.getSessionID(), sess);
		Log.info("Create a new user sesson : " + sess.getSessionID() + "");
		return sess;
	}

	/**
	 * 清除用户回话。
	 * 
	 * @param key
	 * @param value
	 * @throws Exception
	 */
	public static void removeUserSession(String key) throws Exception
	{
		if (null == userSessions)
		{
			userSessions = new HashMap<String, UserSession>();
		}
		
		userSessions.remove(key);
		Log.info("Remove a user  session : " + key + "");
	}

	/**
	 * 获取用户回话
	 * 
	 * @param key
	 * @return
	 */
	public static UserSession getUserSession(String key)
	{
		if (null == userSessions)
		{
			userSessions = new HashMap<String, UserSession>();
		}
		
		return userSessions.get(key);
	}
}

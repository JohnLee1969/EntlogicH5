package com.entlogic.h5.logs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author mking
 * 
 */
public class Log
{
	private static boolean configed = false;

	private static Logger logger = LoggerFactory.getLogger("Log");

	private static String buffer(Object... infos)
	{
		StringBuffer info = new StringBuffer(128);
		for (int i = 0; i < infos.length; i++)
		{
			info.append(infos[i]);
		}
		return info.toString();
	}

	public static void config(String host)
	{
		if (configed)
		{
			logger.error("Log can be config only once!");
			return;
		}
		logger = LoggerFactory.getLogger(host);
		configed = true;
	}

	public static void trace(Object... infos)
	{
		logger.trace(buffer(infos));
	}

	public static void trace(Throwable t, Object... infos)
	{
		logger.trace(buffer(infos), t);
	}

	public static void debug(Object... infos)
	{
		logger.debug(buffer(infos));
	}

	public static void debug(Throwable t, Object... infos)
	{
		logger.debug(buffer(infos), t);
	}

	public static void warn(Object... infos)
	{
		logger.warn(buffer(infos));
	}

	public static void warn(Throwable t, Object... infos)
	{
		logger.warn(buffer(infos), t);
	}

	public static void error(Object... infos)
	{
		logger.error(buffer(infos));
	}

	public static void error(Throwable t, Object... infos)
	{
		logger.error(buffer(infos), t);
	}

	public static void info(Object... infos)
	{
		logger.info(buffer(infos));
	}

	public static void info(Throwable t, Object... infos)
	{
		logger.info(buffer(infos), t);
	}
}

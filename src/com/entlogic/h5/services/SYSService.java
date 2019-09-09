package com.entlogic.h5.services;

import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;

import com.entlogic.h5.Application;
import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;
import com.entlogic.h5.db.QueryStatement;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;
import com.entlogic.h5.utils.CheckCode;

/**
 * 服务器端文件系统操服务
 * 
 * @author John
 * 
 */
public class SYSService
{
	/**
	 * 服务器测试
	 * 
	 * @param parameters
	 * @param session
	 * @return
	 */
	@BpCommand(registedName = "服务器测试", logged = false)
	public static DataPackage test(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();
		
		try
		{			
			dpOut.addReturn("result",  "success");
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
			catch (Exception ex)
			{
				return null;
			}
		}
	}

	/**
	 * 获取用户回话数据项
	 * 
	 * @param parameters
	 * @param session
	 * @return
	 */
	@BpCommand(registedName = "获取用户回话数据项", logged = false)
	public static DataPackage getUserSessionItem(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();
		
		try
		{
			String key = parameters.getValue("key");
			String value = session.getItem(key);
			
			dpOut.addReturn("result", value);
			
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
			catch (Exception ex)
			{
				return null;
			}
		}
	}
	
	/**
	 * 删除用户回话数据项
	 * 
	 * @param parameters
	 * @param session
	 * @return
	 */
	@BpCommand(registedName = "设置用户回话数据项", logged = false)
	public static DataPackage removeUserSessionItem(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();
		
		try
		{
			String key = parameters.getValue("key");
			
			session.removeItem(key);
			
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
			catch (Exception ex)
			{
				return null;
			}
		}
	}
	
	/**
	 * 获取用户回话数据项
	 * 
	 * @param parameters
	 * @param session
	 * @return
	 */
	@BpCommand(registedName = "设置用户回话数据项", logged = false)
	public static DataPackage setUserSessionItem(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();
		
		try
		{
			String key = parameters.getValue("key");
			String value = parameters.getValue("value");
			
			session.setItem(key, value);
			
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
			catch (Exception ex)
			{
				return null;
			}
		}
	}
	
	/**
	 * 获取后台验证码图像
	 * 
	 * @param parameters
	 * @param session
	 * @return
	 */
	@BpCommand(registedName = "获取后台验证码图像", logged = false)
	public static DataPackage getCheckCodeImage(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();
		
		try
		{
			String contextRealPath = Application.getParameter("ContextRealPath");
			String checkCode = (int) ((Math.random() * 9 + 1) * 1000) + "";
			String imageFilePath = session.getItem("checkCodePath");
			if (imageFilePath == null)
			{
				imageFilePath = "/app_data/entlogicSystem/check_codes/" + checkCode + ".jpg";
				session.setItem("checkCodePath", imageFilePath);
			}
			session.setItem("checkCode", checkCode);
			
			BufferedImage img = CheckCode.getCodeImage(checkCode);
			ImageIO.write(img, "JPEG", new File(contextRealPath + imageFilePath));
			
			dpOut.addReturn("result", imageFilePath);
			
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
			catch (Exception ex)
			{
				return null;
			}
		}
	}
	
	/**
	 * 获取后台验证码图像
	 * 
	 * @param parameters
	 * @param session
	 * @return
	 */
	@BpCommand(registedName = "获取后台验证码图像", logged = false)
	public static DataPackage verifyCheckCode(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();
		
		try
		{
			String checkCode = parameters.getValue("checkCode");
			String checkCodeServer = session.getItem("checkCode");
			
			if (checkCode.equals(checkCodeServer))
			{
				dpOut.addReturn("result", "success");
			}
			else
			{
				dpOut.addReturn("errorMessage", "验证码输入错误！！");
				dpOut.addReturn("result", "not success");
			}
			
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
			catch (Exception ex)
			{
				return null;
			}
		}
	}
	
	@BpCommand(registedName = "系统登录", logged = false)
	public static DataPackage login(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();
		
		try
		{
			String dsn = parameters.getValue("dsn");
			String userTable = parameters.getValue("userTable");
			String userNameCol = parameters.getValue("userNameCol");
			String passwordCol = parameters.getValue("passwordCol");
			
			String userName = parameters.getValue("userName");
			String password = parameters.getValue("password");
			String checkCode = parameters.getValue("checkCode");
			
			String checkCodeServer = session.getItem("checkCode");
			
			if (checkCode.equals(checkCodeServer))
			{
				dpOut.addReturn("result", "success");
			}
			else
			{
				dpOut.addReturn("errorMessage", "验证码输入错误！！");
				dpOut.addReturn("result", "not success");
			}
			
			QueryStatement guery = new QueryStatement();
			guery.SQL = "select OID from " + userTable + " "
					+ "where " + userNameCol + " = '" + userName + "' and " + passwordCol + " = '" + password + "'";
			DataTable dt = guery.excute(dsn, null);
			
			if (dt.getSize() == 1)
			{
				session.setItem("userOid", dt.getRecord(0).getValue("OID"));
				session.setLogin();
				dpOut.addReturn("result", "success");
			}
			else
			{
				dpOut.addReturn("errorMessage", "登录用户名或密码错误！！");
				dpOut.addReturn("result", "not success");
			}
			
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
			catch (Exception ex)
			{
				return null;
			}
		}
	}
}

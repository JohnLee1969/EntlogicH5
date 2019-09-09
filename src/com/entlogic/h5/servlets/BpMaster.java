package com.entlogic.h5.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.entlogic.h5.Application;
import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;
import com.entlogic.h5.utils.Base64;

/**
 * <p>
 * Title: BpMaster : MCP
 * </p>
 * <p>
 * Description: BpMaster master control program
 * </p>
 * <p>
 * Copyright:2013-2014 gerfalcon Rights Reserved
 * </p>
 * <p>
 * Organization: gerfalcon.org
 * </p>
 * 
 * @author horus.mo
 * @version 1.0
 */
public class BpMaster extends HttpServlet implements Serializable
{
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 4468605452866248826L;

	/**
	 * initialize MCP
	 * 
	 * @throws ServletException
	 */
	public void init() throws ServletException
	{
		try
		{
			Log.info(getServletName(), " loading...");

			String contextPath = getServletContext().getContextPath();
			Application.setParameter("ContextPath", contextPath);

			String contextRealPath = getServletContext().getRealPath("/").replaceAll("\\\\", "/");
			Application.setParameter("ContextRealPath", contextRealPath);

			Enumeration<?> parameterNames = getInitParameterNames();
			while (parameterNames.hasMoreElements())
			{
				String parameterName = (String) parameterNames.nextElement();
				String parameterValue = getInitParameter(parameterName);
				Application.setParameter(parameterName, parameterValue);
			}

			Log.info(getServletName(), " load complete!");
		}
		catch (Exception err)
		{
			err.printStackTrace();
		}
	}

	/**
	 * MCP doGet access point
	 * 
	 * @param req
	 *            HttpServletRequest
	 * @param res
	 *            HttpServletResponse
	 * 
	 * @throws IOException
	 */
	protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		doService(req, res);
	}

	/**
	 * MCP doPost access point
	 * 
	 * @param req
	 *            HttpServletRequest
	 * @param res
	 *            HttpServletResponse
	 * @throws IOException
	 * 
	 */
	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		doService(req, res);
	}

	/**
	 * service action
	 * 
	 * @param req
	 *            HttpServletRequest
	 * @param res
	 *            HttpServletResponse
	 * @return void
	 */
	private void doService(HttpServletRequest req, HttpServletResponse res)
	{
		String sessionId = null;
		String bpId = null;
		String command = null;
		String data = null;
		String registedName = null;
		Boolean logged = false;
		
		try
		{
			// 设置跨域访问
			res.setHeader("Access-Control-Allow-Origin", "*");
	        /* 星号表示所有的异域请求都可以接受， */
			res.setHeader("Access-Control-Allow-Methods", "GET,POST");
			
			// 获取调用指向参数
			sessionId = req.getParameter("sessionId");
			bpId = req.getParameter("bpId");
			command = req.getParameter("command");
			
			// 进行安全验证
			UserSession userSession = Application.getUserSession(sessionId);
			if (userSession == null)
			{
				userSession = Application.addUserSession();
				sessionId = userSession.getSessionID();
			}
					
			// 还原成交换数据包
			data =  req.getParameter("data");
			data = new String((data.getBytes("ISO-8859-1")), "UTF-8");
			DataRecord parameters  = new DataRecord();
			parameters.loadXML(data);
			
			// 解码
			for (int i = 0; i < parameters.getSize(); i++)
			{
				String str = parameters.getValue(i);
				str = Base64.base64_decodeToUtf8(str);
				parameters.setData(i, str);
			}
			
			// 动态调用后台静态数据服务
			Class<?> threadClazz = Class.forName(bpId);
			Method method = threadClazz.getMethod(command, DataRecord.class, UserSession.class);
			registedName = method.getAnnotation(BpCommand.class).registedName();
			logged = method.getAnnotation(BpCommand.class).logged();
			
			// 执行动态方法
			DataPackage retrunPackage = new DataPackage();
			Object o = method.invoke(null, parameters, userSession);
			if (o == null)
			{
				throw new Exception("后台服务模块错误，请查看后台日志！");
			}
			
			// 返回结果数据
			retrunPackage = (DataPackage) o;
			retrunPackage.addReturn("sessionId", sessionId);
			response(res, "<response><result>success</result>" + retrunPackage.toXML() + "</response>");
			
			// 如果需要记日志
			if (logged)
			{
				Log.info(bpId + "." + registedName + "：记成功日志！！");
			}
			
			// 调用成功
			Log.info(bpId + "." + registedName + "：调用成功！！");
		}
		catch (Exception err)
		{
			try
			{
				// 如果需要记日志
				if (logged)
				{
					Log.info(bpId + "." + registedName + "：记失败日志！！");
				}
			}
			catch(Exception ec) 
			{
				Log.error(ec, ec.toString());
				response(res, "<response><result>faild</result></response>");
			}
			Log.error(err, err.toString());
			response(res, "<response><result>faild</result></response>");
		}
	}
	
	private void response(HttpServletResponse res, String data)
	{
		try
		{
			res.setCharacterEncoding("utf-8");
			res.setContentType("text/xml");
			PrintWriter out = res.getWriter();
			out.println(data);
			out.flush();
		}
		catch (Exception err)
		{
			Log.error(err, err.toString());
		}
	}

}

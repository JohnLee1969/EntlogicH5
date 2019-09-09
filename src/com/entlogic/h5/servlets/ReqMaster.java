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
public class ReqMaster extends HttpServlet implements Serializable
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
		String bpId = null;
		String command = null;
		
		try
		{
			// 获取调用指向参数
			bpId = req.getParameter("bpId");
			command = req.getParameter("command");
			
			// 进行安全验证
			HttpSession session;
			if (bpId.equals("com.entlogic.h5.forms.LoginForm"))
			{
				session = req.getSession(true);
			}
			else
			{
				session = req.getSession(false);
				if (session == null)
				{
					response(res, "<response><result>session time out</result></response>");
					return;
				}
				else
				{
					// 进行访问安全验证
				}
			}
			
			// 动态调用后台静态数据服务
			Class<?> threadClazz = Class.forName(bpId);
			Method method = threadClazz.getMethod(command, HttpServletResponse.class);
			
			// 执行动态方法
			Object o = method.invoke(null, req);
			if (o == null)
			{
				throw new Exception("后台服务模块错误，请查看后台日志！");
			}
			
			// 返回结果数据
			String retrunString = (String) o;
			retrunString = Base64.base64_encode(retrunString);
			response(res, "<response>" + retrunString + "</response>");
		}
		catch (Exception err)
		{
			Log.error(err, err.toString());
			response(res, "<response>faild</response>");
		}
	}
	
	/**
	 * 返回结果
	 * 
	 * @param res
	 * @param data
	 */
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

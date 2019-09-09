package com.entlogic.h5.servlets;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.entlogic.h5.Application;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;
import com.entlogic.h5.utils.FileUtils;
import com.entlogic.h5.utils.Formater;

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
public class UploadBigFile extends HttpServlet implements Serializable
{
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 8004526087377913025L;

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
		try
		{
			// 设置跨域访问
			res.setHeader("Access-Control-Allow-Origin", "*");
	        /* 星号表示所有的异域请求都可以接受， */
			res.setHeader("Access-Control-Allow-Methods", "GET,POST");
			
			// 获取调用指向参数
			String sessionId = req.getParameter("sessionId");
			
			// 进行安全验证
			UserSession userSession = Application.getUserSession(sessionId);
			if (userSession == null)
			{
				userSession = Application.addUserSession();
				sessionId = userSession.getSessionID();
			}
			
			String path = req.getParameter("path");
			String blockCount = req.getParameter("blockCount");
			String blockSn = req.getParameter("blockSn");
			int bSn = Integer.parseInt(blockSn);
			blockSn = "";
			if (bSn < 100) blockSn+= "0";
			if (bSn < 10) blockSn+= "0";
			blockSn += bSn;
			
			String contextRealPath =  Application.getParameter("ContextRealPath");
			String realPath = contextRealPath + path;
			String  tempPath = contextRealPath + path + ".tmp";
			File tempDir = new File(tempPath);
			if (!tempDir.exists())
			{
				tempDir.mkdirs();
			}
			realPath = tempPath +"/block_" + blockSn; ;
			
			// 获取上传文件
			DiskFileItemFactory fileFactory = null;
			ServletFileUpload fileUpload = null;

			fileFactory = new DiskFileItemFactory();
			fileFactory.setSizeThreshold(4096);
			fileUpload = new ServletFileUpload(fileFactory);
			fileUpload.setSizeMax(10000000);

			List<FileItem> fileItems = fileUpload.parseRequest(req);
			Iterator<FileItem> iter = fileItems.iterator();
			while (iter.hasNext())
			{
				FileItem item = (FileItem) iter.next();
				if (!item.isFormField())
				{
					if (!FileUtils.isValidUploadingFile(item.getName()))
					{
						//continue;
					}		
					File file = new File(realPath );
					item.write(file);
					item.delete();
					break;
				}
			}	
			
			// 判断是否传完
			String result = "file-block:" + blockSn + ", uploaded!!";
			if (tempDir.listFiles().length == Integer.parseInt(blockCount))
			{
				String finalPath = contextRealPath + path;
				File finalFile = new File(finalPath);			
				FileOutputStream out = new FileOutputStream(finalFile);
				String blockFilePath = "";
				String sn = "";
				byte[] buffer;
				for(int i = 0; i < tempDir.listFiles().length; i++)
				{
					sn = "";
					if (i < 100) sn += "0";
					if (i < 10) sn += "0";
					sn += i;
					blockFilePath = tempPath + "/block_" +  sn; 
					buffer = FileUtils.readToByteArray(blockFilePath);
					out.write(buffer, 0, buffer.length);
				}
				out.flush();
				out.close();		
				FileUtils.deleteFile(tempDir);
				result = "Uploading success!! " + path;
			}
			
			
			// 调用成功
			Log.info("：调用成功！！");
			
			response(res, "<response><result>" + result + "</result></response>");
		}
		catch (Exception err)
		{
			Log.error(err, err.toString());
			response(res, "<response><result>faild</result></response>");
		}
		finally
		{
		}
	}
	
	private void response(HttpServletResponse res, String data)
	{
		try
		{
			Log.info(data);
			
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

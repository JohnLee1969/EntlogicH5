package com.entlogic.h5.services;

import java.io.File;
import java.util.Date;
import java.util.regex.Pattern;

import javax.xml.bind.DatatypeConverter;

import org.apache.commons.io.FileUtils;

import com.entlogic.h5.Application;
import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;
import com.entlogic.h5.utils.Base64;
import com.entlogic.h5.utils.Formater;

/**
 * 服务器端文件系统操服务
 * 
 * @author John
 * 
 */
public class FileService
{
	/**
	 * 加载文件树
	 * 
	 * @return
	 */
	@BpCommand(registedName = "加载后台文件系统树结构", logged = false)
	public static DataPackage loadFileTree(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			DataTable dtFileNode = new DataTable();
			
			String rootPath = parameters.getValue("rootPath");
			String filter = parameters.getValue("filter");
			String contextRealPath = Application.getParameter("ContextRealPath");
			File path = new File(contextRealPath + rootPath);
			
			if (path.exists())
			{
				File[] fNodes = path.listFiles();
				for (File fNode : fNodes)
				{
					dtFileNode = loadFileNode(fNode, dtFileNode, 0, filter);
				}
			}
			
			dtFileNode.id = "dtFileNode";
			dpOut.addDataTable(dtFileNode);
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage",e.getMessage());
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
	 * 加载文件数递归函数
	 * 
	 * @param f
	 * @param dt
	 * @param c
	 * @return
	 * @throws Exception
	 */
	private static DataTable loadFileNode(File f, DataTable dt, int c, String filter) throws Exception
	{
		String contextRealPath = Application.getParameter("ContextRealPath");
		
		String pattern = filter;
		String fileName = f.getName();
		String filePath = f.getAbsolutePath();
		filePath = filePath.replaceAll("\\\\", "/");
		filePath = filePath.replaceAll(contextRealPath, "");
		filePath = "/" + filePath;
		
		if (Pattern.matches(pattern, fileName) || f.isDirectory())
		{
			DataRecord dr = new DataRecord();
			dr.addData("id", filePath);
			dr.addData("lv", c + "");
			dr.addData("NODE_NAME", fileName);
			dr.addData("NODE_VALUE", filePath);
			if (f.isDirectory())
			{
				dr.addData("NODE_ICON", "&#xe64b;");
				dr.addData("NODE_TYPE", "folder");
			}
			else
			{
				dr.addData("NODE_ICON", "&#xe616;");
				dr.addData("NODE_TYPE", "file");
			}
			dr.addData("PARENT_NODE", filePath);
			dt.addRecord(dr);
			
			File[] fs = f.listFiles();
			if (fs != null)
			{
				for (File n : fs)
				{
					loadFileNode(n, dt, c + 1, filter);
				}
			}
		}
		
		return dt;
	}
	
	/**
	 * 获取UTF-8文本文件
	 * 
	 * @param parameters
	 * @param session
	 * @return
	 */
	@BpCommand(registedName = "加载UTF-8文本文件", logged = false)
	public static DataPackage loadTextFile(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String contextRealPath = Application.getParameter("ContextRealPath");
			String filePath = parameters.getValue("filePath");
			File file = new File(contextRealPath + filePath);
			String strContent = FileUtils.readFileToString(file, "UTF-8");
			strContent = Base64.base64_encode(strContent);
			
			dpOut.addReturn("fileName", filePath);
			dpOut.addReturn("fileContent", strContent);
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage",e.getMessage());
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
	 * 保存UTF-8文本文件
	 * 
	 * @param parameters
	 * @param session
	 * @return
	 */
	@BpCommand(registedName = "保存UTF-8文本文件", logged = false)
	public static DataPackage saveTextFile(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String contextRealPath = Application.getParameter("ContextRealPath");
			String filePath = parameters.getValue("filePath");
			String fileContent = parameters.getValue("fileContent");
			
			File file = new File(contextRealPath + filePath);
			
			if (!file.exists()) 
			{
				dpOut.addReturn("result", "faild");
			}
			else
			{
				FileUtils.writeStringToFile(file, fileContent, "UTF-8");
				dpOut.addReturn("result", "success");
			}
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage",e.getMessage());
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
	 * 加载二进制文件
	 * @param parameters
	 * @param session
	 * @return
	 */
	@BpCommand(registedName = "下载二进制文件的Base64格式", logged = false)
	public static DataPackage loadBinaryFile(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String contextRealPath = Application.getParameter("ContextRealPath");
			String filePath = parameters.getValue("filePath");
			filePath = contextRealPath + filePath;
			File file = new File(contextRealPath + filePath);
			byte[] fileData = FileUtils.readFileToByteArray(file);
			String strContent = Base64.base64_encode(fileData);
			
			dpOut.addReturn("fileName", filePath);
			dpOut.addReturn("fileContent", strContent);
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage",e.getMessage());
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
	 * 保存二进制文件
	 * @param parameters
	 * @param session
	 * @return
	 */
	@BpCommand(registedName = "保存二进制文件", logged = false)
	public static DataPackage saveBinaryFile(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String path = parameters.getValue("path");
			String fileContent = parameters.getValue("fileContent");
			
			String realPath = Application.getParameter("ContextRealPath") + path;
			
			int i = fileContent.indexOf(";base64,");
			i += 8;
			fileContent = fileContent.substring(i);
			
			File file = new File(realPath);			
			byte[] data = Base64.base64_decodeToBinary(fileContent);		
			FileUtils.writeByteArrayToFile(file, data);
			
			dpOut.addReturn("result", "success");			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage",e.getMessage());
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
	 * 删除文件
	 * @param parameters
	 * @param session
	 * @return
	 */
	@BpCommand(registedName = "删除文件", logged = false)
	public static DataPackage deleteFile(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String contextRealPath = Application.getParameter("ContextRealPath");
			String filePath = parameters.getValue("path");
			
			File file = new File(contextRealPath + filePath);
			
			if (!file.exists()) 
			{
				dpOut.addReturn("errorMessage", "删除文件不存在！！");
				dpOut.addReturn("result", "faild");
			}
			else
			{
				file.delete();
				dpOut.addReturn("result", "success");
			}			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage",e.getMessage());
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
	 * 保存二进制文件
	 * 
	 * @param parameters
	 * @param session
	 * @return
	 */
	@BpCommand(registedName = "保存二进制文件", logged = false)
	public static DataPackage copyFile(DataRecord parameters, UserSession session) {
		DataPackage dpOut = new DataPackage();

		try {
			String orgPath = parameters.getValue("filePath");
			String tarPath = parameters.getValue("filePath");

			String realPath = Application.getParameter("ContextRealPath");
			com.entlogic.h5.utils.FileUtils.copy(realPath + orgPath, realPath + tarPath);
			dpOut.addReturn("result", "success");

			return dpOut;
		} catch (Exception e) {
			Log.error(e);

			try {
				dpOut.addReturn("errorMessage", e.getMessage());
				dpOut.addReturn("result", "faild");

				return dpOut;
			} catch (Exception ex) {
				return null;
			}
		}
	}
	
	/**
	 * 获取后台档案库文件存储路径
	 * @param parameters
	 * @param session
	 * @return
	 */
	@BpCommand(registedName = "获取后台档案路径", logged = false)
	public static DataPackage getAFSPath(DataRecord parameters, UserSession session) {
		DataPackage dpOut = new DataPackage();

		try {
			String appName = parameters.getValue("appName");

			String realPath = Application.getParameter("ContextRealPath");
			String path = "/app_data/" + appName + "/AFS";
			String date = Formater.format(new Date(), "yyyyMMddHHmm");
			path += "/" + date.substring(0, 4);
			path += "/" + date.substring(4, 8);
			path += "/" + date.substring(8, 12);
			
			File folder = new File(realPath + path);
			if (!folder.exists()) {
				folder.mkdirs();
			}

			dpOut.addReturn("result", path);

			return dpOut;
		} catch (Exception e) {
			Log.error(e);

			try {
				dpOut.addReturn("errorMessage", e.getMessage());
				dpOut.addReturn("result", "faild");

				return dpOut;
			} catch (Exception ex) {
				return null;
			}
		}
	}
}

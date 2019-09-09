package com.entlogic.h5.services;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;

import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;
import com.entlogic.h5.utils.Formater;

import net.sf.json.JSONObject;

/**
 * 服务器端文件系统操服务
 * 
 * @author John
 * 
 */
public class VerificationService
{
	/**
	 * 发送短信
	 * 
	 * @return
	 */
	@BpCommand(registedName = "发送短信", logged = false)
	public static DataPackage sendSm(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String phone = parameters.getValue("phone");
			String message = parameters.getValue("message");
			
			String appkey="f8791d9fd65e1ad23599aca824963b88";
			String HttpUrl = "https://api.id98.cn/api/sms?appkey="+appkey+"&phone="+phone+"&templateid=2001&param=" + message;
			String r= getUrlFileInfo(HttpUrl);
			JSONObject jsonObj = JSONObject.fromObject(r);
			String errcode = jsonObj.getString("errcode");
			String smsid = jsonObj.getString("smsid");

			if (!errcode.equals("0")) throw new Exception("发送短信失败！！！");
						
			dpOut.addReturn("result",  smsid);
			
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
	 * 发送短信验证码
	 * 
	 * @return
	 */
	@BpCommand(registedName = "通过图片识别身份证", logged = false)
	public static DataPackage getSmCheckCode(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String phone = parameters.getValue("phone");
			String vCode = (int)((Math.random()*9+1)*1000) + "";
			
			String appkey="f8791d9fd65e1ad23599aca824963b88";
			String HttpUrl = "https://api.id98.cn/api/sms?appkey="+appkey+"&phone="+phone+"&templateid=2001&param=" + vCode;
			String r= getUrlFileInfo(HttpUrl);
			JSONObject jsonObj = JSONObject.fromObject(r);
			r = jsonObj.getString("errcode");

			if (!r.equals("0")) throw new Exception("发送短信验证码失败！！！");
						
			dpOut.addReturn("result",  vCode);
			
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
	 * 身份证手机验证
	 * 
	 * @return
	 */
	@BpCommand(registedName = "身份证手机验证", logged = false)
	public static DataPackage auditCert(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();

		try
		{
			String name = parameters.getValue("name");
			String certCode = parameters.getValue("certCode");
			
			String appkey="f8791d9fd65e1ad23599aca824963b88";
			String HttpUrl = "https://api.id98.cn/api/idcard?appkey="+appkey+"&name="+URLEncoder.encode(name, "UTF-8")+"&cardno=" + certCode;
			String r= getUrlFileInfo(HttpUrl);
			JSONObject jsonObj = JSONObject.fromObject(r);
			String isok = jsonObj.getString("isok");
			String code = jsonObj.getString("code");

			if (isok.equals("0")) throw new Exception("身份证验证失败！！！");
								
			dpOut.addReturn("result",  code);
			
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
	 * 访问远程URL并返回结果
	 * 
	 * @param url
	 * @return
	 */
	public static String getUrlFileInfo(String url)
	{
		String result = "";
		try
		{
			String strLine;
			URL urlObj = new URL(url);
			InputStream streamObj = urlObj.openStream();
			InputStreamReader readerObj = new InputStreamReader(streamObj);
			BufferedReader buffObj = new BufferedReader(readerObj);
			while ((strLine = buffObj.readLine()) != null)
			{
				result += strLine;
			}
			buffObj.close();
			return result;
		}
		catch (Exception e)
		{
			System.err.println("url   error");
			return result;
		}
	}
}

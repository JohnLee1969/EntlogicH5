 package com.entlogic.h5.builder.Coders;

import java.io.File;

import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.entlogic.h5.Application;
import com.entlogic.h5.utils.FileUtils;

/**
 * 
 * @author John
 *
 */
public class CoderHtml
{
	public String appName;
	public String formName;
	public HtmlCss htmlCss;
	public HtmlJs htmlJs;
	public HtmlBody htmlBody;
	
	public CoderHtml(String aN, String fN)
	{
		appName = aN;
		formName = fN;
		htmlCss =new HtmlCss(formName);
		htmlJs = new HtmlJs(formName);
		htmlBody = new HtmlBody();
	}
	
	public void createNew() throws Exception
	{
		
	}
	
	public boolean load() throws Exception
	{
		String contextRealPath = Application.getParameter("ContextRealPath");
		String filePath = contextRealPath + "app_modules/" + appName + "/" + formName + "_D.html";
		
		
		String text = null;
		String tempPath = null;
		File tempFile = null;
		Document doc = null;
		SAXReader reader = new SAXReader();
		reader.setEncoding("UTF-8");
		
		if (!(new File(filePath).exists()))
		{
			filePath = contextRealPath + "app_modules/" + appName + "/" + formName + ".html";
			if (!(new File(filePath).exists())) return false;
			
			text = FileUtils.readToString(filePath);
			text = text.replaceAll("&nbsp;", "ღ");
			tempPath = filePath + "_temp";
			FileUtils.writeToFile(text, tempPath);
			tempFile = new File(tempPath);
			doc = reader.read(tempFile);
			tempFile.delete();
			Element rootElement = doc.getRootElement();
			htmlCss = new HtmlCss(formName);
			htmlCss.load(rootElement);
			htmlJs = new HtmlJs(formName);
			htmlJs.load(rootElement);
			htmlBody = new HtmlBody();
			htmlBody.load(rootElement);
			exportDesign();	
			return true;
		}
		
		tempFile = new File(filePath);
		doc = reader.read(tempFile);
		Element rootElement = doc.getRootElement();		
		htmlCss = new HtmlCss(formName);
		htmlCss.load(rootElement);	
		htmlJs = new HtmlJs(formName);
		htmlJs.load(rootElement);	
		htmlBody = new HtmlBody();
		htmlBody.load(rootElement);
		exportDesign();	
		
		return true;
	}
	
	public void exportDesign() throws Exception
	{
		String contextRealPath = Application.getParameter("ContextRealPath");
		String designPath = contextRealPath + "app_modules/" + appName + "/" + formName + "_D.html";
		
		String htmlText = "";
		htmlText += "<!DOCTYPE html>\n";
		htmlText += "<html>\n";
		
		htmlText += "<head>\n";
		htmlText += "	<title></title>\n";
		htmlText += "	<meta charset='utf-8'></meta>\n";
		htmlText += "	<meta name='viewport' content='width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'></meta>\n";
		
		htmlText += htmlCss.exportHtml();
		htmlText += "	<link href='../../app_modules/" + appName + "/" + formName + ".css' rel='stylesheet' type='text/css'></link>\n";
		
		htmlText += htmlJs.exportHtml();		
		htmlText += "	<script src='../../entlogic/js/entlogic_builder.js'></script>\n";
		htmlText += "</head>\n";
		
		htmlText += htmlBody.exportHtml(htmlBody);
		
		htmlText += "</html>\n";
		htmlText = htmlText.replaceAll("<body", "<body onload='desingPageOnLoad();'");
		htmlText = htmlText.replaceAll("ღ", "&nbsp;");
		FileUtils.writeToFile(htmlText, designPath);
	}
	
	public void export() throws Exception
	{
		String contextRealPath = Application.getParameter("ContextRealPath");
		String designPath = contextRealPath + "app_modules/" + appName + "/" + formName + ".html";
		
		String htmlText = "";
		htmlText += "<!DOCTYPE html>\n";
		htmlText += "<html>\n";
		
		htmlText += "<head>\n";
		htmlText += "	<title></title>\n";
		htmlText += "	<meta charset='utf-8'></meta>\n";
		htmlText += "	<meta name='viewport' content='width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'></meta>\n";
		
		htmlText += htmlCss.exportHtml();
		htmlText += "	<link href='" + formName + ".css' rel='stylesheet' type='text/css'></link>\n";
		
		htmlText += htmlJs.exportHtml();		
		htmlText += "	<script src='" + formName +".js'></script>\n";
		htmlText += "</head>\n";
		
		htmlText += htmlBody.exportHtml(htmlBody);
		
		htmlText += "</html>\n";
		htmlText = htmlText.replaceAll("<body", "<body onload='bodyOnload();'");
		htmlText = htmlText.replaceAll("ღ", "&nbsp;");
		FileUtils.writeToFile(htmlText, designPath);
	}
}

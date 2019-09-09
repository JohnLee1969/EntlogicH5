package com.entlogic.h5.utils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.Serializable;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.dom4j.DocumentException;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

/**
 * <p>
 * Title: Formater
 * </p>
 * <p>
 * Description:Format Utility Provide some format methods
 * </p>
 * <p>
 * Copyright:2013-2014 gerfalcon Rights Reserved
 * </p>
 * <p>
 * Organization: entlogic.com
 * </p>
 * 
 * @author horus.mo
 * @version 1.0
 */
public class Formater implements Serializable
{
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -8673838659548045968L;

	/**
	 * format XML to a pretty String
	 * 
	 * @param source
	 *            source string be formated
	 * @param charcode
	 *            character codes
	 * @return result XML string after format
	 * 
	 * @throws DocumentException
	 * @throws IOException
	 * @throws UnsupportedEncodingException
	 */
	public static String prettyXML(String source, String charcode) throws UnsupportedEncodingException, IOException, DocumentException
	{
		SAXReader saxReader = new SAXReader();
		StringWriter writer = new StringWriter();
		OutputFormat format = OutputFormat.createPrettyPrint();
		format.setEncoding(charcode);
		XMLWriter xmlwriter = new XMLWriter(writer, format);
		xmlwriter.write(saxReader.read(new ByteArrayInputStream(source.getBytes(charcode))));
		return writer.toString();
	}

	/**
	 * format XML to a pretty String use character codes UTF-8 as default
	 * 
	 * @param source
	 *            source string be formated
	 * @return result XML string after format
	 */
	public static String prettyXML(String source) throws Exception
	{
		return prettyXML(source, "utf-8");
	}

	/**
	 * clean XML Property some unmatched char
	 * 
	 * @param source
	 *            source string be formated
	 * @return result string after format
	 */
	public static String cleanXMLProperty(String source)
	{
		String result = source;
		result = result.replaceAll("&", "&amp;");
		result = result.replaceAll(" ", "&#160;");
		result = result.replaceAll("&nbsp;", "&#160;");
		result = result.replaceAll("<", "&lt;");
		result = result.replaceAll(">", "&gt;");
		result = result.replaceAll("\"", "&quot;");
		result = result.replaceAll("'", "&apos;");
		return result;
	}

	/**
	 * format Date to String by given formatString
	 * 
	 * @param date
	 *            date to be formated
	 * @param format
	 *            formatString
	 * @return result string after format
	 */
	public static String format(Date date, String format) throws ParseException
	{
		if (date == null)
			return "";

		SimpleDateFormat sdf = new SimpleDateFormat(format);
		return sdf.format(date);
	}

	/**
	 * format Date to String by given formatString
	 * 
	 * @param source
	 *            source date String to be parsed
	 * @param format
	 *            formatString
	 * @return result date
	 * @throws ParseException
	 */
	public static Date parse(String source, String format) throws ParseException
	{
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		return sdf.parse(source);
	}
	
	/**
	 * 判断是否为数字
	 * 
	 * @param str
	 * @return
	 */
    public static boolean isNumeric(String str)
    {
           Pattern pattern = Pattern.compile("[0-9]*");
           Matcher isNum = pattern.matcher(str);
           if( !isNum.matches() ){
               return false;
           }
           return true;
    }


	public static void main(String[] args) throws Exception
	{
		System.out.println(prettyXML("<?xml version=\"1.0\" encoding=\"utf-8\"?><Form><contextPath>contextPath</contextPath></Form>"));
	}
}

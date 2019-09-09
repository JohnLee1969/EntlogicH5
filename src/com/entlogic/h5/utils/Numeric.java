package com.entlogic.h5.utils;

/**
 * <p>
 * Title: Numeric:
 * </p>
 * <p>
 * Description: Numeric
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
public class Numeric
{
	private static final String CHT_NU[] = { "\u96f6", "\u58f9", "\u8d30", "\u53c1", "\u8086", "\u4f0d", "\u9646", "\u67d2", "\u634c", "\u7396" };

	private static final String CHT_UN = "\u4ebf\u4edf\u4f70\u62fe\u842c\u4edf\u4f70\u62fe";

	private static final String CHT_DE = "\u89d2\u5206\u5398\u6beb\u4e1d\u5ffd";

	public static Short parseToShort(String number, Short def)
	{
		try
		{
			return Short.parseShort(number);
		}
		catch (Exception err)
		{
			if (null != def)
				return def;
			else
				return 0;
		}
	}

	public static Long parseToLong(String number, Long def)
	{
		try
		{
			return Long.parseLong(number);
		}
		catch (Exception err)
		{
			if (null != def)
				return def;
			else
				return new Long(0);
		}
	}

	public static Integer parseToInteger(String number, Integer def)
	{
		try
		{
			return Integer.parseInt(number);
		}
		catch (Exception err)
		{
			if (null != def)
				return def;
			else
				return new Integer(0);
		}
	}

	public static Double parseToDouble(String number, Double def)
	{
		try
		{
			return Double.parseDouble(number);
		}
		catch (Exception err)
		{
			if (null != def)
				return def;
			else
				return new Double(0);
		}
	}

	public static Float parseToFloat(String number, Float def)
	{
		try
		{
			return Float.parseFloat(number);
		}
		catch (Exception err)
		{
			if (null != def)
				return def;
			else
				return new Float(0);
		}
	}

	public static Boolean parseToBoolean(String value, Boolean def)
	{
		try
		{
			return Boolean.parseBoolean(value);
		}
		catch (Exception err)
		{
			if (null != def)
				return def;
			else
				return new Boolean(false);
		}
	}

	/**
	 * return a amount of money in CHT
	 * 
	 * @param amount
	 *            amount of money
	 * @return Amount In Words
	 */
	public static String moneyToCHT(String amount) throws Exception
	{
		StringBuffer bufIntegerResult = new StringBuffer(128);
		StringBuffer bufDecimalResult = new StringBuffer(32);
		StringBuffer bufIntegerTchCha = new StringBuffer(32);
		String realDigits = amount.replaceAll("[,，]", "");
		new Double(realDigits);
		String strIntResult = "";
		String strDecResult = "";
		String integerDigits = "";
		String decimalDigits = "";
		String strRealIntTch = "";
		String strRealDecTch = "";
		String[] digitParts = realDigits.split("\\.");
		integerDigits = digitParts.length > 0 ? digitParts[0] : "";
		decimalDigits = digitParts.length > 1 ? digitParts[1] : "";
		int lengthOfInteger = integerDigits.length();
		int lengthOfdecimal = decimalDigits.length();

		while (bufIntegerTchCha.toString().length() < lengthOfInteger)
		{
			bufIntegerTchCha.append(CHT_UN);
		}

		bufIntegerTchCha.append(" ");
		strRealIntTch = bufIntegerTchCha.toString();
		strRealIntTch = strRealIntTch.substring((strRealIntTch.length() - lengthOfInteger));

		for (int i = 0; i < lengthOfInteger; i++)
		{
			int number = new Integer("" + integerDigits.charAt(i));
			bufIntegerResult.append(CHT_NU[number]);
			bufIntegerResult.append(strRealIntTch.charAt(i));
		}

		strIntResult = bufIntegerResult.toString();
		strIntResult = strIntResult.replaceAll(" ", "");
		strIntResult = strIntResult.replaceAll("\u96f6\u62fe", "\u96f6");
		strIntResult = strIntResult.replaceAll("\u96f6\u4f70", "\u96f6");
		strIntResult = strIntResult.replaceAll("\u96f6\u4edf", "\u96f6");
		strIntResult = strIntResult.replaceAll("\u96f6+", "\u96f6");
		strIntResult = strIntResult.replaceAll("\u96f6\u842c", "\u842c");
		strIntResult = strIntResult.replaceAll("\u96f6\u4ebf", "\u4ebf");
		strIntResult = strIntResult.replaceAll("\u4ebf\u842c", "\u4ebf");
		if (strIntResult.indexOf("\u96f6") == 0)
			strIntResult = strIntResult.replaceAll("\u96f6", "");
		if (strIntResult.indexOf("\u58f9\u62fe") == 0)
			strIntResult = strIntResult.replaceFirst("\u58f9\u62fe", "\u62fe");
		if (strIntResult.substring(strIntResult.length() - 1, strIntResult.length()).equals("\u96f6"))
			strIntResult = strIntResult.substring(0, strIntResult.length() - 1);
		strRealDecTch = CHT_DE;
		if (lengthOfdecimal > 6)
			decimalDigits = decimalDigits.substring(0, 6);
		lengthOfdecimal = decimalDigits.length();
		for (int i = 0; i < lengthOfdecimal; i++)
		{
			int number = new Integer("" + decimalDigits.charAt(i));
			bufDecimalResult.append(CHT_NU[number]);
			bufDecimalResult.append(strRealDecTch.charAt(i));
		}
		strDecResult = bufDecimalResult.toString();
		strDecResult = strDecResult.replaceAll("\u96f6\u89d2", "\u96f6");
		strDecResult = strDecResult.replaceAll("\u96f6\u5206", "\u96f6");
		strDecResult = strDecResult.replaceAll("\u96f6\u5398", "\u96f6");
		strDecResult = strDecResult.replaceAll("\u96f6\u6beb", "\u96f6");
		strDecResult = strDecResult.replaceAll("\u96f6\u4e1d", "\u96f6");
		strDecResult = strDecResult.replaceAll("\u96f6\u5ffd", "\u96f6");
		strDecResult = strDecResult.replaceFirst("\u96f6+", "");

		if ("".equalsIgnoreCase(strDecResult.trim()))
		{
			strIntResult = strIntResult + "\u5706\u6574";
		}
		else
		{
			strIntResult = strIntResult + "\u5706";
		}

		return strIntResult + strDecResult;
	}

	public static String parseToUnicode(String str)
	{
		str = (str == null ? "" : str);
		String tmp;
		StringBuffer sb = new StringBuffer(1000);
		char c;
		int i, j;
		sb.setLength(0);
		for (i = 0; i < str.length(); i++)
		{
			c = str.charAt(i);
			sb.append("\\u");
			j = (c >>> 8);
			tmp = Integer.toHexString(j);
			if (tmp.length() == 1)
				sb.append("0");
			sb.append(tmp);
			j = (c & 0xFF);
			tmp = Integer.toHexString(j);
			if (tmp.length() == 1)
				sb.append("0");
			sb.append(tmp);

		}
		return sb.toString();
	}

	public static void main(String[] args) throws Exception
	{
		System.out.println(moneyToCHT("103450789"));
	}
}

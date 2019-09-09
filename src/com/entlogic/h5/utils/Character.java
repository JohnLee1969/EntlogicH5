package com.entlogic.h5.utils;

import java.awt.Dimension;
import java.awt.Font;
import java.awt.FontMetrics;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Vector;

import javax.swing.JComponent;
import javax.swing.JLabel;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;

public class Character implements Serializable
{
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -6428073437026028015L;

	private static final HanyuPinyinOutputFormat formatNoToneUseV = new HanyuPinyinOutputFormat();

	private static final HanyuPinyinOutputFormat formatWithToneUseU = new HanyuPinyinOutputFormat();

	private static final JComponent ruler = new JLabel();

	static
	{
		formatNoToneUseV.setCaseType(HanyuPinyinCaseType.LOWERCASE);
		formatNoToneUseV.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
		formatNoToneUseV.setVCharType(HanyuPinyinVCharType.WITH_V);

		formatWithToneUseU.setCaseType(HanyuPinyinCaseType.LOWERCASE);
		formatWithToneUseU.setToneType(HanyuPinyinToneType.WITH_TONE_MARK);
		formatWithToneUseU.setVCharType(HanyuPinyinVCharType.WITH_U_UNICODE);
	}

	public static String cutting(String source, Dimension requestArea, Font font)
	{
		return cutting(source, requestArea, font, 0, 1);
	}

	public static String cutting(String source, Dimension requestArea, Font font, double charGap)
	{
		return cutting(source, requestArea, font, charGap, 1);
	}

	public static String cutting(String source, Dimension requestArea, Font font, double charGap, double lineHeight)
	{
		if (null == source || source.isEmpty())
		{
			return source;
		}

		Dimension sourceArea = measure(source, font, charGap, lineHeight);
		int sourceAreaSize = sourceArea.width * sourceArea.height;
		int requestAreaSize = requestArea.width * requestArea.height;
		if (sourceAreaSize <= requestAreaSize)
		{
			return source;
		}
		else
		{
			int len = source.length();
			int index = len / 2;
			int offset = len / 4;
			Dimension measureArea = measure(source.substring(0, len - 1), font, charGap, lineHeight);
			int measureAreaSize = measureArea.width * measureArea.height;
			while (true)
			{
				if (measureAreaSize == requestAreaSize)
				{
					break;
				}

				if (measureAreaSize > requestAreaSize)
				{
					index -= offset;
				}
				else if (measureAreaSize < requestAreaSize)
				{
					measureArea = measure(source.substring(0, index + 1), font, charGap, lineHeight);
					if ((measureArea.width * measureArea.height) > requestAreaSize)
					{
						break;
					}
					index += offset;
				}
				offset = offset / 2;
				if (offset < 1)
					offset = 1;
				measureArea = measure(source.substring(0, index), font, charGap, lineHeight);
				measureAreaSize = measureArea.width * measureArea.height;
			}
			return source.substring(0, index);
		}
	}

	public static Dimension measure(String source, Font font)
	{
		return measure(source, font, 0, 1);
	}

	public static Dimension measure(String source, Font font, double charGap)
	{
		return measure(source, font, charGap, 1);
	}

	public static Dimension measure(String source, Font font, double charGap, double lineHeight)
	{
		FontMetrics fm = ruler.getFontMetrics(font);
		int gapWidth = (int) ((charGap) * (source.length() - 1));
		int width = fm.stringWidth(source) + gapWidth;
		int height = (int) (fm.getHeight() * lineHeight);
		return new Dimension(width, height);
	}

	public static String toPinyin(String chinese)
	{
		return toPinyin(chinese, false, false, false, false);
	}

	public static String toPinyin(String chinese, boolean fullpy)
	{
		return toPinyin(chinese, fullpy, false, false, false);
	}

	public static String toPinyin(String chinese, boolean fullpy, boolean upperCase)
	{
		return toPinyin(chinese, fullpy, upperCase, false, false);
	}

	public static String toPinyin(String chinese, boolean fullpy, boolean upperCase, boolean useToneMark)
	{
		return toPinyin(chinese, fullpy, upperCase, useToneMark, false);
	}

	public static String toPinyin(String chinese, boolean fullpy, boolean upperCase, boolean useToneMark, boolean justOne)
	{
		char[] arr = chinese.toCharArray();
		Vector<String[]> rets = new Vector<String[]>();
		for (int i = 0; i < arr.length; i++)
		{
			String[] ps = null;
			if (arr[i] > 128)
			{
				try
				{
					ps = PinyinHelper.toHanyuPinyinStringArray(arr[i], useToneMark ? formatWithToneUseU : formatNoToneUseV);
				}
				catch (Exception err)
				{
					ps = null;
					err.printStackTrace();
				}
			}
			else
			{
				String str = (arr[i] + "").replaceAll("(?i)[^a-zA-Z0-9\u4E00-\u9FA5]", "");
				if (!str.isEmpty())
					ps = new String[] { str };
				else
					ps = null;
			}

			if (null != ps)
			{
				HashMap<String, String> mapps = new HashMap<String, String>();
				Vector<String> vps = new Vector<String>();
				for (int j = 0; j < ps.length; j++)
				{
					if (upperCase)
					{
						ps[j] = ps[j].toUpperCase();
					}

					if (!fullpy)
					{
						ps[j] = ps[j].charAt(0) + "";
					}

					if (!mapps.containsKey(ps[j]))
					{
						vps.add(ps[j]);
					}
					mapps.put(ps[j], ps[j]);
				}
				String[] aps = new String[vps.size()];
				rets.add(vps.toArray(aps));
			}
		}

		Vector<String> result = new Vector<String>();
		combination(rets, 0, "", result);
		StringBuffer buffer = new StringBuffer(32);
		if (justOne)
		{
			for (String spy : result)
			{
				buffer.append(",");
				buffer.append(spy);
			}
		}
		else
		{
			if (result.size() > 0)
				buffer.append(result.get(0));
		}
		return buffer.toString().replaceFirst(",", "");
	}

	private static void combination(Vector<String[]> rets, int index, String str, Vector<String> result)
	{
		if (index < rets.size())
		{
			String[] ret = rets.get(index);
			for (int i = 0; i < ret.length; i++)
			{
				combination(rets, index + 1, str + ret[i], result);
			}
		}
		else
		{
			result.add(str);
		}
	}

	public static void main(String args[])
	{
		// System.out.println(toPinyin("行大", false));
		// System.out.println(toPinyin("行大", true, false));
		// System.out.println(toPinyin("行大", true, false, true));
		System.out.println(cutting("沙发上大的阿三地上大的阿上大的阿上大的阿上大的阿沙发上大的阿三地上大的阿上大的阿上大的阿上大的阿沙发上大的阿三地上大的阿上大的阿上大的阿上大的阿沙发上大的阿三地上大的阿上大的阿上大的阿上大的阿沙发上大的阿三地上大的阿上大的阿上大的阿上大的阿沙发上大的阿三地上大的阿上大的阿上大的阿上大的阿上大的阿上大的阿上大的阿上大的阿上大的阿方阿斯顿", new Dimension(50, 16), new Font("Arial", Font.PLAIN, 12), 0, 1));
	}
}

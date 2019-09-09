package com.entlogic.h5.data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import net.sf.json.JSONObject;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;


public class DataRecord
{
	/**
	 * 列容器
	 */
	private HashMap<String, String> hashCols = new HashMap<String, String>();

	/**
	 * 列名数组
	 */
	private ArrayList<String> listColKeys = new ArrayList<String>();

	/**
	 * 列数据数组
	 */
	private ArrayList<String> listColValues = new ArrayList<String>();

	/**
	 * 清空
	 * 
	 * @throws Exception
	 */
	public void clear() throws Exception
	{
		hashCols.clear();
		listColKeys.clear();
		listColValues.clear();
	}

	/**
	 * 获取列数
	 * 
	 * @return
	 * @throws Exception
	 */
	public int getSize() throws Exception
	{
		return listColKeys.size();
	}

	/**
	 * 获取列名
	 * 
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public String getKey(String key) throws Exception
	{
		if (hashCols.containsKey(key))
		{
			return key;
		}
		return null;
	}

	/**
	 * 获取列名
	 * 
	 * @param indecx
	 * @return
	 * @throws Exception
	 */
	public String getKey(int index) throws Exception
	{
		return listColKeys.get(index);
	}

	/**
	 * 获取列值
	 * 
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public String getValue(String key) throws Exception
	{
		return  (hashCols.get(key) == null) ? "" : hashCols.get(key).toString();
	}

	/**
	 * 获取列值
	 * 
	 * @param indecx
	 * @return
	 * @throws Exception
	 */
	public String getValue(int index) throws Exception
	{
		return listColValues.get(index);
	}
	
	/**
	 * 更新列
	 * 
	 * @param key
	 * @param value
	 * @throws Exception
	 */
	public void setData(String key, String value) throws Exception
	{
		hashCols.put(key, value);
		
		int n = -1;
		for(int i = 0; i < listColKeys.size(); i++)
		{
			if (key.equals(listColKeys.get(i)))
			{
				n = i;
				break;
			}
		}
		if (n == -1) return;
		
		setData(n, value);
	}
	
	/**
	 * 更新列
	 * @param index
	 * @param value
	 * @throws Exception
	 */
	public void setData(int index, String value) throws Exception
	{
		String key = listColKeys.get(index);
		if (key == null) return;
		
		hashCols.put(key, value);
		listColValues.set(index, value);
	}

	/**
	 * 添加列数据
	 * 
	 * @param key
	 * @param value
	 * @throws Exception
	 */
	public void addData(String key, String value) throws Exception
	{
		hashCols.put(key, value);
		listColKeys.add(key);
		listColValues.add(value);
	}

	/**
	 * 移除列数据
	 * 
	 * @param key
	 * @throws Exception
	 */
	public void removeData(String key) throws Exception
	{
		// 移除hash列项
		hashCols.remove(key);

		// 移除key列表项
		int index = -1;
		for (int i = 0; i < listColKeys.size(); i++)
		{
			if (listColKeys.get(i).equals(key))
			{
				index = i;
			}
		}
		listColKeys.remove(index);
		listColValues.remove(index);
	}

	/**
	 * 移除列数据
	 * 
	 * @param index
	 * @throws Exception
	 */
	public void removeData(int index) throws Exception
	{
		String key = listColKeys.get(index);
		removeData(key);
	}

	/**
	 * 装换成JSON
	 * 
	 * @return
	 * @throws Exception
	 */
	public String toJSON() throws Exception
	{
		JSONObject jsonObj = new JSONObject();
		
		String key, value;
		for (int i = 0; i < listColKeys.size(); i++)
		{
			key = listColKeys.get(i);
			value = listColValues.get(i);
			jsonObj.put(key, value);
		}
		return jsonObj.toString();
	}

	/**
	 * 装换成XML
	 * 
	 * @return
	 * @throws Exception
	 */
	public String toXML() throws Exception
	{
		String xml = "";
		xml += "<record>\n";
		String key, value;
		for (int i = 0; i < listColKeys.size(); i++)
		{
			key = listColKeys.get(i);
			value = listColValues.get(i);
			xml += "	<item>\n";
			xml += "		<key>" + key + "</key>\n";
			xml += "		<value>" + value + "</value>\n";
			xml += "	</item>\n";
		}
		xml += "</record>\n";
		return xml;
	}

	/**
	 * 加载XML数据
	 * 
	 * @return
	 * @throws Exception
	 */
	public void loadXML(String xml) throws Exception
	{
		// 将字符串转为XML
		Document doc = DocumentHelper.parseText(xml);
		// 获取根节点
		Element rootElt = doc.getRootElement();
		// 获取根节点下的子节点col
		Iterator<?> iter = rootElt.elementIterator("item");
		// 遍历所有col节点
		Element recordEle;
		String key, value;
		while (iter.hasNext())
		{
			recordEle = (Element) iter.next();
			key = recordEle.element("key").asXML();
			if (key.length() < 11)
			{
				key = "";
			}
			else
			{
				key = key.substring(5, key.length() - 6);
			}
			value =  recordEle.element("value").asXML();
			if (value.length() < 15)
			{
				value = "";
			}
			else
			{
				value = value.substring(7, value.length() - 8);
			
			}
			addData(key, value);
		}
	}

	/**
	 * 加载Json数据
	 * 
	 * @return
	 * @throws Exception
	 */
	public void loadJson(JSONObject jsonObject)
	{
		try
		{
			// 获取根节点下的子节点col
			@SuppressWarnings("unchecked")
			Iterator<Map.Entry<String, Object>> iter = jsonObject.entrySet().iterator();
			while (iter.hasNext())
			{
				Map.Entry<String, Object> entry = iter.next();
				addData(entry.getKey(), entry.getValue().toString());
			}
		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * 加载Json数据
	 * 
	 * @return
	 * @throws Exception
	 */
	public void loadParam(String data) throws Exception
	{
		String[] fSplit = data.split("&");
		for (int i = 0; i < fSplit.length; i++)
		{
			if (fSplit[i] == null || fSplit[i].length() == 0)
			{
				continue;
			}
			String[] sSplit = fSplit[i].split("=");
			String value = fSplit[i].substring(fSplit[i].indexOf('=') + 1, fSplit[i].length());
			addData(sSplit[0], value);
		}
	}

	/**
	 * 测试程序
	 * 
	 * @param args
	 */
	public static void main(String args[])
	{
		try
		{
			// DataRow 测试数据
			String xml = "";
			xml += "<record>\n";
			xml += "	<item>\n";
			xml += "		<key>id</key>\n";
			xml += "		<value>00</value>\n";
			xml += "	</item>\n";
			xml += "	<item>\n";
			xml += "		<key>level</key>\n";
			xml += "		<value>0</value>\n";
			xml += "	</item>\n";
			xml += "</record>\n";

			System.out.println(xml);

			System.out.println("================================================================");

			DataRecord dr = new DataRecord();

			dr.loadXML(xml);
			System.out.println("    id:        " + dr.getValue(0));
			System.out.println("level:       " + dr.getValue("level"));

			System.out.println("================================================================");

			xml = dr.toXML();
			System.out.println(xml);

			System.out.println("================================================================");

			dr.loadXML(xml);
			System.out.println("    id:        " + dr.getValue(0));
			System.out.println("level:       " + dr.getValue("level"));

		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}

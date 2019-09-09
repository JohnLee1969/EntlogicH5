package com.entlogic.h5.data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import net.sf.json.JSONObject;

/**
 * 业务处理方法输入数据
 * 
 * @author John
 * 
 */
public class DataPackage
{
	/**
	 * 数据表容器
	 */
	private HashMap<String, DataTable> dataTables = new HashMap<String, DataTable>();	
	private ArrayList<DataTable> tables = new ArrayList<DataTable>();

	
	/**
	 * 返回参数表
	 */
	private DataTable dtReturn = new DataTable();
	
	/**
	 * 返回参数记录
	 */
	private DataRecord rcReturn = new DataRecord();
	
	/**
	 * 构造函数
	 */
	public DataPackage()
	{
		try
		{
			dtReturn.addRecord(rcReturn);
			dtReturn.id = "dtReturn";
			dataTables.put("dtReturn", dtReturn);
			tables.add(dtReturn);
		}
		catch(Exception e)
		{
			
		}
	}
	
	/**
	 * 清空
	 * 
	 * @throws Exception
	 */
	public void clear() throws Exception
	{
		dataTables.clear();
	}
	
	/**
	 * 添加返回参数
	 * 
	 * @param key
	 * @param value
	 * @throws Exception
	 */
	public void addReturn(String key, String value) throws Exception
	{
		rcReturn.addData(key, value);
	}

	/**
	 * 获取数据行
	 * 
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public DataTable getDataTable(String key) throws Exception
	{
		return dataTables.get(key);
	}
	
	/**
	 * 添加数据行
	 * 
	 * @param key
	 * @param value
	 * @throws Exption
	 */
	public void addDataTable(DataTable value) throws Exception
	{
		if (dataTables.containsKey(value.id))
		{
			throw new  Exception("com.entlogic.h5.data.DataTable addDataTable(): 重复Key错误！！！");
		}
		dataTables.put(value.id, value);
		tables.add(value);
	}
	
	/**
	 * 移除数据行
	 * @param key
	 * @param value
	 * @throws Exception
	 */
	public void removeDataTable(String key) throws Exception
	{
		for (DataTable dt : tables)
		{
			if (dt.id.equals(key))
			{
				tables.remove(dt);
			}
		}
		dataTables.remove(key);
	}
	
	/**
	 * 转换成JSON
	 * 
	 * @return
	 * @throws Exception
	 */
	public String toJSON() throws Exception
	{		
		JSONObject jsonObj = new JSONObject();
		for(DataTable table : tables)
		{
			jsonObj.put(table.id, table.toJSON());
		}
		
		return jsonObj.toString();
	}

	/**
	 * 转换成XML
	 * 
	 * @return
	 * @throws Exception
	 */
	public String toXML() throws Exception
	{		
		String xml = "";
		xml += "<data_package>\n";
		
		for(DataTable table : tables)
		{
			xml += table.toXML();
		}
		
		xml += "</data_package>\n";
		
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
		// 清空
		clear();
		
		// 判断输入为空
		if (xml == null || xml.equals("")) return;
		
		// 将字符串转为XML
		Document doc = DocumentHelper.parseText(xml);  
		
		// 获取根节点
		Element rootElt = doc.getRootElement(); 
				
		// 转载表数据
		Iterator iterTable = rootElt.elementIterator("data_table"); 
		Element tableEle;	
		String tableXml;
		DataTable table;
		while (iterTable.hasNext())
		{
			tableEle = (Element) iterTable.next();
			tableXml = tableEle.asXML();
			table = new DataTable();
            table.loadXML(tableXml);
            addDataTable(table);
        }
	}
	
	
	/**
	 * 测试程序
	 * @param args
	 */
	public static void main(String args[])
	{
		try
		{
			String packageXML = "";
			packageXML += "<data_package>";
			
			packageXML += "<data_table>";
			
			packageXML += "<id>table01</id>";	
			
			packageXML += "<records>";
			
			packageXML += "<record>";
			packageXML += "<item>";
			packageXML += "<key>k01</key>";
			packageXML += "<value>v01</value>";
			packageXML += "</item>";
			packageXML += "<item>";
			packageXML += "<key>k02</key>";
			packageXML += "<value>v02</value>";
			packageXML += "</item>";
			packageXML += "</record>";
			
			packageXML += "<record>";
			packageXML += "<item>";
			packageXML += "<key>k01</key>";
			packageXML += "<value>v11</value>";
			packageXML += "</item>";
			packageXML += "<item>";
			packageXML += "<key>k02</key>";
			packageXML += "<value>v12</value>";
			packageXML += "</item>";
			packageXML += "</record>";
			
			packageXML += "</records>";
			packageXML += "</data_table>";
				
			packageXML += "</data_package>";

			// InputData 测试数据
			DataPackage  pacData = new DataPackage();
			pacData.loadXML(packageXML);			
			DataTable t = pacData.getDataTable("table01");		
			System.out.println("第一行第一列: " + t.getRecord(0).getValue("k01"));
			System.out.println("第二行第一列 " + t.getRecord(1).getValue("k01"));
			
			System.out.println("===============================================================");
			
			packageXML = pacData.toXML();
			System.out.println(packageXML);
		}
		catch( Exception e)
		{
			e.printStackTrace();
		}
	}

}

package com.entlogic.h5.data;

import java.util.ArrayList;
import java.util.Iterator;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import net.sf.json.JSONArray;

public class DataTable
{
	/**
	 * 数据列表Id
	 */
	public String id = null;
	
	/**
	 * 数据行列表
	 */
	private ArrayList<DataRecord> records = new ArrayList<DataRecord>();
	
	/**
	 * 清空数据表
	 * 
	 * @throws Exception
	 */
	public void clear() throws Exception
	{
		id = null;
		records.clear();
	}
	
	/**
	 * 获取行数
	 * 
	 * @return
	 * @throws Exception
	 */
	public int getSize() throws Exception
	{
		return records.size();
	}

	/**
	 * 获取数据行
	 * 
	 * @param index
	 * @return
	 * @throws Exception
	 */
	public DataRecord getRecord(int index) throws Exception
	{
		return records.get(index);
	}
	
	/**
	 * 添加数据行
	 * 
	 * @param record
	 * @throws Exception
	 */
	public void addRecord(DataRecord record) throws Exception
	{
		records.add(record);
	}
	
	/**
	 * 移除数据行
	 * 
	 * @param record
	 * @throws Exception
	 */
	public void removeRecord(int index) throws Exception
	{
		records.remove(index);
	}

	/**
	 * 移除数据行
	 * 
	 * @param record
	 * @throws Exception
	 */
	public void removeRecord(DataRecord record) throws Exception
	{
		records.remove(record);
	}

	/**
	 * 更新数据行
	 * 
	 * @param index
	 * @param record
	 * @throws Exception
	 */
	public void setRecord(int index, DataRecord record) throws Exception
	{
		records.set(index, record);
	}

	
	/**
	 * 转换成JSON
	 * 
	 * @return
	 * @throws Exception
	 */
	public String toJSON() throws Exception
	{
		JSONArray jsonArray = new JSONArray();
		for (int i = 0; i < records.size(); i++)
		{
			jsonArray.add(records.get(i).toJSON());
		}
		
		return jsonArray.toString();
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
		xml += "<data_table>\n";
		xml += "	<id>" + id + "</id>\n";
		xml += "	<records>\n";
		
		for (int i = 0; i < records.size(); i++)
		{
			xml += records.get(i).toXML();
		}
		xml += "	</records>\n";
		xml += "</data_table>\n";
		
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
		
		// 将字符串转为XML
		Document doc = DocumentHelper.parseText(xml);  
		// 获取根节点
		Element rootElt = doc.getRootElement(); 
		// 获取列表Id
		id = rootElt.elementTextTrim("id");
		if (id == null)
		{
			throw new Exception("com.entlogic.h5.data.DataTable loadXML(): XML中没有id列！！！");
		}		
		// 获取根节点下的子节点records
		Element recordsElt = rootElt.element("records");
		// 获取根节点下的子节点record
		Iterator iter = recordsElt.elementIterator("record"); 
		// 遍历所有record节点
		Element recordEle;	
		String recordXml;
		DataRecord dr;
		while (iter.hasNext())
		{
            recordEle = (Element) iter.next();
            recordXml = recordEle.asXML();
            dr = new DataRecord();
            dr.loadXML(recordXml);
            addRecord(dr);
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
			// DataTable 测试数据
			String 	tableXML = "";
			tableXML += "<data_table>";
			
			tableXML += "<id>table01</id>";	
			
			tableXML += "<records>";
			
			tableXML += "<record>";
			tableXML += "<item>";
			tableXML += "<key>k01</key>";
			tableXML += "<value>v01</value>";
			tableXML += "</item>";
			tableXML += "<item>";
			tableXML += "<key>k02</key>";
			tableXML += "<value>v02</value>";
			tableXML += "</item>";
			tableXML += "</record>";
			
			tableXML += "<record>";
			tableXML += "<item>";
			tableXML += "<key>k01</key>";
			tableXML += "<value>v11</value>";
			tableXML += "</item>";
			tableXML += "<item>";
			tableXML += "<key>k02</key>";
			tableXML += "<value>v12</value>";
			tableXML += "</item>";
			tableXML += "</record>";
			
			tableXML += "</records>";
			tableXML += "</data_table>";
		
			System.out.println(tableXML);
			
			System.out.println("================================================================");
			
			DataTable t = new DataTable();
			t.loadXML(tableXML);
			System.out.println("   tableid:        " + t.id);
			
			DataRecord dr1 = t.getRecord(0);
			System.out.println("record   k01:        " + dr1.getValue("k01"));
			System.out.println("record   k02:       " + dr1.getValue("k02"));
			
			DataRecord dr2 = t.getRecord(1);
			System.out.println("record   k01:        " + dr1.getValue("k01"));
			System.out.println("record   k02:       " + dr1.getValue("k02"));
			
			System.out.println("================================================================");
						
			tableXML = t.toXML();
			System.out.println(tableXML);
			
			System.out.println("================================================================");
			
			t.loadXML(tableXML);
			
			dr1 = t.getRecord(0);
			System.out.println("record   k01:        " + dr1.getValue("k01"));
			System.out.println("record   k02:       " +dr1.getValue("k02"));
			
			dr2 = t.getRecord(1);
			System.out.println("record   k01:        " + dr1.getValue("k01"));
			System.out.println("record   k02:       " +dr1.getValue("k02"));
			
		}
		catch( Exception e)
		{
			e.printStackTrace();
		}
	}
}

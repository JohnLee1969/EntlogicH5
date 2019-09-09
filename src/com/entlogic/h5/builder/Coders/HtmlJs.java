package com.entlogic.h5.builder.Coders;

import java.util.ArrayList;

import org.dom4j.Element;

import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;

/**
 * 
 * @author John
 * 
 */
public class HtmlJs
{
	public String formName = "";
	public String id = "";
	
	public HtmlJs parent = null;
	public ArrayList<HtmlJs> children = new ArrayList<HtmlJs>();
	
	/**
	 * 构造函数
	 */
	public HtmlJs(String an)
	{
		formName = an;
	}
	
	/**
	 * 加载
	 * 
	 * @param rootElement
	 * @throws Exception
	 */
	public void load(Element rootElement) throws Exception
	{
		rootElement =  rootElement.element("head");
		this.id = "脚本引用";
		
		Element element = null;
		for (Object eO : rootElement.elements())
		{
			element = (Element) eO;
			if (element.getName().equals("script"))
			{
				loadNode(element, this);
			}
		}
	}
	
	private HtmlJs loadNode(Element childElement, HtmlJs parentNode)
	{
		HtmlJs childNode = new HtmlJs(formName );
		childNode.id = childElement.attributeValue("src");
		
		if (childNode.id.equals(formName + ".js")) return null;		
		if (childNode.id.equals("../../entlogic/js/entlogic_builder.js")) return null;
		
		childNode.parent = parentNode;
		if (parentNode != null)
		{
			parentNode.children.add(childNode);
		}
		
		Element element = null;
		for (Object eO : childElement.elements())
		{
			element = (Element) eO;
			if (element.getName().equals("script"))
			{
				loadNode(element, childNode);
			}
		}
		
		return childNode;
	}
	
	/**
	 * 加载
	 * 
	 * @param rootElement
	 * @throws Exception
	 */
	public void load(DataTable dt) throws Exception
	{
		this.id = "脚本引用";
		
		DataRecord dr = null;
		HtmlJs jsNode = null;
		for (int i = 1; i < dt.getSize(); i++)
		{
			dr = dt.getRecord(i);
			jsNode = new HtmlJs(formName);
			jsNode.id = dr.getValue("id");
			jsNode.parent = this;
			this.children.add(jsNode );
		}
	}
	
	public String exportHtml()
	{
		String htmlText = "";
		for(HtmlJs childNode : this.children)
		{
			htmlText += "	<script src='" + childNode.id + "'></script>\n";
		}
		
		return htmlText;
	}
	
	public DataTable exportToDataTable(DataTable dt, HtmlJs node, int level) throws Exception
	{
		DataRecord dr = new DataRecord();
		dr.addData("id", node.id != null ? node.id : "空");
		dr.addData("lv", level + "");
		dr.addData("text", node.id);
		dt.addRecord(dr);
		
		level++;
		for (HtmlJs childNode : node.children)
		{
			exportToDataTable(dt, childNode, level);
		}
		
		return dt;
	}
}

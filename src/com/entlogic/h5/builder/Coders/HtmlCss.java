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
public class HtmlCss
{
	public String formName = "";
	public String id = "";
	
	public HtmlCss parent = null;
	public ArrayList<HtmlCss> children = new ArrayList<HtmlCss>();
	
	/**
	 * 构造函数
	 */
	public HtmlCss(String an)
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
		this.id = "样式引用";
		
		Element element = null;
		for (Object eO : rootElement.elements())
		{
			element = (Element) eO;
			if (element.getName().equals("link"))
			{
				loadNode(element, this);
			}
		}
	}
	
	private HtmlCss loadNode(Element childElement, HtmlCss parentNode)
	{
		HtmlCss childNode = new HtmlCss(formName);
		childNode.id = childElement.attributeValue("href");
		if (childNode.id.indexOf(formName + ".css") >= 0) return null;
		
		childNode.parent = parentNode;
		if (parentNode != null)
		{
			parentNode.children.add(childNode);
		}
		
		Element element = null;
		for (Object eO : childElement.elements())
		{
			element = (Element) eO;
			if (element.getName().equals("link"))
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
		this.id = "样式引用";
		
		DataRecord dr = null;
		HtmlCss cssNode = null;
		for (int i = 1; i < dt.getSize(); i++)
		{
			dr = dt.getRecord(i);
			cssNode = new HtmlCss(formName);
			cssNode.id = dr.getValue("id");
			cssNode.parent = this;
			this.children.add(cssNode);
		}
	}
	
	/**
	 * 
	 * @return
	 */
	public String exportHtml()
	{
		String htmlText = "";
		for(HtmlCss childNode : this.children)
		{
			htmlText += "	<link href='" + childNode.id + "' rel='stylesheet' type='text/css'></link>\n";
		}
		
		return htmlText;
	}
	
	/**
	 * 
	 * @param dt
	 * @param node
	 * @param level
	 * @return
	 * @throws Exception
	 */
	public DataTable exportToDataTable(DataTable dt, HtmlCss node, int level) throws Exception
	{
		DataRecord dr = new DataRecord();
		dr.addData("id", node.id != null ? node.id : "空");
		dr.addData("lv", level + "");
		dr.addData("text", node.id);
		dt.addRecord(dr);
		
		level++;
		for (HtmlCss childNode : node.children)
		{
			exportToDataTable(dt, childNode, level);
		}
		
		return dt;
	}
}

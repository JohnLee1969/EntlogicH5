package com.entlogic.h5.builder.Coders;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.dom4j.Element;

import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;

/**
 * 
 * @author John
 * 
 */
public class HtmlBody
{
	public String tagName = "";
	public String id = "";
	public String lv = "";
	public String attrType = "";
	public String attrClass = "";
	public String attrStyle = "";
	public String attrSrc = "";
	public String attrValue = "";
	public String attrPattem = "";
	public String attrPlaceholder = "";
	public String attrTitle = "";
	public String content = "";
	
	public HtmlBody parent = null;
	public ArrayList<HtmlBody> children = new ArrayList<HtmlBody>();

	private Element rootElement = null;
	private HashMap<String, String> tagIdMap = new HashMap<String, String>();
	private ArrayList<HtmlBody> nullIdNode = new ArrayList<HtmlBody>();
	private int tagSn = 0;
	
	/**
	 * 构造函数
	 */
	public HtmlBody()
	{
		
	}
	
	/**
	 * 加载
	 * 
	 * @param rootElement
	 * @throws Exception
	 */
	public void load(Element re) throws Exception
	{
		rootElement =  re.element("body");
		this.tagName =rootElement.getName();
		this.id = "body";
		this.lv = "0";
		this.attrType = "";
		this.attrClass = "";
		this.attrStyle = "";
		this.attrSrc =  "";
		this.attrValue =  "";
		this.attrPattem =  "";
		this.attrPlaceholder =  "";
		this.attrTitle =  "";
		this.content = "";
		
		Element element = null;
		List elements = rootElement.elements();
		for (Object eO : rootElement.elements())
		{
			element = (Element) eO;
			loadNode(element, this, 1);
		}
		
		if (elements.size() == 0)
		{
			this.content = rootElement.getText();
		}
		
		HtmlBody node;
		for(int i = 0; i < nullIdNode.size(); i ++)
		{
			node = nullIdNode.get(i);
			node.id = getTagId();
		}
	}
	
	private HtmlBody loadNode(Element childElement, HtmlBody parentNode, int level) throws Exception
	{
		HtmlBody childNode = new HtmlBody();
		childNode.tagName = childElement.getName();
		childNode.id = childElement.attributeValue("id");
		
		tagIdMap.put(childNode.id, childNode.id);
		if (childNode.id == null)
		{
			nullIdNode.add(childNode);
		}
		
		childNode.lv = level + "";
		childNode.attrType = childElement.attributeValue("type") == null ? "" : childElement.attributeValue("type");
		childNode.attrClass = childElement.attributeValue("class") == null ? "" : childElement.attributeValue("class");
		childNode.attrStyle = childElement.attributeValue("style") == null ? "" : childElement.attributeValue("style");
		childNode.attrSrc = childElement.attributeValue("src") == null ? "" : childElement.attributeValue("src");
		childNode.attrValue = childElement.attributeValue("value") == null ? "" : childElement.attributeValue("value");
		childNode.attrPattem = childElement.attributeValue("pattem") == null ? "" : childElement.attributeValue("pattem");
		childNode.attrPlaceholder = childElement.attributeValue("placeholder") == null ? "" : childElement.attributeValue("placeholder");
		childNode.attrTitle = childElement.attributeValue("title") == null ? "" : childElement.attributeValue("title");
		
		childNode.parent = parentNode;
		if (parentNode != null)
		{
			parentNode.children.add(childNode);
		}
		
		level ++;
		Element element = null;
		List elements =  childElement.elements();
		for (Object eO : elements)
		{
			element = (Element) eO;
			loadNode(element, childNode, level);
		}
		
		if (elements.size() == 0)
		{
			childNode.content = childElement.getText().trim();
		}
		
		return childNode;
	}
	
	private String getTagId() throws Exception
	{
		String tagId = null;
		int i;
		for(i = tagSn; i < 1000; i++)
		{
			tagId = "tag_" + i;
			if (!tagIdMap.containsKey(tagId)) break;
		}
		tagSn = i + 1;
		return tagId;
	}
	
	/**
	 * 加载
	 * 
	 * @param rootElement
	 * @throws Exception
	 */
	public void load(DataTable dt) throws Exception
	{
		DataRecord  dr = dt.getRecord(0);
		this.tagName =dr.getValue("tagName");
		this.id = dr.getValue("id");
		this.lv = dr.getValue("lv");
		this.attrType = dr.getValue("type");
		this.attrClass = dr.getValue("class");
		this.attrStyle = dr.getValue("style");
		this.attrSrc =  dr.getValue("src");
		this.content = dr.getValue("content");
		this.attrValue =  dr.getValue("value");
		this.attrPattem =  dr.getValue("pattem");
		this.attrPlaceholder =  dr.getValue("placeholder");
		this.attrTitle =  dr.getValue("title");
		
		int size = dt.getSize();
		int index = 1;
		HtmlBody parentNode = this;
		HtmlBody node;
		int lvLast, lv;
		while (index < size)
		{
			dr = dt.getRecord(index);
			lvLast = Integer.parseInt(parentNode.lv);
			lv = Integer.parseInt(dr.getValue("lv"));
			if (lvLast > lv)
			{
				parentNode = parentNode.parent;
				continue;
			}

			node = new HtmlBody();
			node.tagName =dr.getValue("tagName");
			node.id = dr.getValue("id");
			node.lv = dr.getValue("lv");
			node.attrType = dr.getValue("type");
			node.attrClass = dr.getValue("class");
			node.attrStyle = dr.getValue("style");
			node.attrSrc =  dr.getValue("src");
			node.attrPattem =  dr.getValue("pattem");
			node.attrPlaceholder =  dr.getValue("placeholder");
			node.attrTitle =  dr.getValue("title");
			node.attrValue =  dr.getValue("value");
			node.content = dr.getValue("content");
			
			if (lvLast == lv)
			{
				node.parent = parentNode.parent;
				parentNode.parent.children.add(node);
			}
			else
			{
				node.parent = parentNode;
				parentNode.children.add(node);
			}
			parentNode = node;
			index ++;
		}
	}
	
	/**
	 * 
	 * @param node
	 * @return
	 */
	public String exportHtml(HtmlBody node)
	{
		int level = Integer.parseInt(node.lv);
		String htmlText = "";
		String tabSpace = "";
		for (int i = 0; i < level; i++)
		{
			tabSpace += "	";
		}
		
		htmlText += tabSpace + "<" + node.tagName;
		if (node.id != null && !node.id.equals(""))
		{
			htmlText +=" id='" + node.id + "'";
		}
		if (node.attrType != null && !node.attrType.equals(""))
		{
			htmlText +=" type='" + node.attrType + "'";
		}
		if (node.attrClass != null && !node.attrClass.equals(""))
		{
			htmlText +=" class='" + node.attrClass + "'";
		}
		if (node.attrStyle != null && !node.attrStyle.equals(""))
		{
			htmlText +=" style='" + node.attrStyle + "'";
		}
		if (node.attrValue != null && !node.attrValue.equals(""))
		{
			htmlText +=" value='" + node.attrValue + "'";
		}
		if (node.attrPattem != null && !node.attrPattem.equals(""))
		{
			htmlText +=" pattem='" + node.attrPattem + "'";
		}
		if (node.attrTitle != null && !node.attrTitle.equals(""))
		{
			htmlText +=" title='" + node.attrTitle + "'";
		}
		if (node.attrPlaceholder != null && !node.attrPlaceholder.equals(""))
		{
			htmlText +=" placeholder='" + node.attrPlaceholder + "'";
		}
		if (node.attrSrc != null && !node.attrSrc.equals(""))
		{
			htmlText +=" src='" + node.attrSrc + "'";
		}
		htmlText += ">\n";
		
		for(HtmlBody childNode : node.children)
		{
			htmlText += exportHtml(childNode);
		}
		
		node.content = node.content.trim();
		if (!node.content.equals(""))
		{
			htmlText += tabSpace + "	" + node.content + "\n";
		}

		htmlText += tabSpace + "</" + node.tagName + ">\n";
		
		return htmlText;
	}
	
	public DataTable exportToDataTable(DataTable dt, HtmlBody node, int level) throws Exception
	{
		String text =  "[" +  node.tagName;
		if (node.id != null && !node.id.equals(""))
		{
			text += " id='" + node.id + "'";
		}
		if (node.attrClass != null && !node.attrClass.equals(""))
		{
			text += " class='" +  node.attrClass + "'";
		}
		text += "]";
		DataRecord dr = new DataRecord();
		dr.addData("id", node.id != null ? node.id : "");
		dr.addData("lv", level + "");
		dr.addData("text", text);
		dr.addData("tagName", node.tagName);
		dr.addData("type", node.attrType);
		dr.addData("class", node.attrClass);
		dr.addData("style", node.attrStyle);
		dr.addData("src", node.attrSrc);
		dr.addData("value", node.attrValue);
		dr.addData("pattem", node.attrPattem);
		dr.addData("placeholder", node.attrPlaceholder);
		dr.addData("title", node.attrTitle);
		dr.addData("content", node.content);
		dt.addRecord(dr);
		
		level++;
		for (HtmlBody childNode : node.children)
		{
			exportToDataTable(dt, childNode, level);
		}
		
		return dt;
	}
}

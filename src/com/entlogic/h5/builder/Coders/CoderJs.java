package com.entlogic.h5.builder.Coders;

import java.util.ArrayList;

import com.entlogic.h5.data.DataTable;

/**
 * 
 * @author John
 *
 */
public class CoderJs
{
	public String appName;
	public String formName;
	public ArrayList<DataTable> dataTables = new  ArrayList<DataTable>();
	public ArrayList<JsControl> controls = new  ArrayList<JsControl>();
	public ArrayList<JsVariable> variables = new  ArrayList<JsVariable>();
	public ArrayList<JsFuction> fuctions = new  ArrayList<JsFuction>();
	public ArrayList<JsFuction> handlers = new  ArrayList<JsFuction>();	
	
	public CoderJs(String aN, String fN)
	{
		appName = aN;
		formName = fN;
	}
	
	public void createNew() throws Exception
	{
		
	}
	
	public void load() throws Exception
	{
		
	}
	
	public void export() throws Exception
	{
		
	}
}

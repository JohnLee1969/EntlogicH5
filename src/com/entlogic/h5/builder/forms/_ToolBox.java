package com.entlogic.h5.builder.forms;

import com.entlogic.h5.Application;
import com.entlogic.h5.annotations.BpCommand;
import com.entlogic.h5.builder.controls.button;
import com.entlogic.h5.builder.controls.datagrid;
import com.entlogic.h5.builder.controls.datetime;
import com.entlogic.h5.builder.controls.file;
import com.entlogic.h5.builder.controls.group;
import com.entlogic.h5.builder.controls.group_h;
import com.entlogic.h5.builder.controls.group_t;
import com.entlogic.h5.builder.controls.group_v;
import com.entlogic.h5.builder.controls.iframe;
import com.entlogic.h5.builder.controls.image;
import com.entlogic.h5.builder.controls.lable;
import com.entlogic.h5.builder.controls.list;
import com.entlogic.h5.builder.controls.lookup;
import com.entlogic.h5.builder.controls.number;
import com.entlogic.h5.builder.controls.select;
import com.entlogic.h5.builder.controls.space;
import com.entlogic.h5.builder.controls.text;
import com.entlogic.h5.builder.controls.textarea;
import com.entlogic.h5.builder.controls.treeview;
import com.entlogic.h5.data.DataPackage;
import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;
import com.entlogic.h5.logs.Log;
import com.entlogic.h5.securitys.UserSession;

/**
 * 
 * @author John
 *
 */
public class _ToolBox
{
	/**
	 * 加载应用
	 * 
	 * @return
	 */
	@BpCommand(registedName = "加载工具箱项目", logged = false, transaction = false)
	public static DataPackage loadControls(DataRecord parameters, UserSession session)
	{
		DataPackage dpOut = new DataPackage();			

		try
		{
			DataTable dtControl = new DataTable();
			dtControl.id = "dtControl";
			
			DataRecord dr;
			
			dr = new DataRecord();
			dr.addData("id", "_containers");
			dr.addData("lv", "0");
			dr.addData("name", "布局");
			dr.addData("icon",  "&#xe64b;");
			dr.addData("tagName", "");
			dr.addData("type", "");
			dr.addData("style", "");
			dr.addData("template", "");
			dtControl.addRecord(dr);
			
			group ctlGroup = new group();
			dr = new DataRecord();
			dr.addData("id", ctlGroup.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlGroup.name);
			dr.addData("icon", ctlGroup.icon);
			dr.addData("tagName", ctlGroup.tagName);
			dr.addData("type", ctlGroup.type);
			dr.addData("style", ctlGroup.style);
			dr.addData("template", ctlGroup.template);
			dtControl.addRecord(dr);
			
			group_h ctlGroupH = new group_h();
			dr = new DataRecord();
			dr.addData("id", ctlGroupH.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlGroupH.name);
			dr.addData("icon", ctlGroupH.icon);
			dr.addData("tagName", ctlGroupH.tagName);
			dr.addData("type", ctlGroupH.type);
			dr.addData("style", ctlGroupH.style);
			dr.addData("template", ctlGroupH.template);
			dtControl.addRecord(dr);
			
			group_v ctlGroupV = new group_v();
			dr = new DataRecord();
			dr.addData("id", ctlGroupV.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlGroupV.name);
			dr.addData("icon", ctlGroupV.icon);
			dr.addData("tagName", ctlGroupV.tagName);
			dr.addData("type", ctlGroupV.type);
			dr.addData("style", ctlGroupV.style);
			dr.addData("template", ctlGroupV.template);
			dtControl.addRecord(dr);
			
			group_t ctlGroupT = new group_t();
			dr = new DataRecord();
			dr.addData("id", ctlGroupT.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlGroupT.name);
			dr.addData("icon", ctlGroupT.icon);
			dr.addData("tagName", ctlGroupT.tagName);
			dr.addData("type", ctlGroupT.type);
			dr.addData("style", ctlGroupT.style);
			dr.addData("template", ctlGroupT.template);
			dtControl.addRecord(dr);
			
			space ctlSpace = new space();
			dr = new DataRecord();
			dr.addData("id", ctlSpace.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlSpace.name);
			dr.addData("icon", ctlSpace.icon);
			dr.addData("tagName", ctlSpace.tagName);
			dr.addData("type", ctlSpace.type);
			dr.addData("style", ctlSpace.style);
			dr.addData("template", ctlSpace.template);
			dtControl.addRecord(dr);
			
			dr = new DataRecord();
			dr.addData("id", "_output");
			dr.addData("lv", "0");
			dr.addData("name", "输出");
			dr.addData("icon",  "&#xe64b;");
			dr.addData("tagName", "");
			dr.addData("type", "");
			dr.addData("style", "");
			dr.addData("template", "");
			dtControl.addRecord(dr);
			
			lable ctlLabel = new lable();
			dr = new DataRecord();
			dr.addData("id", ctlLabel.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlLabel.name);
			dr.addData("icon", ctlLabel.icon);
			dr.addData("tagName", ctlLabel.tagName);
			dr.addData("type", ctlLabel.type);
			dr.addData("style", ctlLabel.style);
			dr.addData("template", ctlLabel.template);
			dtControl.addRecord(dr);
			
			image ctlImage = new image();
			dr = new DataRecord();
			dr.addData("id", ctlImage.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlImage.name);
			dr.addData("icon", ctlImage.icon);
			dr.addData("tagName", ctlImage.tagName);
			dr.addData("type", ctlImage.type);
			dr.addData("style", ctlImage.style);
			dr.addData("template", ctlImage.template);
			dtControl.addRecord(dr);
			
			iframe ctlIFrame = new iframe();
			dr = new DataRecord();
			dr.addData("id", ctlIFrame.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlIFrame.name);
			dr.addData("icon", ctlIFrame.icon);
			dr.addData("tagName", ctlIFrame.tagName);
			dr.addData("type", ctlIFrame.type);
			dr.addData("style", ctlIFrame.style);
			dr.addData("template", ctlIFrame.template);
			dtControl.addRecord(dr);
			
			dr = new DataRecord();
			dr.addData("id", "_input");
			dr.addData("lv", "0");
			dr.addData("name", "输入");
			dr.addData("icon", "&#xe64b;");
			dr.addData("tagName", "");
			dr.addData("type", "");
			dr.addData("style", "");
			dr.addData("template", "");
			dtControl.addRecord(dr);
			
			file ctlFile = new file();
			dr = new DataRecord();
			dr.addData("id", ctlFile.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlFile.name);
			dr.addData("icon", ctlFile.icon);
			dr.addData("tagName", ctlFile.tagName);
			dr.addData("type", ctlFile.type);
			dr.addData("style", ctlFile.style);
			dr.addData("template", ctlFile.template);
			dtControl.addRecord(dr);
			
			button ctlBotton = new button();
			dr = new DataRecord();
			dr.addData("id", ctlBotton.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlBotton.name);
			dr.addData("icon", ctlBotton.icon);
			dr.addData("tagName", ctlBotton.tagName);
			dr.addData("type", ctlBotton.type);
			dr.addData("style", ctlBotton.style);
			dr.addData("template", ctlBotton.template);
			dtControl.addRecord(dr);
			
			select ctlSelect = new select();
			dr = new DataRecord();
			dr.addData("id", ctlSelect.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlSelect.name);
			dr.addData("icon", ctlSelect.icon);
			dr.addData("tagName", ctlSelect.tagName);
			dr.addData("type", ctlSelect.type);
			dr.addData("style", ctlSelect.style);
			dr.addData("template", ctlSelect.template);
			dtControl.addRecord(dr);
			
			lookup ctlLookup = new lookup();
			dr = new DataRecord();
			dr.addData("id", ctlLookup.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlLookup.name);
			dr.addData("icon", ctlLookup.icon);
			dr.addData("tagName", ctlLookup.tagName);
			dr.addData("type", ctlLookup.type);
			dr.addData("style", ctlLookup.style);
			dr.addData("template", ctlLookup.template);
			dtControl.addRecord(dr);
			
			text ctlText = new text();
			dr = new DataRecord();
			dr.addData("id", ctlText.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlText.name);
			dr.addData("icon", ctlText.icon);
			dr.addData("tagName", ctlText.tagName);
			dr.addData("type", ctlText.type);
			dr.addData("style", ctlText.style);
			dr.addData("template", ctlText.template);
			dtControl.addRecord(dr);
			
			textarea ctlTextArea = new textarea();
			dr = new DataRecord();
			dr.addData("id", ctlTextArea.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlTextArea.name);
			dr.addData("icon", ctlTextArea.icon);
			dr.addData("tagName", ctlTextArea.tagName);
			dr.addData("type", ctlTextArea.type);
			dr.addData("style", ctlTextArea.style);
			dr.addData("template", ctlTextArea.template);
			dtControl.addRecord(dr);
			
			number ctlNumber = new number();
			dr = new DataRecord();
			dr.addData("id", ctlNumber.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlNumber.name);
			dr.addData("icon", ctlNumber.icon);
			dr.addData("tagName", ctlNumber.tagName);
			dr.addData("type", ctlNumber.type);
			dr.addData("style", ctlNumber.style);
			dr.addData("template", ctlNumber.template);
			dtControl.addRecord(dr);
			
			datetime ctlDateTime = new datetime();
			dr = new DataRecord();
			dr.addData("id", ctlDateTime.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlDateTime.name);
			dr.addData("icon", ctlDateTime.icon);
			dr.addData("tagName", ctlDateTime.tagName);
			dr.addData("type", ctlDateTime.type);
			dr.addData("style", ctlDateTime.style);
			dr.addData("template", ctlDateTime.template);
			dtControl.addRecord(dr);
			
			dr = new DataRecord();
			dr.addData("id", "_list");
			dr.addData("lv", "0");
			dr.addData("name", "列表");
			dr.addData("icon", "&#xe64b;");
			dr.addData("tagName", "");
			dr.addData("type", "");
			dr.addData("style", "");
			dr.addData("template", "");
			dtControl.addRecord(dr);
			
			list ctlList = new list();
			dr = new DataRecord();
			dr.addData("id", ctlList.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlList.name);
			dr.addData("icon", ctlList.icon);
			dr.addData("tagName", ctlList.tagName);
			dr.addData("type", ctlList.type);
			dr.addData("style", ctlList.style);
			dr.addData("template", ctlList.template);
			dtControl.addRecord(dr);
			
			datagrid ctlDatagrid = new datagrid();
			dr = new DataRecord();
			dr.addData("id", ctlDatagrid.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlDatagrid.name);
			dr.addData("icon", ctlDatagrid.icon);
			dr.addData("tagName", ctlDatagrid.tagName);
			dr.addData("type", ctlDatagrid.type);
			dr.addData("style", ctlDatagrid.style);
			dr.addData("template", ctlDatagrid.template);
			dtControl.addRecord(dr);
			
			treeview ctlTreeView = new treeview();
			dr = new DataRecord();
			dr.addData("id", ctlTreeView.id);
			dr.addData("lv", "1");
			dr.addData("name", ctlTreeView.name);
			dr.addData("icon", ctlTreeView.icon);
			dr.addData("tagName", ctlTreeView.tagName);
			dr.addData("type", ctlTreeView.type);
			dr.addData("style", ctlTreeView.style);
			dr.addData("template", ctlTreeView.template);
			dtControl.addRecord(dr);
			
			dpOut.addDataTable(dtControl);
			dpOut.addReturn("result", "success");
			
			return dpOut;
		}
		catch (Exception e)
		{
			Log.error(e);

			try
			{
				dpOut.addReturn("errorMessage",e.getMessage());
				dpOut.addReturn("result", "faild");
				
				return dpOut;
			}
			catch(Exception ex) 
			{		
				return null;
			}			
		}
	}
}

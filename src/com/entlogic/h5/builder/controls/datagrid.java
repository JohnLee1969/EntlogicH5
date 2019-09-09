package com.entlogic.h5.builder.controls;

public class datagrid
{
	public String id = "datagrid";
	public String name = "数据表格";
	public String icon = "&#xe673;";
	public String tagName = "div";
	public String type = "";
	public String style = "";
	public String template = ""
			+ "<div class='datagrid-head'>"
			+ "<div class='datagrid-head-content'>"
			+ "<div class='datagrid-col'>#[HCOL01]#</div>"
			+ "<div class='datagrid-col'>#[HCOL02]#</div>"
			+ "</div>"
			+ "</div>"
			+ "<div class='datagrid-body'>"
			+ "<div class='datagrid-body-content'>"
			+ "<div class='datagrid-row'>"
			+ "<div class='datagrid-cell'>#[RCOL01]#</div>"
			+ "<div class='datagrid-cell'>#[RCOL02]#</div>"
			+ "</div>"
			+ "</div>"
			+ "</div>";
}

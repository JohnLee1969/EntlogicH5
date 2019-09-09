package com.entlogic.h5.db;

import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;

public class BD_MODULE
{	
	public static String MS_CHECKIN = "&#xea5f;";
	public static String MS_CHECKOUT = "&#xe658;";
	public static String MS_WAITING = "&#xe7b0;";
	public static String MS_TESTING = "&#xe6dc;";
	public static String MS_BUG = "&#xe653;";
	public static String MS_OK = "&#xe603;";
	
	/**
	 * 获取模块状态
	 * 
	 * @param mofuleOid
	 * @return
	 * @throws Exception
	 */
	public static String[] getStatus(String mofuleOid, String userOid) throws Exception
	{
		QueryStatement query = new QueryStatement();
		query.SQL = ""
				+ "select "
				+ "	UPDATE_USER, "
				+ "	STATUS "
				+ "from "
				+ "	BD_MODULE "
				+ "where "
				+ "	OID = '#OID#'";
		query.setParameter("OID", mofuleOid);
		DataTable dtModule = query.excute("jdbc/entlogic", null);
		
		if (dtModule.getSize() == 0) return null;
		
		DataRecord drModule = dtModule.getRecord(0);
		String status = drModule.getValue("STATUS");
		String user = drModule.getValue("UPDATE_USER");
		String mark = "";
		if (status.equals("MS_CHECKIN")) 
		{
			mark = "<span style='font-size: 12px; color: #F99'>" + MS_CHECKIN + "</span>";
		} 
		else if (status.equals("MS_CHECKOUT"))
		{
			if (user.equals(userOid))
			{
				mark = "<span style='font-size: 12px; color: #090'>" + MS_CHECKOUT + "</span>";
			}
			else
			{
				mark = "<span style='font-size: 12px; color: #F99'>" + MS_CHECKOUT + "</span>";
			}			
		}
		else if (status.equals("MS_WAITING"))
		{
			mark = "<span style='font-size: 12px; color: #F99'>" + MS_WAITING + "</span>";
		}
		else if (status.equals("MS_TESTING"))
		{
			mark = "<span style='font-size: 12px; color: #F99'>" + MS_TESTING + "</span>";
		}
		else if (status.equals("MS_BUG"))
		{
			mark = "<span style='font-size: 12px; color: #F99'>" + MS_BUG + "</span>";
		}
		else if (status.equals("MS_OK"))
		{
			mark = "<span style='font-size: 12px; color: #F99'>" + MS_OK + "</span>";
		}
		
		String[] result = {status, user, mark};
		
		return result;
	}

	/**
	 * 添加模块管理记录
	 * 
	 * @param moduleOid
	 * @param userOid
	 * @throws Exception
	 */
	public static void add(String moduleOid, String userOid) throws Exception
	{
		UpdateStatement update = new UpdateStatement();
		update.SQL = ""
				+ "insert  BD_MODULE ( "
				+ "	OID,"
				+ "	MODULE_NAME, "
				+ "	MODULE_DESC, "
				+ "	WORKLOAD, "
				+ "	UPDATE_USER, "
				+ "	UPDATE_TIME, "
				+ "	STATUS "
				+ ") values ("
				+ "	'#OID#', "
				+ "	'#MODULE_NAME#', "
				+ "	'', "
				+ "	0, "
				+ "	'#UPDATE_USER#', "
				+ "	getDate(), "
				+ "	'#STATUS#' "
				+ ")";
		update.setParameter("OID", moduleOid);
		update.setParameter("MODULE_NAME", moduleOid);
		update.setParameter("UPDATE_USER", userOid);
		update.setParameter("STATUS", "MS_CHECKIN");
		update.excute("jdbc/entlogic", null);
	}
	
	/**
	 * 删除模块
	 * 
	 * @param moduleOid
	 * @param userOid
	 * @throws Exception
	 */
	public static void delete(String oid) throws Exception
	{
		QueryStatement qurey = new QueryStatement();
		qurey.SQL = "select OID from BD_TEST_CASE where MODULE = '" + oid + "'";
		DataTable dt = qurey.excute("jdbc/entlogic", null);
		for(int i = 0; i < dt.getSize(); i++)
		{
			BD_TEST_CASE.delete(dt.getRecord(i).getValue("OID"));
		}
		
		qurey.SQL = "select OID from BD_BUG where MODULE = '" + oid + "'";
		dt = qurey.excute("jdbc/entlogic", null);
		for(int i = 0; i < dt.getSize(); i++)
		{
			BD_BUG.delete(dt.getRecord(i).getValue("OID"));
		}

		UpdateStatement update = new UpdateStatement();
		update.SQL = "delete  BD_MODULE where 	OID = '" + oid + "'";
		update.excute("jdbc/entlogic", null);
	}
	
	/**
	 * 改名
	 * 
	 * @param oid
	 * @param newOid
	 * @throws Exception
	 */
	public static void rename(String oid, String newOid, String userOid) throws Exception
	{
		QueryStatement qurey = new QueryStatement();
		qurey.SQL = "select * from BD_MODULE where OID = '" + oid + "'";
		DataTable dt = qurey.excute("jdbc/entlogic", null);
		if (dt.getSize() == 0) return;		
		DataRecord drOld = dt.getRecord(0);
		
		UpdateStatement update = new UpdateStatement();
		update.SQL = ""
				+ "insert  BD_MODULE ("
				+ "	OID, "
				+ "	UPDATE_USER, "
				+ "	STATUS, "
				+ "	UPDATE_TIME"
				+ ") values ("
				+ "	'#OID#', "
				+ "	'#UPDATE_USER#', "
				+ "	'#STATUS#', "
				+ "	getDate()"
				+ ")";
		update.setParameter("OID", newOid);
		update.setParameter("UPDATE_USER", userOid);
		update.setParameter("STATUS", drOld.getValue("STATUS"));
		update.excute("jdbc/entlogic", null);
		
		update.SQL = "update BD_TEST_CASE set MODULE = '" + newOid + "' where OID = '" + oid + "'";
		update.excute("jdbc/entlogic", null);

		update.SQL = "delete  BD_MODULE where 	OID = '" + oid + "'";
		update.excute("jdbc/entlogic", null);
	}
}

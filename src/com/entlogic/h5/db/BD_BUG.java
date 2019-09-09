package com.entlogic.h5.db;

import com.entlogic.h5.data.DataTable;

public class BD_BUG
{	
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
		qurey.SQL = "select OID from BD_BUG_IMAGES where BUG = '" + oid + "'";
		DataTable dt = qurey.excute("jdbc/entlogic", null);
		for(int i = 0; i < dt.getSize(); i++)
		{
			BD_BUG_IMAGES.delete(dt.getRecord(i).getValue("OID"));
		}
		
		UpdateStatement update = new UpdateStatement();
		update.SQL = "delete  BD_BUG where OID = '#OID#'";
		update.setParameter("OID", oid);
		update.excute("jdbc/entlogic", null);
	}
}

package com.entlogic.h5.db;

import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;

public class BD_TEST_CASE
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
		qurey.SQL = "select OID from BD_BUG where TEST_LOG = '" + oid + "'";
		DataTable dt = qurey.excute("jdbc/entlogic", null);
		for(int i = 0; i < dt.getSize(); i++)
		{
			BD_BUG.delete(dt.getRecord(i).getValue("OID"));
		}
		
		UpdateStatement update = new UpdateStatement();
		update.SQL = "delete  BD_TEST_LOG  where 	OID = '#OID#'";
		update.setParameter("OID", oid);
		update.excute("jdbc/entlogic", null);
	}
}

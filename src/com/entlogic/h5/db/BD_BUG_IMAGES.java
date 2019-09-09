package com.entlogic.h5.db;

import com.entlogic.h5.data.DataRecord;
import com.entlogic.h5.data.DataTable;

public class BD_BUG_IMAGES
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
		UpdateStatement update = new UpdateStatement();
		update.SQL = "delete  BD_BUG_IMAGES  where 	OID = '#OID#'";
		update.setParameter("OID", oid);
		update.excute("jdbc/entlogic", null);
	}
}

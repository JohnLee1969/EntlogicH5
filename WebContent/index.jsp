<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page language="java" import="com.entlogic.h5.*"%>
<%
	String path = request.getContextPath();
	String applicationRoot = Application.getParameter("ApplicationRoot");
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path +"/app_modules/entlogicSystem/app.html";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'index.jsp' starting page</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
  </head>
  
  <body>
    <script language='javascript'>
		document.location = '<%=basePath %>?applicationRoot=<%=applicationRoot %>';
    </script>
  </body>
</html>

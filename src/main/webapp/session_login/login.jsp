<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Login Demo</title>
</head>
<body>
<%
    String s = session.getId(); //get session ID
    int maxInactiveInterval = session.getMaxInactiveInterval();
%>

<p>Your session ID is: <%=s %>  </p>
<p>maxInactiveInterval = <%=maxInactiveInterval %>  </p>

<p>This Demo works only under https</p>
<form action="login_authentication.jsp" method="post">
    <input type="text" name="user" placeholder="User Name: (Endora)"/>
    <br/>
    <br/>
    <input type="password" name="password" placeholder="password (123456)"/>
    <br/>
    <br/>
    <input type="submit" value="Login"/>
</form>
</body>
</html>
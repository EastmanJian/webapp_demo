<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Welcome</title>
</head>
<body>
<%
    String s = session.getId(); //get session ID
    int maxInactiveInterval = session.getMaxInactiveInterval();
%>

<p>Your session ID is: <%=s %>  </p>
<p>maxInactiveInterval = <%=maxInactiveInterval %>  </p>

<%
    if(session.getAttribute("user") == null)
    {
        out.println("<script>alert('Please Login first.');window.location.href='login.jsp'</script>");
        return;
    }
    Object user = session.getAttribute("user");
    out.println("Welcome "+user);
%>
<br/>
<form action="#" method="post">
    <button type="submit" formaction="logout.jsp">logout</button>
</form>

</body>
</html>
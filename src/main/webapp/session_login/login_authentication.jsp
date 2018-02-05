<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8"%>
<%
    String name = request.getParameter("user");
    String pass = request.getParameter("password");
    System.out.print("name="+name);
    System.out.print("password="+pass);
    boolean isLoginSuccess = ("Endora".equals(name) && "123456".equals(pass));
    System.out.print("isLoginSuccess="+isLoginSuccess);
    if(isLoginSuccess)
    {
        out.println("<script>alert('Login Successfully');window.location.href='index.jsp'</script>");
        session.setAttribute("user", name);
        session.setMaxInactiveInterval(60);
    }
    else
    {
        out.println("<script>alert('Login Fail');window.location.href='login.jsp'</script>");
    }
%>
<%@page contentType="text/html;charset=UTF-8" %>
<html>
<head></head>
<body>
<%
    String s = session.getId(); //get session ID
%>
<p>Your session ID is: <%=s %>  </p>
<p>Under Http, refresh screen the session ID will change.</p>
<p>The session takes effect only under https.</p>
<p>Remove the browser session ID cookie and refresh the page, a new session ID will be created.</p>

<%! //need to use ! here
    int visitorCnt = 0;
    synchronized void countPeople() { //synchronize for thread-safe
        visitorCnt++;
    }
%>

<%
    if (session.isNew()) {
        countPeople();
        String str = String.valueOf(visitorCnt);
        session.setAttribute("count", str);
    }
%>

<%--Actually, we can use the variable visitorCnt directly here instead of using session attribute--%>
<p> Your are the no. <%=(String) session.getAttribute("count")%> person visit this site.
</p>

</body>
</html>
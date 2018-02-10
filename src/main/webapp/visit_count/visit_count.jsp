<%@page contentType="text/html;charset=UTF-8" %>
<%@ page session="true"%>
<html>
<head></head>
<body>
<%
    String s = session.getId(); //get session ID
    int maxInactiveInterval = session.getMaxInactiveInterval();
    String yourMsg = request.getParameter("yourMsg");
%>

<p>Your session ID is: <%=s %>  </p>
<p>maxInactiveInterval = <%=maxInactiveInterval %>  </p>
<p>Under Http, refresh screen the session ID will change.</p>
<p>The session takes effect only under https.</p>
<p>Remove the browser session ID cookie and refresh the page, a new session ID will be created.</p>

<%! //need to use ! here
    int visitCnt = 0;
    synchronized void countVisit() { //synchronize for thread-safe
        visitCnt++;
    }
%>

<%
    countVisit();
%>
<p> This page has been visited <%=visitCnt%> times</p>
<p> You submitted words: <%=yourMsg%> </p>

<form target="_self" action="visit_count.jsp" method="post">
    <input type="text" name="yourMsg"/>
    <input type="submit">
</form>
</body>
</html>
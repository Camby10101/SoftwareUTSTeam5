<!-- welcome.jsp -->
<!DOCTYPE html>
<html>
<head>
<title>Welcome</title>
</head>
<body>
<%
// Retrieve form data using the request object
String email = request.getParameter("email");
String fullName = request.getParameter("fullName");
String password = request.getParameter("password");
String gender = request.getParameter("gender");
String favouriteColour = request.getParameter("favouriteColour");
String agreeTOS = request.getParameter("agreeTOS");

// Check if the user agreed to the TOS
if (agreeTOS != null && agreeTOS.equals("on")) {
%>
<h1>Welcome, <%= fullName %>!</h1>
<p>Your Email is <%= email %>.</p>
<p>Your password is <%= password %>.</p>
<p>Your gender is <%= gender %>.</p>
<p>Your favourite colour is <%= favouriteColour %>.</p>
<body style="background-color: <%= favouriteColour %>;">
<%
} else {
%>
<h1>Sorry, you must agree to the Terms of Service.</h1>
<a href="register.jsp">Click here to go back.</a>
<%
}
%>
</body>
</html>
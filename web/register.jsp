
<%@page contentType="text/html" pageEncoding="UTF-8"%>




<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>IoTBay - Register</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/styles.css">
</head>
<body>
    <header>
        <h1>IoTBay</h1>
        <p>Your one-stop shop for IoT products</p>
    </header>

    <div class="form-container">
        <h2>Register</h2>
        <form action="register" method="post">
           <table> 
            <tr><td> Email </td><td><input type="text" placeholder="Enter Email" name="email" required="True"></td></tr>
            <tr><td> Full Name </td><td><input type="text" placeholder="Enter Full Name" name="name" required="True"></td></tr>
            <tr><td> Password </td><td><input type="text" placeholder="Enter Password" name="Password" required="True"></td></tr>
            <tr><td> Gender </td><td><input type="radio" placeholder="Enter Gender" name="Gender" required="True"></td></tr>
            <tr><td> Favourite Colour </td><td><input type="text" placeholder="Enter Favourite Colour" name="Favourite Colour" required="True"> </td></tr>
            <tr><td> Agree to TOS </td><td><input type="checkbox" name="name" required="True"></td></tr>
           </table>
        </form>
        <p>Already have an account? <a href="login.jsp">Login here</a></p>
    </div>

    <footer>
        <p>&copy; IoTBay Team 5</p>
    </footer>
</body>
</html>
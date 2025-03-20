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
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="email">Gender:</label>
            <input type="radio" name="gender" value="Male" required>
            <input type="radio" name="gender" value="Female">

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>

            <label for="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required>

            <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="login.jsp">Login here</a></p>
    </div>

    <footer>
        <p>&copy; IoTBay Team 5</p>
    </footer>
</body>
</html>
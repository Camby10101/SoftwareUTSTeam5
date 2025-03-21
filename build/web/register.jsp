<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>IoTBay - Register</title>
    <link rel="stylesheet" type="text/css" href="CSS/styles.css">
</head>
<body>
    <header>
        <h1>IoTBay</h1>
        <p>Your one-stop shop for IoT products</p>
    </header>

    <div class="form-container">
        <h2>Register</h2>
        <form action="welcome.jsp" method="post">
            Email: <input type="email" name="email" required><br><br>
            Full Name: <input type="text" name="fullName" required><br><br>
            Password: <input type="password" name="password" required><br><br>
            Gender:
            <input type="radio" name="gender" value="Male" required> Male
            <input type="radio" name="gender" value="Female"> Female<br><br>
            Favourite Colour:
            <select name="favouriteColour" required>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
            </select><br><br>
            Agree to TOS: <input type="checkbox" name="agreeTOS" required><br><br>
            <input type="submit" value="Register">
            </form>
        <p>Already have an account? <a href="login.jsp">Login here</a></p>
    </div>

    <footer>
        <p>&copy; IoTBay Team 5</p>
    </footer>
</body>
</html>
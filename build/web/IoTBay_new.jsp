
<header>
    <h1>IoTBay</h1>
    <p>Your one-stop shop for IoT products</p>
    <nav>
        <a href="register.jsp">Register</a> | 
        <a href="login.jsp">Login</a>
    </nav>
</header>

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>IoTBay - Products</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/styles.css">
</head>
<body>
    <header>
        <h1>IoTBay</h1>
        <p>Your one-stop shop for IoT products</p>
    </header>

    <div class="product-container">
        <div class="product-card">
            <img src="${pageContext.request.contextPath}/images/product1.jpg" alt="Smart Thermostat">
            <h2>Smart Thermostat</h2>
            <p>Control your home's temperature from anywhere.</p>
            <p class="price">$199.99</p>
            <button>Add to Cart</button>
        </div>

        <div class="product-card">
            <img src="${pageContext.request.contextPath}/images/product2.jpg" alt="Smart Light Bulb">
            <h2>Smart Light Bulb</h2>
            <p>Adjust brightness and color with your smartphone.</p>
            <p class="price">$29.99</p>
            <button>Add to Cart</button>
        </div>

        <div class="product-card">
            <img src="${pageContext.request.contextPath}/images/product3.jpg" alt="Smart Security Camera">
            <h2>Smart Security Camera</h2>
            <p>Monitor your home 24/7 with high-definition video.</p>
            <p class="price">$149.99</p>
            <button>Add to Cart</button>
        </div>
    </div>

    <footer>
        <p>&copy; 2023 IoTBay. All rights reserved.</p>
    </footer>
</body>
</html>


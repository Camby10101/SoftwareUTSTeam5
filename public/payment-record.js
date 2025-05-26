document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".user-info-form");

    // Load the latest saved details, if any
    const latestPayment = localStorage.getItem("latestPayment");
    if (latestPayment) {
        const data = JSON.parse(latestPayment);
        document.getElementById("cardholderName").value = data.cardholderName || "";
        document.getElementById("cardType").value = data.cardType || "";
        document.getElementById("cardNumber").value = data.cardNumber || "";
        document.getElementById("pin").value = data.pin || "";
        document.getElementById("expiry").value = data.expiry || "";
        document.getElementById("address").value = data.address || "";
    }

    // Intercept form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // prevent actual submission

        // Gather form data
        const data = {
            cardholderName: document.getElementById("cardholderName").value,
            cardType: document.getElementById("cardType").value,
            cardNumber: document.getElementById("cardNumber").value,
            pin: document.getElementById("pin").value,
            expiry: document.getElementById("expiry").value,
            address: document.getElementById("address").value,
            timestamp: new Date().toISOString()
        };

        // Save with unique ID (e.g., timestamp-based key)
        const id = "payment_" + Date.now();
        localStorage.setItem(id, JSON.stringify(data));

        // Save as latest
        localStorage.setItem("latestPayment", JSON.stringify(data));

        alert("Payment information saved to the database :)");
    });
});

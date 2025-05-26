document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".user-info-form");

    // Load latest payment data into form if present
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

    // Save new payment info
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = {
            cardholderName: document.getElementById("cardholderName").value,
            cardType: document.getElementById("cardType").value,
            cardNumber: document.getElementById("cardNumber").value,
            pin: document.getElementById("pin").value,
            expiry: document.getElementById("expiry").value,
            address: document.getElementById("address").value,
            timestamp: new Date().toISOString()
        };

        const id = "payment_" + Date.now();
        localStorage.setItem(id, JSON.stringify(data));
        localStorage.setItem("latestPayment", JSON.stringify(data));
        alert("Payment information saved locally!");

        // Refresh payment history list
        renderPaymentHistory();
    });

    // Render all saved payment methods
    function renderPaymentHistory(filter = {}) {
        const container = document.getElementById("paymenthistory-container");
        container.innerHTML = ""; // Clear previous content

        const keys = Object.keys(localStorage).filter(key => key.startsWith("payment_"));
        if (keys.length === 0) {
            container.innerHTML = "<p>No payment records found.</p>";
            return;
        }

        const filteredKeys = keys.filter(key => {
            const record = JSON.parse(localStorage.getItem(key));

            const matchesId = filter.id ? key.includes(filter.id) : true;
            const matchesDate = filter.date
                ? record.timestamp && record.timestamp.startsWith(filter.date)
                : true;

            return matchesId && matchesDate;
        });

        if (filteredKeys.length === 0) {
            container.innerHTML = "<p>No matching payment records.</p>";
            return;
        }

        filteredKeys.sort().reverse().forEach(key => {
            const record = JSON.parse(localStorage.getItem(key));
            const div = document.createElement("div");
            div.className = "payment-record";
            div.innerHTML = `
                <strong>#${key.replace("payment_", "")}</strong><br>
                Name: ${record.cardholderName}<br>
                Card: ${record.cardType} ****${record.cardNumber.slice(-4)}<br>
                Expiry: ${record.expiry}<br>
                Date Saved: ${new Date(record.timestamp).toLocaleString()}<br>
                Address: ${record.address}<br><br>
            `;
            container.appendChild(div);
        });
    }

    // Expose search function globally for button onclick
    window.searchPayments = function () {
        const idInput = document.getElementById("search-payment-id").value.trim();
        const dateInput = document.getElementById("search-date").value.trim();

        renderPaymentHistory({
            id: idInput,
            date: dateInput
        });
    };

    // Initial render
    renderPaymentHistory();
});

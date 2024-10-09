window.onload = function () {
    // Wait for the Swagger UI to be ready
    const checkSwaggerUI = setInterval(() => {
        if (window.swaggerUi) {
            clearInterval(checkSwaggerUI);
            console.log("Swagger UI is ready. Starting auto login...");
            autoLogin().then();
        }
    }, 100); // Check every 100 ms
};

// Function to automatically log in
async function autoLogin() {
    const loginRequest = {
        email: "N/A", // Replace with actual username
        roleType: "Admin" // Replace with actual password
    };

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginRequest)
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;
            console.log("Login successful, token received:", token);

            // Check if swaggerUi is defined
            if (window.swaggerUi && window.swaggerUi.authActions) {
                window.swaggerUi.authActions.authorize({
                    "Bearer": {
                        name: "Bearer",
                        schema: { type: "string", format: "jwt" },
                        value: `Bearer ${token}`,
                    }
                });
                console.log("Authorization successful.");
            } else {
                console.error("Swagger UI authActions is not defined");
            }
        } else {
            console.error("Login failed with status:", response.status);
            const errorData = await response.json();
            console.error("Error details:", errorData);
        }
    } catch (error) {
        console.error("An error occurred during login:", error);
    }
}

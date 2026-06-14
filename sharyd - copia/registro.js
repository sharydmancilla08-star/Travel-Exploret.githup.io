const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const country = document.getElementById("country").value;

    if (!name || !email || !password || !country) {
        return alert("Por favor completa todos los campos.");
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
        return alert("Este correo ya está registrado. Inicia sesión o usa otro correo.");
    }

    const newUser = {
        name,
        email,
        pass: password,
        country,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registro exitoso. Por favor inicia sesión.");
    window.location.href = "ingreso.html";
});

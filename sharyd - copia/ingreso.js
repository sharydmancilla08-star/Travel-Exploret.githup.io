const ingreso = document.querySelector("#ingresop")

ingreso.addEventListener("submit", (e)=>{
    e.preventDefault()
    const email = document.querySelector("#email").value.trim().toLowerCase();
    const pass = document.querySelector("#password").value;

    const Users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = Users.find(
        (user) => user.email === email && user.pass === pass
    );

    if(!validUser){
        return alert("Usuario y/o contraseña incorrectas!");
    };
    
    alert(`bienvenido ${validUser.name}`);

    localStorage.setItem("login_success", JSON.stringify(validUser));
    window.location.href = "pagprincipal.html";
})

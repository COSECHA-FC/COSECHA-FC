function login(){

let email = document.getElementById("email").value;
let pass = document.getElementById("password").value;

if(email=="admin" && pass=="1234"){

window.location="panel.html";

}else{

alert("Datos incorrectos");

}

}

function logout(){

window.location="index.html";

}
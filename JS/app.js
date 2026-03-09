// 🔥 IMPORTS FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs, updateDoc, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// 🔥 CONFIG FIREBASE (TU CONFIG REAL)
const firebaseConfig = {
  apiKey: "AIzaSyCcm_MAtt0TeAl_zeUhtpy4M7LPDCQoHdc",
  authDomain: "cosecha-fc.firebaseapp.com",
  projectId: "cosecha-fc",
  storageBucket: "cosecha-fc.firebasestorage.app",
  messagingSenderId: "563883233532",
  appId: "1:563883233532:web:09e19230108d4c9ca54779",
  measurementId: "G-4ZZ33H17NV"
};

// 🔥 INICIALIZAR
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = "walter_12c@hotmail.com";

// 🔥 REGISTRO SIN FOTO
window.register = async function () {

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const dni = document.getElementById("dni").value;
  const categoria = document.getElementById("categoria").value;
  const email = document.getElementById("emailReg").value;
  const password = document.getElementById("passwordReg").value;

  try {

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "usuarios", user.uid), {
      nombre,
      apellido,
      dni,
      categoria,
      email,
      estado: "pendiente",
      cuotaAlDia: false,
      numeroSocio: null,
      fechaRegistro: new Date()
    });

    alert("Solicitud enviada correctamente");

  } catch (error) {
    console.error(error);
    alert("Error: " + error.message);
  }
};
window.login = async function () {

  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("passwordLogin").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.email === ADMIN_EMAIL) {
      alert("Bienvenido Admin");
      mostrarPanelAdmin();
    } else {
      alert("Bienvenido Jugador");
      mostrarPanelJugador(user.uid);
    }

  } catch (error) {
    alert("Error login: " + error.message);
  }
};
async function mostrarPanelAdmin() {

  document.body.innerHTML = `
    <h2>Panel Administrador - COSECHA FC</h2>
    <div id="listaSocios"></div>
  `;

  const lista = document.getElementById("listaSocios");

  const q = query(collection(db, "usuarios"), orderBy("fechaRegistro"));
  const querySnapshot = await getDocs(q);

  let numero = 1;

  querySnapshot.forEach((docSnap) => {

    const data = docSnap.data();

    lista.innerHTML += `
      <div style="border:1px solid black; margin:10px; padding:10px;">
        <strong>${data.nombre} ${data.apellido}</strong><br>
        DNI: ${data.dni}<br>
        Categoría: ${data.categoria}<br>
        Estado: ${data.estado}<br>
Número actual: ${data.numeroSocio ?? "Sin asignar"}<br>
Cuota al día: ${data.cuotaAlDia ? "SI ✅" : "NO ❌"}<br><br>

<button onclick="marcarPago('${docSnap.id}')">
Marcar cuota paga
</button>

<button onclick="aprobarSocio('${docSnap.id}', ${numero})">
Aprobar
</button>
      </div>
    `;

    numero++;
  });
}
window.aprobarSocio = async function (id, numero) {

  await updateDoc(doc(db, "usuarios", id), {
    estado: "aprobado",
    numeroSocio: numero
  });

  alert("Socio aprobado correctamente");

  mostrarPanelAdmin();
};
async function mostrarPanelJugador(uid) {

  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDocs(query(collection(db, "usuarios")));

  const userDoc = await fetchUsuario(uid);

  document.body.innerHTML = `
    <h2>Panel Jugador - COSECHA FC</h2>
    <p><strong>Nombre:</strong> ${userDoc.nombre} ${userDoc.apellido}</p>
    <p><strong>Categoría:</strong> ${userDoc.categoria}</p>
    <p><strong>Estado:</strong> ${userDoc.estado}</p>
    <p><strong>Número de socio:</strong> ${userDoc.numeroSocio ?? "Aún no asignado"}</p>
    <p><strong>Cuota al día:</strong> ${userDoc.cuotaAlDia ? "SI ✅" : "NO ❌"}</p>
  `;
}
async function fetchUsuario(uid) {
  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}
window.marcarPago = async function(id) {

  await updateDoc(doc(db, "usuarios", id), {
    cuotaAlDia: true,
    fechaPago: new Date()
  });

  alert("Pago registrado correctamente");

  mostrarPanelAdmin();
};
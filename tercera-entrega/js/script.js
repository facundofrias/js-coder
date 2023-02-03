// Declaración de  clases

class Cliente {
  constructor(nombre, apellido, dni) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
  }
}

class Propina {
  constructor(
    fecha = new Date(),
    porcentajePropina,
    cantidadPersonas,
    totalPropina = 0,
    totalCuenta = 0,
    montosComensales = []
  ) {
    this.fecha = fecha;
    this.porcentajePropina = parseInt(porcentajePropina);
    this.cantidadPersonas = parseInt(cantidadPersonas);
    this.totalPropina = parseFloat(totalPropina);
    this.totalCuenta = parseFloat(totalCuenta);
    this.montosComensales = montosComensales;
  }

  // Métodos

  // Formatea la fecha
  formatearFecha() {
    const yyyy = this.fecha.getFullYear();
    let mm = this.fecha.getMonth() + 1,
        dd = this.fecha.getDate(),
        hora = this.fecha.getHours(),
        minutos = this.fecha.getMinutes(),
        segundos = this.fecha.getSeconds();

    // Agrega '0' a días, meses, horas, minutos y segundos menores que 10
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (hora < 10) hora = '0' + hora;
    if (minutos < 10) minutos = '0' + minutos;
    if (segundos < 10) segundos = '0' + segundos;

    // Devuelve la fecha formateada. Ejemplo de salida: 31/01/2023 19:27:07
    return (`${dd}/${mm}/${yyyy} ${hora}:${minutos}:${segundos}`);
  }
}

// ----- MAIN -----

// Verifica la existencia de un cliente para cargar sus datos
existeCliente();

// Declaración variables
let porcentajePropina = document.getElementById("porcentaje-propina"),
    cantidadComensales = document.getElementById("cantidad-comensales"),
    btnSiguiente = document.getElementById("btn-mostrar-comensales"),
    contenedorPrincipal = document.getElementById("contenedor-principal"),
    btnRegistro = document.getElementById("btn-registro");


// ----- EVENTOS -----
// Se dispara cuando se establecieron valores en campos de porcentaje propina y cantidad de comensales
btnSiguiente.addEventListener("click", validarYGenerarCampos);

// Se dispara cuando se pretende efectuar registro de cliente
btnRegistro.addEventListener("click", validarRegistro);


// Valida que los datos ingresados en el formulario de registro sean válidos
function validarRegistro() {
  const nombre = document.getElementById("nombre").value,
        apellido = document.getElementById("apellido").value,
        dni = document.getElementById("dni").value;

  if ((nombre !== '') && (apellido !== '') && (validarNumeroEntero(Number(dni)))) {
    almacenarCliente(nombre, apellido, dni);
  } else {
    alert("¡Datos personales erróneos o incompletos!");
  }
}

// Almacena cliente
function almacenarCliente(nombre, apellido, dni) {
  borrarDatosClienteYPropinas();
  if (document.getElementById("btn-registro").textContent == "Cambiar") {
    limpiarStorage();
  } else {
    document.getElementById("btn-registro").textContent = "Cambiar"
  }
  let cliente = new Cliente(nombre, apellido, dni),
      textoBienvenida = document.getElementById("texto-bienvenida");
  localStorage.setItem('cliente', JSON.stringify(cliente));
  textoBienvenida.textContent = `¡Te damos la bienvenida, ${cliente.nombre}!`;
  document.getElementById("texto-datos-personales").innerHTML = `¿No sos <strong>${cliente.nombre} ${cliente.apellido}</strong>? No te preocupes, podés cambiar tus datos personales; o utilizar la app de manera anónima haciendo clic <a href="" id="anonima">acá</a>.`;
  generarEventoBorrarHistorialYPropinas();
}

// ----- FUNCIONES -----


// Completa los datos del cliente en el formulario 
// Reemplaza el texto del botón de registro por "Cambiar"
// Reemplaza el texto de bienvenida a la app
function completarDatosCliente() {
  let c = JSON.parse(localStorage.getItem('cliente'));
  document.getElementById("nombre").value = c.nombre;
  document.getElementById("apellido").value = c.apellido;
  document.getElementById("dni").value = c.dni;
  
  document.getElementById("texto-bienvenida").textContent = `¡Te damos la bienvenida nuevamente, ${c.nombre}!`;
  document.getElementById("texto-datos-personales").innerHTML = `¿No sos <strong>${c.nombre} ${c.apellido}</strong>? No te preocupes, podés cambiar tus datos personales; o utilizar la app de manera anónima haciendo clic <a href="" id="anonima">acá</a>.`;
  document.getElementById("btn-registro").textContent = "Cambiar";
  
  generarEventoBorrarHistorialYPropinas();  
}

// Valida los campos "Porcentaje propina" y "Cantidad de comensales" y muestra los inputs correspondientes a cantidad de comensales
function validarYGenerarCampos() {
  if (!validarNumero(porcentajePropina.value)) {
    alert("¡El valor ingresado en porcentaje de propina es inválido!");
  }

  if (!validarNumeroEntero(cantidadComensales.value)) {
    alert("¡El valor ingresado en Cantidad de comensales es inválido!");
  }

  if (validarNumero(porcentajePropina.value) && validarNumeroEntero(cantidadComensales.value)) {
    generarComensales();
  }
}

// Genera los inputs correspondientes a la cantidad de comensales
function generarComensales() {
  const contenedorCalculoPropina = document.createElement("div"),
        tituloMontosComensales = document.createElement("h3"),
        montos = document.createElement("div"),
        btnCalcularPropina = document.createElement("button"),
        btnBorrarDatosPropina = document.createElement("button");
        
  limpiarPropina();
  
  contenedorCalculoPropina.id = "contenedor-calculo-propina";
  contenedorPrincipal.appendChild(contenedorCalculoPropina);

  tituloMontosComensales.textContent = "Montos comensales:";
  tituloMontosComensales.id = "titulo-montos";
  contenedorCalculoPropina.appendChild(tituloMontosComensales);
  
  montos.classList.add("montos");
  montos.id = "montos";
  contenedorCalculoPropina.appendChild(montos);
  
  for (let i = 0; i < cantidadComensales.value; i++) {
    let field = `
        <div class="field">
          <label class="field__title" for="name">Persona ${i + 1}:</label>
          <input class="monto-propinas" type="number">
          <span class="propina">Propina:</span>
        </div>
        `;
  
    montos.innerHTML = montos.innerHTML + field;
  }

  // Setea focus en el primer input "monto propinas"
  document.getElementsByClassName("monto-propinas")[0].focus();
  // Agrega botón "Calcular propina"
  btnCalcularPropina.textContent = "Calcular propina";
  btnCalcularPropina.id = "btn-calcular-propina";
  contenedorCalculoPropina.appendChild(btnCalcularPropina);
  // Genera botón "Limpiar"
  btnBorrarDatosPropina.textContent = "Limpiar";
  btnBorrarDatosPropina.id = "btn-borrar-datos-propina";
  contenedorCalculoPropina.appendChild(btnBorrarDatosPropina);
  
  // Evento que se dispara cuando se pretende calcular la propina (click en botón "Calcula propina")
  btnCalcularPropina.addEventListener("click", validarMontosComensales);
  
  // Evento que se dispara cuando se pretende limpiar los campos del cálculo de propina
  btnBorrarDatosPropina.addEventListener("click", borrarDatosPropina);

  const totales = document.createElement("div");
  totales.classList.add("totales");
  totales.id = "totales";
  const textoTotales = `
    <span id="monto-total">Monto total a pagar:</span>
    <span id="propina-total">Monto total de propina:</span>
  `;
  totales.innerHTML = textoTotales;
  contenedorCalculoPropina.appendChild(totales);
}

// Valida el correcto ingreso de los montos de cada comensal
function validarMontosComensales() {
  let montosComensales = document.getElementsByClassName("field"),
      nombresDatosInvalidos = [],
      montosErroneos = `Existen datos erróneos, estos se encuentran en:\n`;

  for (let i = 0; i < montosComensales.length; i++) {
    let valorIngresado = montosComensales[i].firstElementChild.nextElementSibling.value;
    if (!validarNumero(valorIngresado)) {
      nombresDatosInvalidos.push(montosComensales[i].firstElementChild.textContent.slice(0, -1));
    } 
  }
  
  for (let i = 0; i < nombresDatosInvalidos.length; i++) {
    montosErroneos = montosErroneos + `${nombresDatosInvalidos[i]}\n`;
  } 
  if(montosErroneos !== `Existen datos erróneos, estos se encuentran en:\n`) {
    alert(montosErroneos);
  } else {
    calcularMontoTotalYPropina();
  }
}

// Calcula el monto total a pagar y la propina total
function calcularMontoTotalYPropina() {
  const propina = new Propina();
  let propinaComensal,
      montosComensalesHTML = document.getElementsByClassName("monto-propinas");
  propina.fecha = propina.formatearFecha();
  propina.cantidadPersonas = cantidadComensales.value;
  propina.porcentajePropina = Number(porcentajePropina.value);
  for (let i = 0; i < montosComensalesHTML.length; i++) {
    propina.totalCuenta = Number(propina.totalCuenta) + Number(montosComensalesHTML[i].value);
    // propinaComensal = Number(montosComensalesHTML[i].value) / propina.porcentajePropina;
    propinaComensal = sinCeros(Number(montosComensalesHTML[i].value) * (Number(propina.porcentajePropina) / 100));
    propina.montosComensales[i] = montosComensalesHTML[i].value;
    montosComensalesHTML[i].nextElementSibling.textContent = `Propina: $${propinaComensal}`;
  }
  // propina.totalPropina = sinCeros(Number(propina.totalCuenta) / propina.porcentajePropina);
  propina.totalPropina = sinCeros(Number(propina.totalCuenta) * (Number(propina.porcentajePropina) / 100));
  document.getElementById("monto-total").textContent = `Monto total a pagar: $${propina.totalCuenta}`;
  document.getElementById("propina-total").textContent = `Propina total: $${propina.totalPropina}`;
  almacenarPropina(propina);
}

// Limpia el html dedicado a calcular propina
function limpiarPropina() {
  if(document.getElementById("contenedor-calculo-propina")) {
    document.getElementById("contenedor-calculo-propina").remove();
    // document.getElementById("titulo-montos").remove();
    // document.getElementById("montos").remove();
    // document.getElementById("btn-calcular-propina").remove();
    // document.getElementById("btn-borrar-datos-propina").remove();
    // document.getElementById("totales").remove();
  }
}

// Borra datos de propina ingresada
function borrarDatosPropina() {
  if(document.getElementById("contenedor-calculo-propina")) {
    document.getElementById("contenedor-calculo-propina").remove();
    // document.getElementById("titulo-montos").remove();
    // document.getElementById("montos").remove();
    // document.getElementById("btn-calcular-propina").remove();
    // document.getElementById("btn-borrar-datos-propina").remove();
    // document.getElementById("totales").remove();
    porcentajePropina.value = "";
    cantidadComensales.value = "";
    porcentajePropina.focus();
  }
}

// Almacena propina asociada a cliente
function almacenarPropina(propina) {
  let propinas = [];
  if (localStorage.getItem('cliente') !== null) {
    if(localStorage.getItem("propinas") !== null) {    
      propinas = JSON.parse(localStorage.getItem('propinas')); 
      }
    propinas.push(propina);
    localStorage.setItem("propinas", JSON.stringify(propinas));
    propinas = JSON.parse(localStorage.getItem('propinas'));
    // Si la cantidad de propinas almacenadas es igual a 5, borra la útima
    if(propinas.length == 1) {
      generarTituloYEncabezadoPropinas();
    }
    if(propinas.length > 2) {
      propinas.shift();
      localStorage.setItem("propinas", JSON.stringify(propinas));
    }
    mostrarUltimasPropinas(propinas);
  }
}

// Genera el título y encabezado del historial de propinas
function generarTituloYEncabezadoPropinas() {
  let historialPropinasHTML = `
        <h4 id="titulo-historial-propinas">Tu historial de propinas (guardamos tus últimas 5 propinas)</h4> 
      `,
      tableHTML = `
          <table class="historial-propinas" id="tabla-propinas">
            <tr id="encabezado-propinas">
              <th>Fecha</th>
              <th>Cantidad de comensales</th>
              <th>Monto total</th>
              <th>Porcentaje propina</th>
              <th>Monto propina</th>
            </tr>
          </table>
        `,
  textoBienvenida = document.getElementById("texto-bienvenida");
  textoBienvenida.insertAdjacentHTML("afterend", historialPropinasHTML);
  historialPropinasHTML = document.getElementById("titulo-historial-propinas");
  historialPropinasHTML.insertAdjacentHTML("afterend", tableHTML);
}

// Limpia las propinas
function limpiarListaPropinas() {
  document.querySelectorAll('.datos-propinas').forEach(elemento => {
    elemento.remove();
  });
}

// Muestra las últimas 5 propinas del cliente registrado
function mostrarUltimasPropinas(propinas) {
  propinas.reverse(propinas.fecha);
  limpiarListaPropinas();
  for (let i = 0; i < propinas.length; i++) {
    let trDatosPropinas = document.createElement("tr");
        datos = `
                  <td class="data">${propinas[i].fecha}</td>
                  <td class="data">${propinas[i].cantidadPersonas}</td>
                  <td class="num">$${propinas[i].totalCuenta}</td>
                  <td class="num">${propinas[i].porcentajePropina}%</td>
                  <td class="num">$${propinas[i].totalPropina}</td>
              `;
    trDatosPropinas.classList.add("datos-propinas");
    trDatosPropinas.innerHTML = datos;
    document.getElementById("tabla-propinas").appendChild(trDatosPropinas);
  }
}

// Borra storage de Cliente y Propinas y recarga la página para cargar el contenido HTML por defecto
function borrarDatosClienteYPropinas() {
  limpiarStorage();
  borrarHistorialPropinas();
  borrarDatosPropina();
  // window.location.reload();
}

// Borra la tabla de Historial de propinas
function borrarHistorialPropinas() {
  if(document.getElementById("titulo-historial-propinas") !== null) {
    document.getElementById("titulo-historial-propinas").remove();
    document.getElementById("tabla-propinas").remove();
  }
}

// Dispara un evento que se ejecuta cuando se hace clic sobre "anónima"
function generarEventoBorrarHistorialYPropinas() {
  document.getElementById("anonima").addEventListener("click", borrarDatosClienteYPropinas);
}

// ----- Funciones de utilidad -----

// Verifica si existe cliente y completa los datos personales
function existeCliente() {
  if (localStorage.getItem('cliente') !== null) {
    completarDatosCliente();
    existenPropinas();
  }
}

// Verifica si existen propinas asociadas a cliente y completa el historial de clientes
function existenPropinas() {
  if(localStorage.getItem("propinas") !== null) {
    generarTituloYEncabezadoPropinas();
    mostrarUltimasPropinas(JSON.parse(localStorage.getItem('propinas')));
  }
}

// Limpia el local storage permitiendo que la app tenga su html nativo
function limpiarStorage() {
  localStorage.removeItem('cliente');
  localStorage.removeItem('propinas');
}

// Suprime los ".00" de los números float
function sinCeros(num) {
  return Number(num).toFixed(2).replace(/\.0+$/, "");
}

// Determina que el valor ingresado sea numérico positivo
function validarNumero(valor) {
  if (isNaN(valor) || Number(valor) <= 0) {
    return false;
  } else {
    return true;
  }
}

// Determina que el valor ingresado sea numérico y entero positivo
function validarNumeroEntero(valor) {
  if (isNaN(valor) || Number(valor) <= 0 || !Number.isInteger(Number(valor))) {
    return false;
  } else {
    return true;
  }
}
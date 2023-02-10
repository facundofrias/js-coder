// Declaración de  clases

class Cliente {
  constructor(nombre, apellido, dni, propinas = []) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.propinas = propinas;
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

// Declaración variables
let textoBienvenida = document.getElementById("texto-bienvenida"),
    textoDatosPersonales = document.getElementById("texto-datos-personales"),
    porcentajePropina = document.getElementById("porcentaje-propina"),
    cantidadComensales = document.getElementById("cantidad-comensales"),
    btnSiguiente = document.getElementById("btn-mostrar-comensales"),
    contenedorPrincipal = document.getElementById("contenedor-principal"),
    datosRegistro = document.getElementById("registro-datos");

// Verifica la existencia de un cliente y en caso que exista, le da una bienvenida personalizada
// A su vez, verifica si tiene propinas asociadas y las muestra en una tabla
existeCliente();

// ----- EVENTOS -----

// Se dispara cuando se pretende completar datos
datosRegistro.addEventListener("click", mostrarDatosRegistro);

// Se dispara cuando se establecieron valores en campos de porcentaje propina y cantidad de comensales
btnSiguiente.addEventListener("click", generarComensales);


// ----- FUNCIONES -----

// ---- Registro de datos personales ----

// Muestra el div contenedor del formulario de datos personales
function mostrarDatosRegistro() {
  // document.getElementById("datos-personales").classList.remove("oculto");
  if (!document.getElementById("datos-personales")) {
    let formDatosPersonales = `
          <div class="datos-personales" id="datos-personales">
            <label class="field__title">Nombre/s:</label>
            <input class="field-datos" type="text" id="nombre">
            <label class="field__title">Apellido/s:</label>
            <input class="field-datos" type="text" id="apellido">
            <label class="field__title">DNI:</label>
            <input class="field-datos" type="text" id="dni">
            <button class="btn-registro" id="btn-registro">Registrarse</button>
          </div>
          `;
          
    textoDatosPersonales.insertAdjacentHTML("afterend", formDatosPersonales);
    // Se dispara cuando se pretende efectuar registro de cliente
    document.getElementById("btn-registro").addEventListener("click", validarRegistro);
  }
    document.getElementById("nombre").focus();
}   

// Valida que los datos ingresados en el formulario de registro sean válidos
function validarRegistro() {
  const nombre = document.getElementById("nombre").value,
        apellido = document.getElementById("apellido").value,
        dni = document.getElementById("dni").value;

  if ((nombre !== '') && (apellido !== '') && (validarNumeroEntero(dni))) {
    almacenarCliente(nombre, apellido, dni);
  } else {
    alert("¡Datos personales erróneos o incompletos!");
  }
}

// Almacena cliente
function almacenarCliente(nombre, apellido, dni) {
  if (document.getElementById("btn-registro").textContent == "Cambiar") {
    limpiarStorage();
  } else {
    document.getElementById("btn-registro").textContent = "Cambiar"
  }
  borrarDatosClienteYPropinas();
  let cliente = new Cliente(nombre, apellido, dni);
  localStorage.setItem('cliente', JSON.stringify(cliente));
  textoBienvenida.textContent = `¡Te damos la bienvenida, ${cliente.nombre}!`;
  textoDatosPersonales.innerHTML = `¿No sos <strong>${cliente.nombre} ${cliente.apellido}</strong>? No te preocupes, podés <a id="registro-datos">cambiar</a> tus datos personales; o utilizar la app de manera anónima haciendo clic <a id="anonima">acá</a>.`;
  // Se dispara cuando se pretende completar datos
  document.getElementById("registro-datos").addEventListener("click", mostrarDatosRegistro);
  generarEventoBorrarHistorialYPropinas();
}

// Completa los datos del cliente en el formulario 
// Reemplaza el texto del botón de registro por "Cambiar"
// Reemplaza el texto de bienvenida a la app
function completarDatosCliente() {
  let c = JSON.parse(localStorage.getItem('cliente'));
  document.getElementById("texto-bienvenida").textContent = `¡Te damos la bienvenida nuevamente, ${c.nombre}!`;
  textoDatosPersonales.innerHTML = `¿No sos <strong>${c.nombre} ${c.apellido}</strong>? No te preocupes, podés <a id="registro-datos">cambiar</a> tus datos personales; o utilizar la app de manera anónima haciendo clic <a id="anonima">acá</a>.`;
  
  // Se dispara cuando se pretende completar datos
  document.getElementById("registro-datos").addEventListener("click", mostrarDatosRegistro);
  generarEventoBorrarHistorialYPropinas();
}


// ---- Propina ----

// Valida los campos "Porcentaje propina" y "Cantidad de comensales" y muestra los inputs correspondientes a cantidad de comensales
function validarCamposPropina() {
  if (!validarNumero(porcentajePropina.value)) {
    alert("¡El valor ingresado en porcentaje de propina es inválido!");
  }

  if (!validarNumeroEntero(cantidadComensales.value)) {
    alert("¡El valor ingresado en Cantidad de comensales es inválido!");
  }
}

// Genera los inputs correspondientes a la cantidad de comensales
function generarComensales() {
  validarCamposPropina();
  if (validarNumero(porcentajePropina.value) && validarNumeroEntero(cantidadComensales.value)) {
    
    // Declaración de variables
    const contenedorCalculoPropina = document.createElement("div"),
        tituloMontosComensales = document.createElement("h3"),
        montos = document.createElement("div"),
        btnCalcularPropina = document.createElement("button"),
        btnNuevaPropina = document.createElement("button");
        
  limpiarPropina();
  
  // Agrega propiedades a variables creadas
  contenedorCalculoPropina.id = "contenedor-calculo-propina";
  contenedorPrincipal.appendChild(contenedorCalculoPropina);

  tituloMontosComensales.textContent = "Montos comensales:";
  tituloMontosComensales.id = "titulo-montos";
  contenedorCalculoPropina.appendChild(tituloMontosComensales);
  
  montos.classList.add("montos");
  montos.id = "montos";
  contenedorCalculoPropina.appendChild(montos);
  
  // Crea y muestra los campos de los comensales
  for (let i = 0; i < cantidadComensales.value; i++) {
    let field = `
        <div class="field">
          <label class="field__title" for="name">Comensal ${i + 1}:</label>
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
  btnCalcularPropina.classList.add("btns-calculo-propina");
  contenedorCalculoPropina.appendChild(btnCalcularPropina);

  // Evento que se dispara cuando se pretende calcular la propina (click en botón "Calcula propina")
  btnCalcularPropina.addEventListener("click", validarMontosComensales);

  // Agrega botón "Nueva propina"
  btnNuevaPropina.textContent = "Nueva propina";
  btnNuevaPropina.classList.add("btns-calculo-propina");
  btnNuevaPropina.id = "btn-nueva-propina";
  contenedorCalculoPropina.appendChild(btnNuevaPropina);
  
  // Evento que se dispara cuando se pretende ingresar nueva propina
  btnNuevaPropina.addEventListener("click", borrarDatosPropina);

  // Genera y muestra información de totales a pagar
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
}

// Valida el correcto ingreso de los montos de cada comensal
function validarMontosComensales() {
  let montosComensales = document.getElementsByClassName("field"),
      nombresDatosInvalidos = [],
      montosErroneos = `Existen datos erróneos, estos se encuentran en:\n`;

  if (montosComensales.length == document.getElementById("cantidad-comensales").value) {
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
  } else {
    alert("Error! La cantidad de comensales ingresada no coincide con la cantidad de campos generados.");
  }
}

// Calcula el monto total a pagar y la propina total
function calcularMontoTotalYPropina() {
  const propina = new Propina();
  let propinaComensal = 0,
      montoComensalHTML,
      montosComensalesHTML = document.getElementsByClassName("monto-propinas");
  propina.fecha = propina.formatearFecha();
  propina.cantidadPersonas = parseInt(cantidadComensales.value);
  propina.porcentajePropina = parseFloat(porcentajePropina.value);
  for (let i = 0; i < montosComensalesHTML.length; i++) {
    montoComensalHTML = parseFloat(montosComensalesHTML[i].value)
    propina.totalCuenta = parseFloat(propina.totalCuenta) + montoComensalHTML;
    // propinaComensal = montoComensalHTML / propina.porcentajePropina;
    propinaComensal = sinCeros(montoComensalHTML * propina.porcentajePropina / 100);
    propina.montosComensales[i] = montoComensalHTML;
    montosComensalesHTML[i].nextElementSibling.textContent = `Propina: $${propinaComensal}`;
  }
  propina.totalPropina = sinCeros(propina.totalCuenta * (propina.porcentajePropina / 100));
  document.getElementById("monto-total").textContent = `Monto total a pagar: $${propina.totalCuenta}`;
  document.getElementById("propina-total").textContent = `Propina total: $${propina.totalPropina}`;
  
  // Llamado a la función que muestra el historial de propinas
  almacenarPropina(propina);
}

// Almacena propina asociada a cliente
function almacenarPropina(propina) {
  if (localStorage.getItem('cliente') !== null) {
    let cliente = JSON.parse(localStorage.getItem('cliente')),
        propinas = [];
    if(localStorage.getItem("propinas") !== null) {    
      propinas = JSON.parse(localStorage.getItem('propinas')); 
      }
    propinas.push(propina);
    localStorage.setItem("propinas", JSON.stringify(propinas));
    propinas = JSON.parse(localStorage.getItem('propinas'));
    
    // Almacena las propinas en Cliente y luego lo guarda en localStorage 
    cliente.propinas.push(propina);
    localStorage.setItem("cliente", JSON.stringify(cliente));
    
    // Si la cantidad de propinas almacenadas es igual a 5, borra la útima
    if(propinas.length == 1) {
      generarTituloYEncabezadoPropinas();
    }
    if(propinas.length > 5) {
      propinas.shift();
      localStorage.setItem("propinas", JSON.stringify(propinas));
    }
    mostrarUltimasPropinas(propinas);
  }
}

// Genera el título y encabezado del historial de propinas
function generarTituloYEncabezadoPropinas() {
  let historialPropinasHTML = `
        <h4 id="titulo-historial-propinas">Historial - Te mostramos tus últimas 5 propinas</h4> 
      `,
      tableHTML = `
          <table class="historial-propinas" id="tabla-propinas">
            <tr id="encabezado-propinas">
              <th>Fecha</th>
              <th>Cant. comensales</th>
              <th>Monto total</th>
              <th>% propina</th>
              <th>Total propina</th>
            </tr>
          </table>
        `,
  textoBienvenida = document.getElementById("texto-bienvenida");
  textoBienvenida.insertAdjacentHTML("afterend", historialPropinasHTML);
  historialPropinasHTML = document.getElementById("titulo-historial-propinas");
  historialPropinasHTML.insertAdjacentHTML("afterend", tableHTML);
}

// Muestra las últimas 5 propinas del cliente registrado
function mostrarUltimasPropinas(propinas) {
  propinas.reverse(propinas.fecha);
  limpiarListaHistorialPropinas();
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

// Limpia el html dedicado a calcular propina
function limpiarPropina() {
  if(document.getElementById("contenedor-calculo-propina")) {
    document.getElementById("contenedor-calculo-propina").remove();
  }
}

// Borra datos de propina ingresada
function borrarDatosPropina() {
  if(document.getElementById("contenedor-calculo-propina")) {
    document.getElementById("contenedor-calculo-propina").remove();
    limpiarCamposPropina();
  }
}

// Limpia todas las filas en el historial de propinas
function limpiarListaHistorialPropinas() {
  document.querySelectorAll('.datos-propinas').forEach(elemento => {
    elemento.remove();
  });
}

function limpiarCamposPropina() {
  porcentajePropina.value = "";
  cantidadComensales.value = "";
  porcentajePropina.focus();
}

// Borra storage de Cliente y Propinas y recarga la página para cargar el contenido HTML por defecto
function borrarDatosClienteYPropinas() {
  limpiarStorage();
  borrarHistorialPropinas();
  borrarDatosPropina();
  refrescar();
  limpiarCamposPropina();

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

function refrescar() {
  textoBienvenida.textContent = "¡Te damos la bienvenida!";
  textoDatosPersonales.innerHTML = `<strong>* Opcional:</strong> podés <a id="registro-datos">registrar</a> tus datos, así recordaremos tus últimas 5 propinas calculadas.`;

  if(document.getElementById("datos-personales")) {
    document.getElementById("datos-personales").remove();
  }

  // Se dispara cuando se pretende completar datos
  document.getElementById("registro-datos").addEventListener("click", mostrarDatosRegistro);
}


// Suprime los ".00" de los números float
function sinCeros(num) {
  return Number(num).toFixed(2).replace(/\.0+$/, "");
}

// Determina que el valor ingresado sea numérico positivo
function validarNumero(valor) {
  valor = Number(valor);
  if (isNaN(valor) || valor <= 0) {
    return false;
  } else {
    return true;
  }
}

// Determina que el valor ingresado sea numérico y entero positivo
function validarNumeroEntero(valor) {
  valor = Number(valor);
  if (isNaN(valor) || valor <= 0 || !Number.isInteger(valor)) {
    return false;
  } else {
    return true;
  }
}
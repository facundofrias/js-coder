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
    fecha,
    porcentajePropina,
    cantidadPersonas,
    totalPropina = 0,
    totalCuenta = 0,
    montosComensales = []
  ) {
    this.fecha = fecha;
    this.porcentajePropina = porcentajePropina;
    this.cantidadPersonas = cantidadPersonas;
    this.totalPropina = totalPropina;
    this.totalCuenta = totalCuenta;
    this.montosComensales = montosComensales;
  }

  // Métodos

  // Formatea la fecha
  formatearFecha() {
    this.fecha = new Date();
    let yyyy = this.fecha.getFullYear(),
        mm = this.fecha.getMonth() + 1,
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
    datosRegistro = document.getElementById("registro-datos"),
    clientes = [];

// Verifica si existen clientes
const existenClientes = async () => {
  const resp = await fetch('clientes.json');
  const data = await resp.json();
  if(data.length > 0) {
    clientes = [];
    await data.forEach( (element) => {
      clientes.push(element);
    });
    cambiarTextoDatosPersonales();
  }
}

// Verifica la existencia de un cliente y en caso que exista, le da una bienvenida personalizada
// A su vez, verifica si tiene propinas asociadas y las muestra en una tabla
existeCliente();

let propina = new Propina();
// ----- EVENTOS -----

// Se dispara cuando se pretende completar datos
datosRegistro.addEventListener("click", mostrarDatosRegistro);

// Se dispara cuando se establecieron valores en campos de porcentaje propina y cantidad de comensales
btnSiguiente.addEventListener("click", generarComensales);


// ----- FUNCIONES -----

// ---- Clientes ----

function cargarListaClientes() {
  if(document.getElementById("datos-personales")) {
    document.getElementById("datos-personales").remove();
  }
  borrarTablaClientes();
  let tablaClientesHTML = `
      <table class="tabla-clientes" id="tabla-clientes">
        <tr class="encabezado-tabla">
          <th>Nombre</th>
          <th>Apellido</th>
          <th>DNI</th>
          <th>Acciones</th>
          <th class="th-cerrar-tabla"><a class="btn-remover" id="btn-cerrar-tabla-clientes" title="Cerrar tabla"><i class="fa-solid fa-xmark"></i></a></th>          
        </tr>
      </table>
      `;
      textoDatosPersonales.insertAdjacentHTML("afterend", tablaClientesHTML);


  for (let i = 0; i < clientes.length; i++) {
    let trDatosClientes = document.createElement("tr");
        datos = `
                <td>${clientes[i].nombre}</td>
                <td>${clientes[i].apellido}</td>
                <td>${clientes[i].dni}</td>
                <td class="acciones">
                  <a class="btn-login" title="Cambiar cliente"><i class="fa-solid fa-right-to-bracket"></i></a>
                  <a class="btn-remover-cliente" title="Eliminar"><i class="fa-solid fa-user-xmark"></i></i></a>
                </td>                  
              `;
    trDatosClientes.classList.add("datos-clientes");
    trDatosClientes.innerHTML = datos;
    document.getElementById("tabla-clientes").appendChild(trDatosClientes);
  }
  document.getElementById("btn-cerrar-tabla-clientes").addEventListener("click", () => {
    removerElemento("btn-cerrar-tabla-clientes");
    removerElemento("tabla-clientes");
  });
  if (document.getElementById("tabla-clientes")) {
    document.getElementById("tabla-clientes").addEventListener("click", (event) => {
      let dni = event.target.parentElement.parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.textContent;
      if(event.target.parentElement.className == "btn-login") {
        cambiarCliente(dni);
      }
      if(event.target.parentElement.className == "btn-editar") {
        editarCliente(dni);
      }
      if(event.target.parentElement.className == "btn-remover-cliente") {
        removerCliente(dni);
        clientes.length > 0 ? cargarListaClientes() : removerElemento("tabla-clientes");
      }
    });
  }
}

// ---- Clientes - Registro de datos personales ----

// Muestra el div contenedor del formulario de datos personales
function mostrarDatosRegistro() {
  borrarTablaClientes();
  if (!document.getElementById("datos-personales")) {
    let formDatosPersonales = `
          <div class="datos-personales" id="datos-personales">
            <a class="btn-remover" id="btn-cerrar-registro" title="Cerrar formulario"><i class="fa-solid fa-xmark"></i></i></a>
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

    document.getElementById("btn-cerrar-registro").addEventListener("click", () => {
      removerElemento("datos-personales");
    });
}

function cambiarTextoDatosPersonales() {
  if(localStorage.getItem("clienteLogueado")) {
    let cliente = JSON.parse(localStorage.getItem("clienteLogueado"));
    completarDatosCliente(cliente);
  } else {
      textoDatosPersonales.innerHTML = `<strong>* Opcional:</strong> podés <a id="registro-datos">registrar</a> tus datos, recordaremos tus últimas 5 propinas calculadas.<br> ¿Ya sos cliente? Desplegá la <a id="lista-clientes">lista de clientes</a> y cargá tus datos.`;
  }


  let btnlistaClientes = document.getElementById("lista-clientes");
  datosRegistro = document.getElementById("registro-datos");

  // Se dispara cuando se quiere desplegar la lista de clientes
  btnlistaClientes.addEventListener("click", cargarListaClientes);

  // Se dispara cuando se pretende completar datos
  datosRegistro.addEventListener("click", mostrarDatosRegistro);
}

// Valida que los datos ingresados en el formulario de registro sean válidos
function validarRegistro() {
  const nombre = document.getElementById("nombre").value,
        apellido = document.getElementById("apellido").value,
        dni = document.getElementById("dni").value;

  if ((nombre !== '') && (apellido !== '') && (validarNumeroEntero(Number(dni)))) {
    almacenarCliente(nombre, apellido, dni);
  } else {
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: '¡Datos personales erróneos o incompletos!'
    });
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
  textoBienvenida.textContent = `¡Te damos la bienvenida, ${cliente.nombre}!`;
  textoDatosPersonales.innerHTML = `¿No sos <strong>${cliente.nombre} ${cliente.apellido}</strong>? No te preocupes, podés <a id="registro-datos">registrar</a> tus datos personales; o utilizar la app de manera anónima haciendo clic <a id="anonima">acá</a>.<br>¿Ya sos cliente? Desplegá la <a id="lista-clientes">lista de clientes</a> y cargá tus datos`;
  // Se dispara cuando se pretende completar datos
  document.getElementById("registro-datos").addEventListener("click", mostrarDatosRegistro);
  
  generarEventoBorrarHistorialYPropinas();
  
  // Se dispara cuando se quiere desplegar la lista de clientes
  document.getElementById("lista-clientes").addEventListener("click", cargarListaClientes);
  clientes.push(cliente);
  localStorage.setItem("clienteLogueado", JSON.stringify(cliente));
}

// Completa los datos del cliente en el formulario 
// Reemplaza el texto del botón de registro por "Cambiar"
// Reemplaza el texto de bienvenida a la app
function completarDatosCliente(c) {
  document.getElementById("texto-bienvenida").textContent = `¡Te damos la bienvenida nuevamente, ${c.nombre}!`;
  textoDatosPersonales.innerHTML = `¿No sos <strong>${c.nombre} ${c.apellido}</strong>? No te preocupes, podés <a id="registro-datos">registrar</a> tus datos personales; o utilizar la app de manera anónima haciendo clic <a id="anonima">acá</a>.<br>¿Ya sos cliente? Desplegá la <a id="lista-clientes">lista de clientes</a> y cargá tus datos`;
  
  // Se dispara cuando se pretende completar datos
  generarEventoBorrarHistorialYPropinas();

  // Se dispara cuando se quiere desplegar la lista de clientes
  document.getElementById("lista-clientes").addEventListener("click", cargarListaClientes);

  borrarTablaClientes();
  localStorage.setItem("clienteLogueado", JSON.stringify(c));
}

// Cambia cliente (inicio de sesión)
function cambiarCliente(dni) {
  if(document.getElementById("tabla-propinas")) {
    document.getElementById("tabla-propinas").remove();
    localStorage.removeItem("propinas");
  }
  completarDatosCliente(obtenerCliente(dni));
}

// Elimina cliente
function removerCliente(dni) {
  for (let i = 0; i < clientes.length; i++) {
    if(clientes[i].dni == dni) {
      clientes.splice(i,1);
      break;
    }
  }
}

// Borra la tabla de clientes en caso de estar desplegada
function borrarTablaClientes() {
  if(document.getElementById("tabla-clientes")) {
    document.getElementById("tabla-clientes").remove();
  }
}

function obtenerCliente(dni) {
  for (let i = 0; i < clientes.length; i++) {
    if(clientes[i].dni == dni) {
      return clientes[i];
    }
  }
}

// ---- Propina ----

// Valida los campos "Porcentaje propina" y "Cantidad de comensales" y muestra los inputs correspondientes a cantidad de comensales
function validarCamposPropina() {
  propina.porcentajePropina = parseFloat(porcentajePropina.value);
  propina.cantidadPersonas = parseInt(cantidadComensales.value);
  let valido = false;
  if (validarNumero(propina.porcentajePropina)) {
    valido = true;
  } else {
    valido = false;
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: '¡El valor ingresado en "Porcentaje de propina" es inválido!'
    });
  }
  if (!validarNumeroEntero(propina.cantidadPersonas)) {
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: '¡El valor ingresado en "Cantidad de comensales" es inválido!'
    })
    valido = false;
  }
  return valido;
}

// Genera los inputs correspondientes a la cantidad de comensales
function generarComensales() {
  if (validarCamposPropina()) {
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
  for (let i = 0; i < propina.cantidadPersonas; i++) {
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
      montosErroneos = `Existen datos erróneos, estos se encuentran en:<br/>`;

  if (montosComensales.length == document.getElementById("cantidad-comensales").value) {
    for (let i = 0; i < montosComensales.length; i++) {
      let valorIngresado = montosComensales[i].firstElementChild.nextElementSibling.value;
      if (!validarNumero(valorIngresado)) {
        nombresDatosInvalidos.push(montosComensales[i].firstElementChild.textContent.slice(0, -1));
      } 
    }
    
    for (let i = 0; i < nombresDatosInvalidos.length; i++) {
      montosErroneos = montosErroneos + `${nombresDatosInvalidos[i]}<br/>`;
    }
    if(montosErroneos !== `Existen datos erróneos, estos se encuentran en:<br/>`) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        html: montosErroneos
      });
    } else {
      calcularMontoTotalYPropina();
    }
  } else {
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: '¡La cantidad de comensales ingresada no coincide con la cantidad de campos generados!'
    });
  }
}

// Calcula el monto total a pagar y la propina total
function calcularMontoTotalYPropina() {
  propina.totalCuenta = 0;
  propina.totalPropina = 0;
  document.getElementById("btn-calcular-propina").remove();
  let propinaComensal = 0,
      montoComensalHTML,
      montosComensalesHTML = document.getElementsByClassName("monto-propinas");
  propina.fecha = propina.formatearFecha();
  for (let i = 0; i < montosComensalesHTML.length; i++) {
    montoComensalHTML = parseFloat(montosComensalesHTML[i].value)
    propina.totalCuenta = parseFloat(propina.totalCuenta) + montoComensalHTML;
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
  // Verifica si hay cliente logueado o si es propina anónima
  if (localStorage.getItem("clienteLogueado") !== null) {
    let cliente = JSON.parse(localStorage.getItem("clienteLogueado")),
        propinas = [];
    if(localStorage.getItem("propinas") !== null) {    
      propinas = JSON.parse(localStorage.getItem('propinas')); 
      }
    propinas.push(propina);
    localStorage.setItem("propinas", JSON.stringify(propinas));
    propinas = JSON.parse(localStorage.getItem('propinas'));
    
    // Almacena las propinas en Cliente y luego actualiza cliente actual en localStorage 
    cliente.propinas.push(propina);
    localStorage.setItem("clienteLogueado", JSON.stringify(cliente));
    
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
        <h4 id="titulo-historial-propinas">Tu historial de propinas (guardamos tus últimas 5 propinas)</h4> 
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
    vaciarCamposPropina();
    propina = new Propina();
  }
}

// Limpia todas las filas en el historial de propinas
function limpiarListaHistorialPropinas() {
  document.querySelectorAll('.datos-propinas').forEach(elemento => {
    elemento.remove();
  });
}

function vaciarCamposPropina() {
  porcentajePropina.value = "";
  cantidadComensales.value = "";
  cantidadComensales.focus();
}

// Borra storage de Cliente y Propinas y recarga la página para cargar el contenido HTML por defecto
function borrarDatosClienteYPropinas() {
  limpiarStorage();
  borrarHistorialPropinas();
  borrarDatosPropina();
  refrescar();
  borrarFormDatosPersonales();
  vaciarCamposPropina();
}

// Borra el form de datos personales
function borrarFormDatosPersonales(){
  if(document.getElementById("datos-personales")) {
    document.getElementById("datos-personales").remove();
  }
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
  if (localStorage.getItem("clienteLogueado") !== null) {
    completarDatosCliente(JSON.parse(localStorage.getItem("clienteLogueado")));
    existenPropinas();
  }
  existenClientes();
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
  localStorage.removeItem("clienteLogueado");
  localStorage.removeItem("propinas");
}

function refrescar() {
  textoBienvenida.textContent = "¡Te damos la bienvenida!";
  if(clientes.length > 0) {
    textoDatosPersonales.innerHTML = `<strong>* Opcional:</strong> podés <a id="registro-datos">registrar</a> tus datos, recordaremos tus últimas 5 propinas.<br> ¿Ya sos cliente? Desplegá la <a id="lista-clientes">lista de clientes</a> y cargá tus datos.`;
  } else {
    borrarTablaClientes();
    textoDatosPersonales.innerHTML = `<strong>* Opcional:</strong> podés <a id="registro-datos">registrar</a> tus datos, recordaremos tus últimas 5 propinas.`;
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
  return (!isNaN(valor) &&  Number(valor) > 0);
}

// Determina que el valor ingresado sea numérico y entero positivo
function validarNumeroEntero(valor) {
  return (!isNaN(Number(valor)) );
}

function removerElemento(id) {
  document.getElementById(id).remove();
}
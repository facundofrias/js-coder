// alert("¡Te damos la bienvenida a la Calculadora de propinas!");

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
    porcentajePropina,
    cantidadPersonas,
    totalPropina = 0,
    totalCuenta = 0,
    montosComensales
  ) {
    this.porcentajePropina = parseInt(porcentajePropina);
    this.cantidadPersonas = parseInt(cantidadPersonas);
    this.totalPropina = parseFloat(totalPropina);
    this.totalCuenta = parseFloat(totalCuenta);
    this.montosComensales = montosComensales;
  }

  // Métodos
  // Calcula el monto de propina que la persona debe poner
  calcularPropinaIndividual(montoPersona) {
    return Number(montoPersona * (this.porcentajePropina / 100)).toFixed(2);
  }

  // Calcula los montos totales de la cuenta y propina
  calcularPropinaTotalYCuenta() {
    let flag = false;
    for (let i = 0; i < this.montosComensales.length; i++) {
      let p = i + 1;
      this.montosComensales[i] = prompt(`Ingresar monto de persona ${p}:`);
      flag = validarNumero(this.montosComensales[i]);
      if (flag === false) {
        i--;
      } else {
        this.totalCuenta =
          Number(this.totalCuenta) + Number(this.montosComensales[i]);
        this.totalPropina =
          Number(this.totalPropina) +
          Number(this.calcularPropinaIndividual(this.montosComensales[i]));
        alert(
          `Monto persona ${p}: $ ${sinCeros(
            this.montosComensales[i]
          )} - Porcentaje propina: %${sinCeros(
            this.porcentajePropina
          )} - Propina: $ ${sinCeros(
            this.calcularPropinaIndividual(this.montosComensales[i])
          )}`
        );
      }
    }
  }
}

// MAIN

existeCliente();

// Declaración variables
const propina = new Propina(),
  porcentajePropina = document.getElementById("porcentaje-propina"),
  cantidadComensales = document.getElementById("cantidad-comensales"),
  btnSiguiente = document.getElementById("btn-mostrar-comensales"),
  contenedorPrincipal = document.getElementById("contenedor-principal")
  btnRegistro = document.getElementById("btn-registro");

// EVENTOS

// Se dispara cuando se establecieron valores en campos de porcentaje propina y cantidad de comensales
btnSiguiente.addEventListener("click", validarYGenerarCampos);

// Se dispara cuando se oretende efectuar registro de cliente
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
  let cliente = new Cliente(nombre, apellido, dni);
  localStorage.setItem('cliente', JSON.stringify(cliente));
  alert(`¡Te damos la bienvenida ${nombre}!`);
}

// FUNCIONES

// Verifica si existe cliente y completa los datos personales
function existeCliente() {
  if (localStorage.getItem('cliente') !== null) {
    completarDatosCliente();
  }
}

// Completa los datos del cliente en el formulario 
// Reemplaza el texto del botón de registro por "Cambiar"
// Reemplaza el texto de bienvenida a la app
function completarDatosCliente() {
  let c = JSON.parse(localStorage.getItem('cliente'));
  document.getElementById("nombre").value = c.nombre;
  document.getElementById("apellido").value = c.apellido;
  document.getElementById("dni").value = c.dni;
  
  document.getElementById("texto-bienvenida").textContent = `¡Te damos la bienvenida nuevamente, ${c.nombre}!`;
  document.getElementById("texto-datos-personales").innerHTML = `¿No sos <strong>${c.nombre} ${c.apellido}</strong>? No te preocupes, podés cambiar tus datos personales o utilizar la app de manera <a href="" id="anonima">anonima</a>.`;
  document.getElementById("btn-registro").textContent = "Cambiar";
  
  // Evento que se dispara cuando se hace clic sobre "anónima"
  const anonima = document.getElementById("anonima").addEventListener("click", limpiarStorage);
}

// Limpia el local storage permitiendo que la app tenga su html nativo
function limpiarStorage() {
  localStorage.removeItem('cliente');
  window.location.reload();
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
  const tituloMontosComensales = document.createElement("h3"),
        montos = document.createElement("div"),
        btnCalcularPropina = document.createElement("button");
  
  limpiarPropina();
  
  tituloMontosComensales.textContent = "Montos comensales:";
  tituloMontosComensales.id = "titulo-montos";
  contenedorPrincipal.appendChild(tituloMontosComensales);
  
  montos.classList.add("montos");
  montos.id = "montos";
  contenedorPrincipal.appendChild(montos);
  
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
  
  btnCalcularPropina.textContent = "Calcular propina";
  btnCalcularPropina.id = "btn-calcular-propina";
  contenedorPrincipal.appendChild(btnCalcularPropina);

  
// Evento que se dispara cuando se pretende calcular la propina (click en botón "Calcula propina")
btnCalcularPropina.addEventListener("click", validarMontosComensales);
  
  const totales = document.createElement("div");
  totales.classList.add("totales");
  totales.id = "totales";
  const textoTotales = `
    <span id="monto-total">Monto total a pagar:</span>
    <span id="propina-total">Monto total de propina:</span>
  `;
  totales.innerHTML = textoTotales;
  contenedorPrincipal.appendChild(totales);
}

// Funciones de utilidad

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

// Calcula el monto total a pagar y la propina tota
function calcularMontoTotalYPropina() {
  let propinaComensal;
  propina.montosComensales = document.getElementsByClassName("monto-propinas");
  propina.porcentajePropina = Number(porcentajePropina.value);
  for (let i = 0; i < propina.montosComensales.length; i++) {
    propina.totalCuenta = Number(propina.totalCuenta) + Number(propina.montosComensales[i].value);
    propinaComensal = Number(propina.montosComensales[i].value) / propina.porcentajePropina;
    propina.montosComensales[i].nextElementSibling.textContent = `Propina: $${propinaComensal}`;
  }
  propina.totalPropina = sinCeros(Number(propina.totalCuenta) / propina.porcentajePropina);
  document.getElementById("monto-total").textContent = `Monto total a pagar: $${propina.totalCuenta}`;
  document.getElementById("propina-total").textContent = `Propina total: $${propina.totalPropina}`;
}


// Limpia el html dedicado a calcular propina
function limpiarPropina() {
  if (document.getElementById("montos")) {
    contenedorPrincipal.removeChild(document.getElementById("titulo-montos"));
    contenedorPrincipal.removeChild(document.getElementById("montos"));
    contenedorPrincipal.removeChild(document.getElementById("btn-calcular-propina"));
    contenedorPrincipal.removeChild(document.getElementById("totales"));
  }
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

/*
do {

  // Declaración de objeto Propina
  let propina = new Propina,
      flag = false;

  while (flag === false) {
    propina.porcentajePropina = prompt("Ingresar porcentaje de propina.");
    flag = validarNumero(propina.porcentajePropina);
  }

  flag = false;
  while (flag === false) {
    let cantidadPersonas = prompt("Ingresar cantidad de comensales.");
    flag = validarNumeroEntero(cantidadPersonas);
    if (flag === true) {
      propina.montosComensales = new Array(Number(cantidadPersonas));
    }
  }

  propina.calcularPropinaTotalYCuenta();
  //alert(`Monto total: $${Number(propina.totalCuenta).toFixed(2)}  -  Propina total: $${Number(propina.totalPropina).toFixed(2)}`);


  alert(`Monto total: $${sinCeros(propina.totalCuenta)}\nPropina total: $${sinCeros(propina.totalPropina)}`);

  flag = false;
  salida = prompt(
    "Ingrese 1 si desea realizar un nuevo cálculo.\nIngrese 2 si desea salir."
  );
}  while (salida !== "2");



 */

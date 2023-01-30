// alert("¡Te damos la bienvenida a la Calculadora de propinas!");

// Declaración clase
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

// Main

// Declaración variables
const propina = new Propina(),
  porcentajePropina = document.getElementById("porcentaje-propina"),
  cantidadComensales = document.getElementById("cantidad-comensales"),
  btnSiguiente = document.getElementById("btn-mostrar-comensales");

// Eventos

// Se dispara cuando se establecieron valores en campos de porcentaje propina y cantidad de comensales
btnSiguiente.addEventListener("click", validarYGenerarCampos);

// FUNCIONES

// Valida los campos "Porcentaje propina" y "Cantidad de comensales" y muestra los inputs correspondientes a cantidad de comensales
function validarYGenerarCampos() {
  if (!validarNumero(porcentajePropina.value)) {
    alert("¡El valor ingresado en porcentaje de propina es inválido!");
  } else {
    if (!validarNumeroEntero(cantidadComensales.value)) {
      alert("¡El valor ingresado en Cantidad de comensales es inválido!");
    } else {
      generarComensales();
    }
  }
}

// Genera los inputs correspondientes a la cantidad de comensales
function generarComensales() {
  const contenedorPrincipal = document.getElementById("contenedor-principal"),
        montos = document.createElement("div"),
        btnCalcularPropina = document.createElement("button");
  let h3 = document.createElement("h3");
  h3.textContent = "Montos comensales:";
  contenedorPrincipal.appendChild(h3);
  montos.classList.add("montos");
  contenedorPrincipal.appendChild(montos);

  for (let i = 0; i < cantidadComensales.value; i++) {
    let field = `
        <div class="field">
          <label class="field__title" for="name">Persona ${i+1}:</label>
          <input class="field-input" type="number" name="comensales" id="name">
          <span class="propina">Propina:</span>
        </div>
        `;

    montos.innerHTML = montos.innerHTML + field;
  }

  btnCalcularPropina.textContent = "Calcular propina";
  contenedorPrincipal.appendChild(btnCalcularPropina);

  const totales = document.createElement("div");
  totales.classList.add("totales");
  const textoTotales = `
    <span id="monto-total">Monto total a pagar:</span>
    <span id="propina-total">Monto total de propina:</span>
  `;
  totales.innerHTML = textoTotales;
  contenedorPrincipal.appendChild(totales);

}

// Funciones de utilidad

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

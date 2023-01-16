alert("¡Te damos la bienvenida a la Calculadora de propinas!");

// Declaración clase
class Propina {
  constructor(porcentajePropina, cantidadPersonas, totalPropina = 0, totalCuenta = 0, montosComensales) {
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
    for (let i=0; i < this.montosComensales.length; i++) {
      let p = i+1;
      this.montosComensales[i] = prompt(`Ingresar monto de persona ${p}:`);
      flag = validarNumero(this.montosComensales[i]);
      if (flag === false) {
        i--;
      }
        else {
          this.totalCuenta = Number(this.totalCuenta) + Number(this.montosComensales[i]);
          this.totalPropina = Number(this.totalPropina) + Number(this.calcularPropinaIndividual(this.montosComensales[i]));
          alert(
            `Monto persona ${p}: $ ${Number(this.montosComensales[i]).toFixed(2)} - Porcentaje propina: %${Number(this.porcentajePropina).toFixed(2)} - Propina: $ ${this.calcularPropinaIndividual(this.montosComensales[i])}`
          );
        }
    }
  }
}

// Main
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
      propina.montosComensales = Array.apply( null, { length: cantidadPersonas } );
    }
  }

  propina.calcularPropinaTotalYCuenta();
  alert(`Monto total: $${Number(propina.totalCuenta).toFixed(2)}  -  Propina total: $${Number(propina.totalPropina).toFixed(2)}`);

  flag = false;
  salida = prompt(
    "Ingrese 1 si desea realizar un nuevo cálculo.\nIngrese 2 si desea salir."
  );
}  while (salida !== "2");


// Funciones

// Determina que el valor ingresado sea numérico positivo
function validarNumero(valor) {
  if (isNaN(valor) || Number(valor) <= 0) {
    alert("¡El valor ingresado es inválido!");
    return false;
  } else {
    return true;
  }
}

// Determina que el valor ingresado sea numérico y entero positivo
function validarNumeroEntero(valor) {
  if (isNaN(valor) || Number(valor) <= 0 || !Number.isInteger(Number(valor))) {
    alert("¡El valor ingresado es inválido!");
    return false;
  } else {
    return true;
  }
}

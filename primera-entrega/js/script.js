console.log("¡Te damos la bienvenida a la Calculadora de propinas!");

// Declaración de variables
let porcentajePropina,
    cantidadPersonas,
    totalPropina = 0,
    totalCuenta = 0,
    flag = false;

// Main
while(flag === false) {
  porcentajePropina = prompt("Ingresar porcentaje de propina.");
  flag = validarNumero(porcentajePropina);
}

flag = false;
while(flag === false) {
  cantidadPersonas = prompt("Ingresar cantidad de comensales.");
  flag = validarNumeroEntero(cantidadPersonas);
}

flag = false;
for(i=1; i<=cantidadPersonas; i++) {
  let montoPersona = prompt(`Ingresar monto de persona ${i}:`),
    flag = validarNumero(montoPersona);
  if(flag===false) {
    i--;
  } else {
    totalCuenta = Number(totalCuenta) + Number(montoPersona);
    totalPropina = Number(totalPropina) + Number(calcularPropina(montoPersona, porcentajePropina));
    alert(`Monto persona ${i}: ${montoPersona} - Porcentaje propina: ${porcentajePropina} - Propina: ${calcularPropina(montoPersona, porcentajePropina)}`);
  }
}

alert(`Monto total: ${totalCuenta}  -  Propina total: ${totalPropina}`);


// Funciones

// Determina que el valor ingresado sea numérico positivo
function validarNumero(valor) {
  if(isNaN(valor) || (Number(valor) <= 0)) {
    alert("¡El valor ingresado es inválido!");
    return false;
  } else {
    return true;
  }
}

// Determina que el valor ingresado sea numérico y entero positivo
function validarNumeroEntero(valor) {
  if(isNaN(valor) || (Number(valor) <= 0) || !Number.isInteger(Number(valor))) {
    alert("¡El valor ingresado es inválido!");
    return false;
  } else {
    return true;
  }
}

// Calcula el monto de propina que la persona debe poner
function calcularPropina(monto, porcentaje) {
  return (monto*(porcentaje/100));
}
console.log("¡Te damos la bienvenida a la Calculadora de propinas!");

let porcentajePropina,
    cantidadPersonas,
    totalPropina,
    totalCuenta,
    flag = false;



porcentajePropina = prompt("Ingresar porcentaje de propina.");


cantidadPersonas = prompt("Ingresar cantidad de comensales.");

for(i=1; i<=cantidadPersonas; i++) {
  let montoPersona = prompt(`Ingresar monto de persona ${i}:`),
    flag = validarNumero(montoPersona);
  if(flag===false) {
    i--;
  }
}

// Funciones
function validarNumero(monto) {
  if(isNaN(monto) || (Number(monto) <= 0)) {
    alert("¡El monto ingresado es inválido!");
    return false;
  } else {
    return true;
  }
}

function validarNumeroEntero(valor) {
  if(isNaN(valor) || (Number(valor) <= 0) || ) {
    alert("¡El valor ingresado es inválido!");
    return false;
  } else {
    return true;
  }
}
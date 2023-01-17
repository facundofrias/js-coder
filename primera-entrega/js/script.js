alert("¡Te damos la bienvenida a la Calculadora de propinas!");

do {
  // Declaración de variables
  let porcentajePropina,
      cantidadPersonas,
      totalPropina = 0,
      totalCuenta = 0,
      comensales,
      flag = false;

  // Main
  while (flag === false) {
    porcentajePropina = prompt("Ingresar porcentaje de propina.");
    flag = validarNumero(porcentajePropina);
  }

  flag = false;
  while (flag === false) {
    cantidadPersonas = prompt("Ingresar cantidad de comensales.");
    flag = validarNumeroEntero(cantidadPersonas);
    if (flag === true) {
      comensales = [cantidadPersonas]; 
    }
  }

  flag = false;
  for (i = 1; i <= cantidadPersonas; i++) {
    let montoPersona = prompt(`Ingresar monto de persona ${i}:`),
      flag = validarNumero(montoPersona);
    if (flag === false) {
      i--;
    } else {
      totalCuenta = Number(totalCuenta) + Number(montoPersona);
      alert(`Total cuenta: ${totalCuenta}`);
      totalPropina = Number(totalPropina) + Number(calcularPropina(montoPersona, porcentajePropina));
      alert(
        `Monto persona ${i}: ${Number(montoPersona).toFixed(2)} - Porcentaje propina: %${Number(porcentajePropina).toFixed(2)} - Propina: ${calcularPropina(montoPersona,porcentajePropina)}`
      );
    }
  }

  alert(`Monto total: ${Number(totalCuenta).toFixed(2)}  -  Propina total: ${Number(totalPropina).toFixed(2)}`);

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

// Calcula el monto de propina que la persona debe poner
function calcularPropina(monto, porcentaje) {
  return Number(monto * (porcentaje / 100)).toFixed(2);
}
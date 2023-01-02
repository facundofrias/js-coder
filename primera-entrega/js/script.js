console.log("¡Te damos la bienvenida a la sección de Talleres y Cursos de Reciclarg!");
console.log("Todos los talleres y cursos son gratuitos, pero necesitamos validar tu edad ya que son para mayores de dieciocho años.");
let edad,
    seleccion;
edad = prompt("Ingresar edad.");

while(Number(edad) < 18) {
  alert("La edad ingresada es menor a 18!");
  edad = prompt("Ingresar edad.");
}
alert("Edad validada.");

console.log("Lista de Talleres y Cursos, ingrese número correspondiente al que desee inscribirse:");
console.log("1- Arquitectura sustentable (Taller)\n2- Compostaje (Taller)\n3- Alimentación saludable (Taller)\n4- Paneles solares (Curso)\n5- Agroecología (Curso)\n6- Vivienda sustentable (Curso)\n7-Termotanques solares (Curso)");
seleccion = prompt("Ingresar selección:");

while((Number(seleccion) < 1) || (Number(seleccion) > 7)) {
  alert("Selección inválida");
  seleccion = prompt("Ingresar selección:");
}

switch(Number(seleccion)) {
  case 1:
    alert("Usted se ha inscrito al taller Arquitectura sustentable.");
    break;

  case 2:
    alert("Usted se ha inscrito al taller Compostaje.");
    break;

  case 3:
    alert("Usted se ha inscrito al taller Alimentación saludable.");
    break;

  case 4:
    alert("Usted se ha inscrito al curso Paneles solares.");
    break;

  case 5:
    alert("Usted se ha inscrito al curso Agroecología.");
    break;

  case 6:
    alert("Usted se ha inscrito al curso Vivienda sustentable.");
    break;
    
  case 7:
    alert("Usted se ha inscrito al curso Termotanques solares.");
    break;
}
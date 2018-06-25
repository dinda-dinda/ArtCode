Primer acercamiento a la interacción con P5 utilizando datos del Serial de Arduino con un sensor Ultrasonico.

P5ArduinoMix by Dinda Dinda 2018

paso 1- setear el max de distancia en el arduino especificado al lugar de proyeccion (siendo 100 un metro).
cargar en arduino la info actualizada y cerrar.
--Arduino debe estar prendido.
Pero el puerto disponible para que pueda ser leido por node.

paso 2- desde la consola correr el node startserver.js
Para que lea el puerto serie desde la consola 
p5.serialserver should be running !!!!!!!!!!!!!!!!!!!!!

Dinda@LAPTOP-blabla ~/Documents/Dinda/Programacion/P5/
P5ArduinoMix/node_modules/p5.serialserver
$ node startserver.js

Si la consola de Arduino esta prendida, el error sera que el puerto esta siendo utilizado. no pudiendo leer o correr node.


paso 3- abrir el html.
Ver que onda!!!

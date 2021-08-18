require("dotenv").config();

const {
  leerInput,
  inquirerMenu,
  pausa,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // mostrar mensaje
        const termino = await leerInput("Ciudad: ");
        // buscar la ciudad
        const lugares = await busquedas.ciudad(termino);

        //Seleccionar la ciudad
        const idSeleccionado = await listarLugares(lugares);
        if( idSeleccionado === '0') continue;

        const lugarSeleccionad = lugares.find((l) => l.id === idSeleccionado);
        // guardar en db
        busquedas.agregarHistorial(lugarSeleccionad.nombre);

        const { nombre, lng, lat } = lugarSeleccionad;

        // Clima
        const clima = await busquedas.climaLugar(lat, lng);
        const { desc, min, max, temp } = clima;

        // Mostrar resultados
        console.clear();
        console.log("\n Informacion de la ciudad \n".green);
        console.log("📍 Ciudad:", nombre);
        console.log("🧭 Lat:", lat);
        console.log("🧭 Lng:", lng);
        console.log("🌡️ Temperatura:", temp);
        console.log("🌡️⬇ Minima:", min);
        console.log("🌡️⬆ Maxima:", max);
        console.log("⛅ Estado del clima:", desc);

        break;

      case 2:
          busquedas.historialCapitalizado.forEach((lugar, i) => {
            const idx = `${i+1}`.green;
            console.log(`${idx} ${lugar}`);
          })
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();

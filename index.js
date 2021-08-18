require('dotenv').config()

const { leerInput, inquirerMenu, pausa } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
   
    const busquedas = new Busquedas();
    let opt;

    do {

        opt = await  inquirerMenu();
        
        switch( opt) {

            case 1:
                // mostrar mensaje
                const ciudad = await leerInput('Ciudad: ');

                await busquedas.ciudad(ciudad);


                // buscar la ciudad

                //Seleccionar la ciudad

                // Clima

                // Mostrar resultados


                console.log('\n Informacion de la ciudad \n'.green);

                console.log('Ciudad:',);
                console.log('Lat:',);
                console.log('Lng:',);
                console.log('Temperatura:',);
                console.log('Minima:',);
                console.log('Maxima:',);
            break;
        }
        
        
        if( opt !== 0 ) await pausa();

       

    } while ( opt !== 0 )
};


main(); 

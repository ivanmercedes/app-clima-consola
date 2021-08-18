const axios = require("axios");

class Busquedas {
  historial = ["Haiti", "Madrid", "Punta Cana"];

  constructor() {
    // Todo:  leer db si existe
  }

  get paramsMapbox(){
      return {
        access_token : process.env.MAPBOX_KEY || '',
        limit: 5,
        language: 'es'  
       }
  }
  async ciudad(ciudad = "") {
    // peticion http
    // console.log(ciudad);

    try {
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
        params: this.paramsMapbox
      });

      // const rep = await axios.get('https://reqres.in/api/users');
      const resp = await intance.get();
      
      console.log(resp.data);

      return []; // retornar las ciudades
    } catch (error) {
      return [];
    }
  }
}

module.exports = Busquedas;

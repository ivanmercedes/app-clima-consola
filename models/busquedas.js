const axios = require("axios");

class Busquedas {
  historial = ["Haiti", "Madrid", "Punta Cana"];

  constructor() {
    // Todo:  leer db si existe
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY || "",
      limit: 5,
      language: "es",
    };
  }

  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      lat: this.lat,
      lon: this.lon,
      units: "metric",
      lang: "es",
    };
  }

  //   set paramsOpenWeather(lat, lon){
  //         this.lat = lat;
  //         this.lon = lon;
  //   }

  async ciudad(ciudad = "") {
    // peticion http
    // console.log(ciudad);

    try {
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
        params: this.paramsMapbox,
      });

      // const rep = await axios.get('https://reqres.in/api/users');
      const resp = await intance.get();

      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async climaLugar(lat, lon) {
    try {
      this.lat = lat;
      this.lon = lon;

      // intance axios.create
      const intance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: this.paramsOpenWeather,
      });
      // resp.data
      const resp = await intance.get();
      const { description } = resp.data.weather[0];
      const { temp, temp_min, temp_max } = resp.data.main;

      return {
        desc: description,
        min: temp_min,
        max: temp_max,
        temp: temp,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Busquedas;

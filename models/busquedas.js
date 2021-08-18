const fs = require("fs");
const axios = require("axios");

class Busquedas {
  historial = [];
  pdbPath = "./db/database.json";

  constructor() {
    // Todo:  leer db si existe
    this.leerDB();
  }

  get historialCapitalizado(){
    return this.historial.map(lugar =>{
        let palabras = lugar.split(' ');
        palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

        return palabras.join(' ');
    })
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
    this.lat = lat;
    this.lon = lon;
    try {
      // intance axios.create
      const intance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: this.paramsOpenWeather,
        // params: {...this.paramsOpenWeather, lat, lon},
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

  agregarHistorial(lugar = "") {
    //TODO: prevenir duplicado
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }

    this.historial.unshift(lugar.toLocaleLowerCase());

    // Grabar en DB
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.pdbPath, JSON.stringify(payload));
  }

  leerDB() {
    // verificar si existe
    if (!fs.existsSync(this.pdbPath)) return;

    // leer
    const info = fs.readFileSync(this.pdbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.historial = data.historial;
  }
}

module.exports = Busquedas;

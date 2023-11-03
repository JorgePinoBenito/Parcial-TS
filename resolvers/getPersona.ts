import { Request, Response } from "npm:express@4.18.2";
import PersonaModel from "../db/persona.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { load } from "https://deno.land/std@0.202.0/dotenv/mod.ts";
import { PersonaModelType } from "../db/persona.ts";
import { Persona } from "../types.ts";
const env = await load();

const getContactos = async (req: Request, res: Response) => {
  try {
    const contactos = await PersonaModel.find().exec();
    const auxiliar: Persona[] = contactos;
    const solonombreydni = auxiliar.map((c) => {
      return {
        nombre: c.nombre,
        dni: c.dni,
      };
    });
    res.status(200).send({ solonombreydni });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

const getContactoByDNI = async (req: Request, res: Response) => {
  try {
    const { dni } = req.params;

    const contacto = await PersonaModel.findOne({ dni }).exec();
    if (!contacto) {
      res.status(404).send("Contacto not found");
      return;
    }

    const codigopostal = contacto.codigopostal;
    const codigoiso = contacto.codigoiso;

    const BASE_URL1 = "https://zip-api.eu/api/v1";
    const url1 = `${BASE_URL1}/codes/?postal_code=${codigoiso}-${codigopostal}`;
    const response1 = await fetch(url1);
    if (response1.status !== 200) {
      throw new Error("Cannot fetch location");
    }

    const data1 = await response1.json();

    const BASE_URL2 = "https://zip-api.eu/api/v1";
    const url2 = `${BASE_URL2}/codes/?state=${codigoiso}-${data1.state}`;
    const response2 = await fetch(url2);
    if (response2.status !== 200) {
      throw new Error("Cannot fetch location");
    }

    const data2 = await response2.json();

    /*const BASE_URL3 = "http://worldtimeapi.org";
    const url3 = `${BASE_URL3}/api/timezone/?country_code=${codigoiso}-${codigopostal}`;
    // http://worldtimeapi.org/api/timezone/Europe
    const response3 = await fetch(url3);
    if (response3.status !== 200) {
      throw new Error("Cannot fetch location");
    }

    const data3 = await response2.json();

    const BASE_URL4 = "http://api.weatherapi.com/v1";
    const WEATHERAPI_API_KEY =
      env["WEATHERAPI_API_KEY"] || Deno.env.get("WEATHERAPI_API_KEY");
    if (!WEATHERAPI_API_KEY) {
      throw new Error("WEATHERAPI_API_KEY is not defined");
    }

    const url4 = `${BASE_URL4}/current.json?key=${WEATHERAPI_API_KEY}&q=${location.city}`;
    const response4 = await fetch(url4);
    if (response4.status !== 200) {
      throw new Error("Cannot fetch weather");
    }
    const data4 = await response4.json();*/

    res.status(200).send({
      dni: contacto.dni,
      name: contacto.nombre,
      apellidos: contacto.apellidos,
      email: contacto.email,
      codigopostal: contacto.codigopostal,
      ciudadvive: data1.state,
      paisvive: data2.state,
      //horapais:
      //meteorologia:
    });
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export { getContactos, getContactoByDNI };

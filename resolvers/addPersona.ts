import { Request, Response } from "npm:express@4.18.2";
import PersonaModel from "../db/persona.ts";

const addPersona = async (req: Request, res: Response) => {
  try {
    const { dni, nombre, apellidos, email, codigopostal, codigoiso } = req.body;
    if (
      !dni ||
      !nombre ||
      !apellidos ||
      !email ||
      !codigopostal ||
      !codigoiso
    ) {
      res.status(500).send("Missing data");
      return;
    }

    if (
      typeof dni !== "string" ||
      typeof nombre !== "string" ||
      typeof apellidos !== "string" ||
      typeof email !== "string" ||
      typeof codigopostal !== "string" ||
      typeof codigoiso !== "string"
    ) {
      res.status(500).send("Wrong data type");
      return;
    }

    const alreadyExists = await PersonaModel.findOne({ dni }).exec();
    if (alreadyExists) {
      res.status(400).send("Persona already exists");
      return;
    }

    const newPersona = new PersonaModel({
      dni,
      nombre,
      apellidos,
      email,
      codigopostal,
      codigoiso,
    });
    await newPersona.save();

    res.status(200).send({
      dni: newPersona.dni,
      nombre: newPersona.nombre,
      apellidos: newPersona.apellidos,
      email: newPersona.email,
      codigopostal: newPersona.codigopostal,
      codigoiso: newPersona.codigoiso,
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addPersona;

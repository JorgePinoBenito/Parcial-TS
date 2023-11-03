import { Request, Response } from "npm:express@4.18.2";
import PersonaModel from "../db/persona.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

const updatePersona = async (req: Request, res: Response) => {
  try {
    const { dni } = req.params;
    const { nombre, apellidos, email, codigopostal, codigoiso } = req.body;

    const updatedPersona = await PersonaModel.findOneAndUpdate(
      { dni },
      { nombre, apellidos, email, codigopostal, codigoiso },
      { new: true }
    ).exec();

    if (!updatedPersona) {
      res.status(404).send("Persona not found");
      return;
    }

    res.status(200).send({
      dni: updatedPersona.dni,
      nombre: updatedPersona.nombre,
      apellidos: updatedPersona.apellidos,
      email: updatedPersona.email,
      codigopostal: updatedPersona.codigopostal,
      codigoiso: updatedPersona.codigoiso,
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default updatePersona;

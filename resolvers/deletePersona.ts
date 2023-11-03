import { Request, Response } from "npm:express@4.18.2";
import PersonaModel from "../db/persona.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

const deletePersona = async (req: Request, res: Response) => {
  try {
    const { dni } = req.params;
    const contacto = await PersonaModel.findOneAndDelete({ dni }).exec();
    if (!contacto) {
      res.status(404).send("Persona not found");
      return;
    }
    res.status(200).send("Persona deleted");
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deletePersona;

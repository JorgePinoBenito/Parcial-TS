import mongoose from "npm:mongoose@7.6.3";
import { Persona } from "../types.ts";

const Schema = mongoose.Schema;

const PersonaSchema = new Schema(
  {
    dni: { type: String, required: true },
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true },
    codigopostal: { type: String, required: true },
    codigoiso: { type: String, required: true },
  },
  { timestamps: true }
);

export type PersonaModelType = Persona & mongoose.Document;

export default mongoose.model<PersonaModelType>("personas", PersonaSchema);

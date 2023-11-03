import express from "npm:express@4.18.2";
import mongoose from "npm:mongoose@7.6.3";

import { getContactos, getContactoByDNI } from "./resolvers/getPersona.ts";
import addPersona from "./resolvers/addPersona.ts";
import updatePersona from "./resolvers/updatePersona.ts";
import deletePersona from "./resolvers/deletePersona.ts";

import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
const env = await load();

const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.log("No mongo URL found");
  Deno.exit(1);
}

await mongoose.connect(MONGO_URL);
const app = express();
app.use(express.json());
app
  .get("/api/contactos", getContactos)
  .get("/api/contactos/:dni", getContactoByDNI)
  .post("/api/contactos", addPersona)
  .put("/api/contactos/:dni", updatePersona)
  .delete("/api/contactos/:dni", deletePersona);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

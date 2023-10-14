import express from "express";
import patientsService from "../services/patientsService";
import { toNewEntry } from "../utils";

const router = express.Router();

router.get("/", (_request, response) => {
  response.send(patientsService.getEntries());
});

router.get("/:id", (request, response) => {
  const id = request.params.id;
  const patient = patientsService.getEntry(id);
  if (!patient) {
    response.status(400).send("Something went wrong. Error: patient not found");
  } else {
    response.json(patient);
  }
});

router.post("/", (request, response) => {
  const addedEntry = patientsService.addPatient(request.body);
  response.json(addedEntry);
});

router.post("/:id/entries", (request, response) => {
  try {
    const id = request.params.id;
    const newEntry = toNewEntry(request.body);
    const addedEntry = patientsService.addEntry(id, newEntry);
    response.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    response.status(400).send(errorMessage);
  }
});

export default router;

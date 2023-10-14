import { v1 as uuid } from "uuid";

import patients from "../../data/patients";
import {
  Entry,
  NewEntry,
  NewPatientEntry,
  NonSensitivePatient,
  Patient,
} from "../types";

const getEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getEntry = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addPatient = (entry: NewPatientEntry) => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (patientId: string, entry: NewEntry): Entry => {
  const id = uuid();
  const newEntry = {
    id,
    ...entry,
  };
  const patient = patients.find((patient) => patient.id === patientId);
  patient?.entries?.push(newEntry);
  return newEntry;
};

export default {
  getEntries,
  addPatient,
  getEntry,
  addEntry,
};

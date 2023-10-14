import { useParams } from "react-router-dom";
import { Diagnosis, Entry, EntryFormValues, Patient } from "../../types";
import HospitalEntry from "./HospitalEntry";
import HealthCheck from "./HealthCheckEntry";
import OccupationalHealthcare from "./OccupationalHealthcareEntry";
import { useEffect, useState } from "react";

import patientService from "../../services/patients";
import EntryForm from "./EntryForm";

const PatientPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const [patient, setPatient] = useState<Patient>();
  const id = useParams().id;

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const patient = await patientService.getOne(id);
        setPatient(patient);
      }
    };
    void fetchPatient();
  }, []);

  if (!patient) {
    return;
  }

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const entry = await patientService.addEntry(values, patient.id);
      setPatient({
        ...patient,
        entries: patient.entries ? [...patient.entries, entry] : [entry],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case "Hospital":
        return (
          <HospitalEntry key={entry.id} entry={entry} diagnoses={diagnoses} />
        );
      case "OccupationalHealthcare":
        return (
          <OccupationalHealthcare
            key={entry.id}
            entry={entry}
            diagnoses={diagnoses}
          />
        );

      case "HealthCheck":
        return (
          <HealthCheck key={entry.id} entry={entry} diagnoses={diagnoses} />
        );
      default:
        return assertNever(entry);
    }
  };

  const entriesList = patient.entries
    ? patient.entries.map((entry: Entry) => EntryDetails({ entry }))
    : null;

  return (
    <>
      <h2>
        {patient.name} {patient.gender}
      </h2>
      <p>
        ssh: {patient.ssn} <br /> occupation: {patient.occupation}
      </p>
      <EntryForm submit={submitNewEntry} diagnoses={diagnoses} />
      <h3>entries</h3>
      {entriesList}
    </>
  );
};

export default PatientPage;

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

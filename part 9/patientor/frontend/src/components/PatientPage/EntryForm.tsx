import {
  Button,
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Diagnosis, EntryFormValues } from "../../types";

interface Props {
  submit: (values: EntryFormValues) => void;
  diagnoses: Diagnosis[];
}

const EntryForm = ({ submit, diagnoses }: Props) => {
  const [show, setShow] = useState(false);
  const [type, setType] = useState("HealthCheck");
  // Base
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  // Hospital
  const [dischargeDate, setDischargeDate] = useState("");
  const [criteria, setCriteria] = useState("");
  // Health check
  const [healthCheckRating, setHealthCheckRating] = useState(0);
  // Occupational healthcare
  const [employerName, setEmployerName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const style = {
    borderStyle: "dotted",
    padding: "10px",
    marginBottom: "10px",
  };

  const handleCancel = () => {
    setShow(false);
    setDescription("");
    setDate("");
    setSpecialist("");
    setDiagnosisCodes([]);
    setDischargeDate("");
    setCriteria("");
    setHealthCheckRating(0);
    setEmployerName("");
    setStartDate("");
    setEndDate("");
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    if (type === "HealthCheck") {
      submit({
        description,
        date,
        specialist,
        diagnosisCodes,
        type,
        healthCheckRating,
      });
    } else if (type === "Hospital") {
      submit({
        description,
        date,
        specialist,
        diagnosisCodes,
        type,
        discharge:
          dischargeDate === "" || criteria === ""
            ? undefined
            : { date: dischargeDate, criteria },
      });
    } else if (type === "OccupationalHealthcare") {
      submit({
        description,
        date,
        specialist,
        diagnosisCodes,
        type,
        employerName,
        sickLeave:
          startDate === "" || endDate === ""
            ? undefined
            : { startDate, endDate },
      });
    }

    setDescription("");
    setDate("");
    setSpecialist("");
    setDiagnosisCodes([]);
    setDischargeDate("");
    setCriteria("");
    setHealthCheckRating(0);
    setEmployerName("");
    setStartDate("");
    setEndDate("");
  };

  const handleDiagnosisCodesChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target as unknown as { value: string[] };
    setDiagnosisCodes(value);
  };

  const FormFields: React.FC<{ type: string }> = ({ type }) => {
    switch (type) {
      case "Hospital":
        return (
          <div>
            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel shrink>Discharge</InputLabel>
              <Input
                type="date"
                value={dischargeDate}
                onChange={({ target }) => setDischargeDate(target.value)}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 1 }}>
              <TextField
                label="Criteria"
                value={criteria}
                onChange={({ target }) => setCriteria(target.value)}
              />
            </FormControl>
          </div>
        );
      case "HealthCheck":
        return (
          <div>
            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel id="rating">Health check rating</InputLabel>
              <Select
                labelId="rating"
                label="Health check rating"
                value={healthCheckRating}
                onChange={(event) =>
                  setHealthCheckRating(Number(event.target.value))
                }>
                <MenuItem value={0}>Healthy</MenuItem>
                <MenuItem value={1}>Low risk</MenuItem>
                <MenuItem value={2}>High risk</MenuItem>
                <MenuItem value={3}>Critical risk</MenuItem>
              </Select>
            </FormControl>
          </div>
        );
      case "OccupationalHealthcare":
        return (
          <div>
            {" "}
            <FormControl fullWidth sx={{ mb: 1 }}>
              <TextField
                label="Employer name"
                value={employerName}
                onChange={({ target }) => setEmployerName(target.value)}
                sx={{ mb: 1 }}
              />
            </FormControl>
            <FormGroup>
              <InputLabel sx={{ mb: 1 }}>Sickleave</InputLabel>
              <FormControl sx={{ mb: 1, ml: 1 }}>
                <InputLabel shrink>Start</InputLabel>
                <Input
                  type="date"
                  value={startDate}
                  onChange={({ target }) => setStartDate(target.value)}
                />
              </FormControl>
              <FormControl sx={{ mb: 1, ml: 1 }}>
                <InputLabel shrink>End</InputLabel>
                <Input
                  type="date"
                  value={endDate}
                  onChange={({ target }) => setEndDate(target.value)}
                />
              </FormControl>
            </FormGroup>
          </div>
        );
      default:
        return assertNever(type);
    }
  };
  return (
    <div>
      {!show && (
        <Button onClick={() => setShow(true)} variant="contained">
          ADD NEW ENTRY
        </Button>
      )}
      {show && (
        <form style={style} onSubmit={addEntry}>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id="type">Type</InputLabel>
            <Select
              labelId="type"
              value={type}
              onChange={(event) => setType(event.target.value)}>
              <MenuItem value={"HealthCheck"}>Health Check</MenuItem>
              <MenuItem value={"Hospital"}>Hospital</MenuItem>
              <MenuItem value={"OccupationalHealthcare"}>
                Occupational Healthcare
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <TextField
              label="Description"
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel shrink>Date</InputLabel>
            <Input
              type="date"
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <TextField
              label="Specialist"
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id="diagnoses">Diagnosis codes</InputLabel>
            <Select
              multiple
              labelId="dianoses"
              value={diagnosisCodes}
              onChange={(event) => handleDiagnosisCodesChange(event)}>
              {diagnoses.map((d) => (
                <MenuItem value={d.code} key={d.code}>
                  {d.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {FormFields({ type })}
          <div>
            <Button variant="contained" color="error" onClick={handleCancel}>
              CANCEL
            </Button>
            <Button
              style={{
                float: "right",
              }}
              variant="contained"
              type="submit">
              ADD
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EntryForm;

const assertNever = (value: string): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

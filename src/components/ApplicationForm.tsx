import React, { useState } from "react";
import type { ApplicationStage, JobApplication, WorkMode } from "../types.ts";

interface ApplicationFormProps {
  onAddApplication: (application: JobApplication) => void;
}

const STAGES: ApplicationStage[] = [
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

const WORK_MODES: WorkMode[] = ["Remote", "Hybrid", "On-site"];

const getTodayDate = () => new Date().toISOString().slice(0, 10);

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onAddApplication,
}) => {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [stage, setStage] = useState<ApplicationStage>("Applied");
  const [workMode, setWorkMode] = useState<WorkMode>("Remote");
  const [location, setLocation] = useState("");
  const [appliedDate, setAppliedDate] = useState(getTodayDate);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCompany = company.trim();
    const trimmedRole = role.trim();

    if (!trimmedCompany || !trimmedRole) {
      setError("Company and role are required.");
      return;
    }

    const newApplication: JobApplication = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `app-${Date.now()}`,
      company: trimmedCompany,
      role: trimmedRole,
      stage,
      workMode,
      location: location.trim() || "Not specified",
      appliedDate: appliedDate || getTodayDate(),
      notes: notes.trim(),
    };

    onAddApplication(newApplication);

    setCompany("");
    setRole("");
    setStage("Applied");
    setWorkMode("Remote");
    setLocation("");
    setAppliedDate(getTodayDate());
    setNotes("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="application-form" noValidate>
      <h2>Add Application</h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-grid">
        <label>
          Company *
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Paystack"
          />
        </label>

        <label>
          Role *
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Frontend Developer"
          />
        </label>

        <label>
          Stage
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value as ApplicationStage)}
          >
            {STAGES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Work Mode
          <select
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value as WorkMode)}
          >
            {WORK_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>

        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Nairobi or Remote"
          />
        </label>

        <label>
          Applied Date
          <input
            type="date"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
          />
        </label>
      </div>

      <label className="form-notes">
        Notes
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Interview details, referral, links..."
        />
      </label>

      <button type="submit" className="submit-btn">
        Add Application
      </button>
    </form>
  );
};
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { ApplicationForm } from "./components/ApplicationForm";
import type {
  ApplicationStage,
  FilterState,
  JobApplication,
  WorkMode,
} from "./types.ts";
import { loadApplications, saveApplications } from "./storage.ts";
import { filterApplications } from "./utils/calculations.ts";
import { SummaryBar } from "./components/summaryBar.tsx";

const STAGES: Array<ApplicationStage | "All"> = [
  "All",
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

const WORK_MODES: Array<WorkMode | "All"> = [
  "All",
  "Remote",
  "Hybrid",
  "On-site",
];

export function App() {
  const [applications, setApplications] = useState<JobApplication[]>(() =>
    loadApplications()
  );
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    stage: "All",
    workMode: "All",
  });

  useEffect(() => {
    saveApplications(applications);
  }, [applications]);

  const visibleApplications = useMemo(
    () => filterApplications(applications, filters),
    [applications, filters]
  );

  const handleStageChange = (id: string, nextStage: ApplicationStage) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, stage: nextStage } : app))
    );
  };

  const handleDelete = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };
  const handleAddApplication = (newApp: JobApplication) => {
  setApplications((prev) => [newApp, ...prev]);
};

  return (
    <main className="app-container">
      <header className="app-header">
        <h1>Job Application Tracker</h1>
        <p>Track roles, interview stages, and application progress.</p>
      </header>

      <ApplicationForm onAddApplication={handleAddApplication} />

      <SummaryBar applications={applications} />

      <section aria-label="Filter applications" className="filters-bar">
        <input
          type="search"
          placeholder="Search company or role..."
          value={filters.searchQuery}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
          }
        />

        <select
          aria-label="Filter by stage"
          value={filters.stage}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              stage: e.target.value as ApplicationStage | "All",
            }))
          }
        >
          {STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage === "All" ? "All Stages" : stage}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by work mode"
          value={filters.workMode}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              workMode: e.target.value as WorkMode | "All",
            }))
          }
        >
          {WORK_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {mode === "All" ? "All Work Modes" : mode}
            </option>
          ))}
        </select>
      </section>

      {visibleApplications.length === 0 ? (
        <p className="empty-state">No applications match your current filters.</p>
      ) : (
        <ul className="application-list">
          {visibleApplications.map((app) => (
            <li key={app.id} className="application-card">
              <div>
                <h2>{app.role}</h2>
                <p>
                  <strong>{app.company}</strong> · {app.location} ·{" "}
                  {app.workMode}
                </p>
                <small>Applied: {app.appliedDate}</small>
                {app.notes && <p className="notes">{app.notes}</p>}
              </div>

              <div className="card-actions">
                <select
                  aria-label={`Stage for ${app.company} ${app.role}`}
                  value={app.stage}
                  onChange={(e) =>
                    handleStageChange(app.id, e.target.value as ApplicationStage)
                  }
                >
                  {STAGES.filter((s): s is ApplicationStage => s !== "All").map(
                    (stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    )
                  )}
                </select>

                <button type="button" onClick={() => handleDelete(app.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
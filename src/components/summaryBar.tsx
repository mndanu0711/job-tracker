import React from "react";
import type{ JobApplication } from "../types";

interface SummaryBarProps {
  applications: JobApplication[];
}

export const SummaryBar: React.FC<SummaryBarProps> = ({ applications }) => {
  const total = applications.length;
  const activeCount = applications.filter(
    (app) => app.stage === "Applied" || app.stage === "Interview"
  ).length;
  const interviewCount = applications.filter(
    (app) => app.stage === "Interview"
  ).length;
  const offerCount = applications.filter((app) => app.stage === "Offer").length;

  return (
    <section aria-label="Application summary" className="summary-bar">
      <div className="stat-card">
        <span className="stat-label">Total Tracked</span>
        <strong className="stat-value">{total}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">Active Pipeline</span>
        <strong className="stat-value">{activeCount}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">Interviews</span>
        <strong className="stat-value">{interviewCount}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">Offers</span>
        <strong className="stat-value">{offerCount}</strong>
      </div>
    </section>
  );
};
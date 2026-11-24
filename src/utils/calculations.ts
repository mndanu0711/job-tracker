import type{ ApplicationStage, FilterState, JobApplication } from "../types";

export interface PipelineSummary {
  total: number;
  activeCount: number;
  interviewCount: number;
  offerCount: number;
  interviewRate: number;
}

export function filterApplications(
  applications: JobApplication[],
  filters: FilterState
): JobApplication[] {
  const normalizedQuery = filters.searchQuery.trim().toLowerCase();

  return applications.filter((app) => {
    const matchesStage =
      filters.stage === "All" || app.stage === filters.stage;

    const matchesWorkMode =
      filters.workMode === "All" || app.workMode === filters.workMode;

    const matchesQuery =
      !normalizedQuery ||
      app.company.toLowerCase().includes(normalizedQuery) ||
      app.role.toLowerCase().includes(normalizedQuery) ||
      app.location.toLowerCase().includes(normalizedQuery) ||
      app.notes.toLowerCase().includes(normalizedQuery);

    return matchesStage && matchesWorkMode && matchesQuery;
  });
}

export function countByStage(
  applications: JobApplication[]
): Record<ApplicationStage, number> {
  return applications.reduce<Record<ApplicationStage, number>>(
    (acc, app) => {
      acc[app.stage] += 1;
      return acc;
    },
    {
      Saved: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    }
  );
}

export function getPipelineSummary(
  applications: JobApplication[]
): PipelineSummary {
  const counts = countByStage(applications);
  const total = applications.length;
  const activeCount = counts.Applied + counts.Interview;
  const interviewCount = counts.Interview;
  const offerCount = counts.Offer;

  // Avoid division by zero when total is 0
  const interviewRate =
    total === 0 ? 0 : Math.round(((interviewCount + offerCount) / total) * 100);

  return {
    total,
    activeCount,
    interviewCount,
    offerCount,
    interviewRate,
  };
}
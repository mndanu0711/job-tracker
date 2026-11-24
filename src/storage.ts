import type{ JobApplication } from "./types";
import { SEED_APPLICATIONS } from "./data/seedData.ts";

const STORAGE_KEY = "job_tracker_applications_v1";

export function loadApplications(): JobApplication[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_APPLICATIONS;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SEED_APPLICATIONS;

    return parsed as JobApplication[];
  } catch (error) {
    console.error("Failed to load applications:", error);
    return SEED_APPLICATIONS;
  }
}

export function saveApplications(applications: JobApplication[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (error) {
    console.error("Failed to save applications:", error);
  }
}
export type ApplicationStage =
   "Saved"
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected";

export type WorkMode = "Remote" | "Hybrid" | "On-site";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  stage: ApplicationStage;
  workMode: WorkMode;
  location: string;
  appliedDate: string;
  notes: string;
}

export interface FilterState {
  searchQuery: string;
  stage: ApplicationStage | "All";
  workMode: WorkMode | "All";
}
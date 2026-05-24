export interface SuggestedResource {
  type: string;
  description: string;
}

export interface Topic {
  order: number;
  title: string;
  description: string;
  prerequisites: string[];
  difficulty: number;
  estimated_hours: number;
  learning_objectives: string[];
  study_tips: string[];
  suggested_resource: SuggestedResource;
  completion_criteria: string;
}

export interface PlanSummary {
  plan_title: string;
  summary: string;
  total_estimated_hours: string;
  personalized_message: string;
}

export interface ScheduleEntry {
  date: string;
  type: "study" | "review";
  order: number;
  topic: string;
  difficulty: number;
  hours?: number;
  review_type?: "D+1" | "D+7" | "D+14";
  learning_objectives?: string[];
  study_tips?: string[];
  completion_criteria?: string;
}

export interface GeneratePlanRequest {
  discipline: string;
  subject: string;
  level: "beginner" | "intermediate" | "advanced";
  exam_date: string;     
  hours_per_day: number;
}

export interface GeneratePlanResponse {
  id: number;
  plan_summary: PlanSummary;
  topics: Topic[];
  study_plan: ScheduleEntry[];
}
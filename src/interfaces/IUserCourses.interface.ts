export interface IUserCourses {
  user_id: number;
  crs_id: number;
  enrolled_at: Date;
  progress_minutes: number;
  completed: boolean;
  last_accessed_at: Date;
}

export interface ICreateUserCourses {
  crs_id: number;
}

export interface IUpdateUserCourses {
  progress_minutes?: number;
  completed?: boolean;
  last_accessed_at?: Date;
} 
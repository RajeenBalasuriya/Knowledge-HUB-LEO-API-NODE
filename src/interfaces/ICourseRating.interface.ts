export interface IRateCourse {
  crs_id: number;
  rating: number; // 1-5 stars
}

export interface IRatingResponse {
  course_id: number;
  new_average_rating: number;
  total_ratings: number;
  user_rating: number;
} 
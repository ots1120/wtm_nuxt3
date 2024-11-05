export interface Course {
  title: string;
  subtitle: string;
  courseSlug: string;
  content: string;
  thumbnail: string;
  video: string;
  rating: number;
  reviewsCount: number;
  studentCount: number;
  reviewsUrl: string;
  inflearnUrl: string;
  gymcodingUrl: string;
}

// typescript 유틸리티 type : Omit -> 특정 속성 제외
export interface CourseWithPath
  extends Omit<Course, 'rating' | 'reviewsCount' | 'studentCount'> {
  rating: string;
  reviewsCount: string;
  studentCount: string;
  path: string;
}
// export interface CourseWithPath {
//   title: string;
//   subtitle: string;
//   courseSlug: string;
//   content: string;
//   thumbnail: string;
//   video: string;
//   rating: string;
//   reviewsCount: string;
//   studentCount: string;
//   reviewsUrl: string;
//   inflearnUrl: string;
//   gymcodingUrl: string;
//   path: string;
// }

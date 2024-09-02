import { ExerciseEntry } from "./exerciseEntry";

export type Post = {
  id: string;
  createdAt: string; // "YYYY/MM/DD"
  authorId: string;
  exerciseEntries: ExerciseEntry[];
};

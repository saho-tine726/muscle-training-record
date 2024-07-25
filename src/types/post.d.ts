import { ExerciseEntryType } from "./exerciseEntry";

export type PostType = {
  id: string;
  createdAt: string; // "YYYY/MM/DD"
  authorId: string;
  exerciseEntries: ExerciseEntryType[];
};

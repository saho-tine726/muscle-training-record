import { ExerciseEntryType } from "./exerciseEntry";

export type PostType = {
  id: number;
  uuid: string;
  authorId: number;
  createdAt: string; // "YYYY/MM/DD"
  exerciseEntries: ExerciseEntryType[];
};

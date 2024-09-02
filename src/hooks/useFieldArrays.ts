import { Control, useFieldArray } from "react-hook-form";

export const useFieldArrays = (control: Control<any>) => {
  return {
    CHEST: useFieldArray({ control, name: "exercises.CHEST" }),
    BACK: useFieldArray({ control, name: "exercises.BACK" }),
    LEGS: useFieldArray({ control, name: "exercises.LEGS" }),
    SHOULDERS: useFieldArray({ control, name: "exercises.SHOULDERS" }),
    ARMS: useFieldArray({ control, name: "exercises.ARMS" }),
  };
};

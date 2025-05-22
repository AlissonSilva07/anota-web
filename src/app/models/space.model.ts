import { Note } from "./note.model";

export interface Space {
  id: string;
  title: string;
  description: string;
  color?: string;
  notes?: Note[];
  createdAt: string;
  updatedAt?: string;
}
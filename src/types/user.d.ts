import { Post } from "./post";

export type User = {
  id: string;
  auth_id: string;
  email: string;
  name: string;
  posts: Post[];
};

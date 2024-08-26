// TODO　posts: [];となってますが、なんの配列か肩つけた方が良いですね
// posts: PostType[]みたいな
// ちなみに余談ですが、型名は先頭が大文字で始めるため〜〜Typeと後ろにつけなくてもOKです。UserとかPostで十分です。👍
export type UserType = {
  id: string;
  auth_id: string;
  email: string;
  name: string;
  posts: [];
};

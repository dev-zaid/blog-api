export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  lastModified: string;
  likes: Array<string>; //array of user ids
}

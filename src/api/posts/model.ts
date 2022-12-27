export interface Blog {
  id: string;
  title: string;
  content: Array<string>;
  author: string;
  createdAt: any;
  lastModified: any;
  likes: Array<string>;
  comments: Array<Comment>; //array of user ids
}

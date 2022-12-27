import { ObjectID } from 'mongodb';

export interface CommentType {
  _id?: ObjectID;
  postID: ObjectID;
  user: ObjectID;
  content: string;
  createdAt: Date;
}

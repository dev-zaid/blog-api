import { ObjectID } from 'mongodb';
import database from '../../loaders/database';
import LoggerInstance from '../../loaders/logger';
import ErrorClass from '../../shared/types/error';
import { CommentType } from './model';

export async function getAllComments(postID: string): Promise<any> {
  try {
    const comments: Array<CommentType> = await (await database())
      .collection('comments')
      .find({ postID: postID })
      .toArray();
    if (!comments) throw new ErrorClass('Comment not found', 404);
    return {
      bool: true,
      message: 'Success',
      status: 200,
      data: comments,
    };
  } catch (e) {
    LoggerInstance.error(e);
    throw {
      bool: false,
      message: 'Error getting all comments.',
      status: 400,
    };
  }
}

export async function getCommentByID(userID: string): Promise<any> {
  try {
    const comments = await (await database()).collection('comments').find({ user: userID }).toArray();
    if (!comments) throw new ErrorClass('No Comment found', 404);

    return {
      bool: true,
      message: 'Success',
      status: 200,
      data: comments,
    };
  } catch (e) {
    LoggerInstance.error(e);
    throw {
      bool: false,
      message: 'Error getting all comments.',
      status: 400,
    };
  }
}

export async function postComment(postID: string, comment: string, userID: string): Promise<any> {
  try {
    const post = await (await database()).collection('posts').findOne({ _id: new ObjectID(postID) });
    if (!post) throw new ErrorClass('Post not found', 404);
    const commentBody: CommentType = {
      content: comment,
      postID: new ObjectID(postID),
      user: new ObjectID(userID),
      createdAt: new Date(),
    };
    await (await database()).collection('comments').insertOne({ commentBody });

    return {
      bool: true,
      message: 'Comment posted successfully.',
      status: 200,
    };
  } catch (e) {
    LoggerInstance.error(e);
    throw {
      bool: false,
      message: 'Error posting the comment.',
      status: 400,
    };
  }
}

export const updateComment = async (commentContent: any, commentID: any, userID: string): Promise<any> => {
  try {
    const user = (await (await database()).collection('comments').findOne({ _id: new ObjectID(commentID) })).user;
    if (userID != user) throw new ErrorClass('Unauthorized', 401);
    await (await database()).collection('comments').updateOne(
      { _id: new ObjectID(commentID) },
      {
        $currentDate: {
          lastModified: true,
        },
        $set: { content: commentContent },
      },
    );
    return {
      bool: true,
      message: 'Comment updated successfully.',
      status: 200,
    };
  } catch (e) {
    LoggerInstance.error(e);
    throw {
      bool: false,
      message: 'Error updating the comment.',
      status: 400,
    };
  }
};

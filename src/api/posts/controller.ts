import database from '../../loaders/database';
import { ObjectId, Timestamp } from 'mongodb';
import LoggerInstance from '../../loaders/logger';
import { Blog } from './model';
import ErrorClass from '../../shared/types/error';

export async function postBlog(blogpost: Blog, id: string): Promise<any> {
  try {
    console.log(Date.now());
    blogpost = {
      ...blogpost,
      author: id,
      createdAt: new Date(),
      likes: [],
      comments: [],
    };
    await (await database()).collection('posts').insertOne(blogpost);
    return {
      bool: true,
      message: 'Blog posted successfully.',
      status: 200,
    };
  } catch (e) {
    LoggerInstance.error(e);
    throw {
      bool: false,
      message: 'Error posting the blog.',
      status: 400,
    };
  }
}

export const updatePost = async (postID: string, postContent: any, userID: string): Promise<any> => {
  try {
    const author = (await (await database()).collection('posts').findOne({ _id: new ObjectId(postID) })).author;
    if (userID != author) throw new ErrorClass('Unauthorized', 401);
    await (await database()).collection('posts').updateOne(
      { _id: new ObjectId(postID) },
      {
        $currentDate: {
          lastModified: true,
        },
        $set: postContent,
      },
    );
    return {
      bool: true,
      message: 'Blog updated successfully.',
      status: 200,
    };
  } catch (e) {
    LoggerInstance.error(e);
    throw {
      bool: false,
      message: 'Error updating the blog.',
      status: 400,
    };
  }
};

async function deletePost(postID: string, userID: string): Promise<any> {
  try {
    const author = (await (await database()).collection('posts').findOne({ _id: new ObjectId(postID) })).author;
    if (userID != author) throw new ErrorClass('Unauthorized', 401);
    await (await database()).collection('posts').deleteOne({ _id: new ObjectId(postID) });
    return {
      bool: true,
      message: 'Blog deleted successfully.',
      status: 200,
    };
  } catch (e) {
    LoggerInstance.error(e);
    throw {
      bool: false,
      message: 'Error deleting the blog.',
      status: 400,
    };
  }
}

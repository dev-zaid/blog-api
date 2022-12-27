import database from '../../loaders/database';
import { ObjectID } from 'mongodb';
import LoggerInstance from '../../loaders/logger';
import { Blog } from './model';
import ErrorClass from '../../shared/types/error';

export async function getBlogByID(postID: string): Promise<any> {
  try {
    const blog = await (await database()).collection('posts').findOne({ postID: postID });
    if (!blog) throw new ErrorClass('Blog not found', 404);
    return {
      bool: true,
      message: 'Success',
      status: 200,
      data: blog,
    };
  } catch (e) {
    LoggerInstance.error(e);
    throw {
      bool: false,
      message: 'Error fetching the blog.',
      status: 400,
    };
  }
}

export async function postBlog(blogpost: Blog, id: string): Promise<any> {
  try {
    const postID = new ObjectID();
    blogpost = {
      ...blogpost,
      author: new ObjectID(id),
      createdAt: new Date(),
      likes: [],
      comments: [],
    };
    await (await database()).collection('posts').insertOne({ _id: postID, ...blogpost });
    await (await database())
      .collection('user-profile')
      .updateOne({ userID: new ObjectID(id) }, { $push: { blogs: postID } });
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
    const author = (await (await database()).collection('posts').findOne({ _id: new ObjectID(postID) })).author;
    if (userID != author) throw new ErrorClass('Unauthorized', 401);
    await (await database()).collection('posts').updateOne(
      { _id: new ObjectID(postID) },
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

export async function deletePost(postID: string, userID: string): Promise<any> {
  try {
    const author = (await (await database()).collection('posts').findOne({ _id: new ObjectID(postID) })).author;
    if (userID != author) throw new ErrorClass('Unauthorized', 401);
    await (await database()).collection('posts').deleteOne({ _id: new ObjectID(postID) });
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

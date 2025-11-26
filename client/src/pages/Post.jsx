import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import CommentList from '../components/CommentList';
import LikeButton from '../components/LikeButton';

const Post = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    API.get(`/posts/${slug}`).then(({ data }) => setPost(data));
  }, [slug]);

  if (!post) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="my-4">{post.content}</p>
      <LikeButton postId={post._id} />
      <CommentList postId={post._id} />
    </div>
  );
};

export default Post;

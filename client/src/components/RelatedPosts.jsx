import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const RelatedPosts = ({ tags=[] })=>{
  const [posts, setPosts] = useState([]);
  useEffect(()=>{
    if(!tags || tags.length===0) return;
    (async ()=>{
      try{
        const { data } = await API.get(`/posts?tags=${encodeURIComponent(tags.join(','))}&limit=4`);
        setPosts(data || []);
      }catch(e){ setPosts([]); }
    })();
  }, [tags]);
  if(posts.length===0) return null;
  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-3">Related posts</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {posts.map(p=> (
          <Link key={p._id||p.slug} to={`/posts/${p.slug||p._id}`} className="p-3 border rounded-md hover:shadow">{p.title}</Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;

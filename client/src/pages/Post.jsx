import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import axios from 'axios'
import Loader from '../components/Loader'
import {jwtDecode} from 'jwt-decode';


const PAGE_NUMBER = 1;

const Post = () => {
  // const [userId, setUserId] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
 
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(PAGE_NUMBER);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);



  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Set loading to true when fetching posts
      const response = await axios.get(
        `http://localhost:3000/posts?page=${page}`,{
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          'Content-Type': 'application/json'
      }}
      );
      setPosts((prevPosts) => {
        const uniqueNewPosts = response.data.posts.filter(
          (newPost) => !prevPosts.some((post) => post._id === newPost._id)
        );
        return [...prevPosts, ...uniqueNewPosts];
      });
      setLoading(false); // Set loading to false after fetching posts
      setHasMore(response.data.hasMore); // Update hasMore based on backend response
    };

    if (hasMore && cookies.token) { // Only fetch posts if there are more available
      fetchPosts();
    }
  }, [page, hasMore]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight &&
      !loading && hasMore // Check if not loading and there are more posts available
    ) {
      setPage((prev) => prev + 1);
    }
  };
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Navbar />
      <h1 style={{ margin: '5px auto' }} className="pacifico-regular">
        Posts
      </h1>
      <div className="flex flex-col w-5/6 min-h-screen gap-7 justify-center items-center mx-auto mb-10 mt-3">
        {posts.map(post => (
          <Card key={post._id} post={post} />
        ))}
        {loading && <Loader />}
      </div>
    </div>
  );
};

export default Post

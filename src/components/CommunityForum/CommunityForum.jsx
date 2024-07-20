import React, { useState, useEffect } from 'react';
import { db, auth } from './Firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import NewPost from './NewPost';
import Post from './Post';
import './CommunityForum.css';

const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        postsData.push({ id: doc.id, ...data, upvotes: data.upvotes || 0, upvotedBy: data.upvotedBy || [] });
      });
      setPosts(postsData.sort((a, b) => b.upvotes - a.upvotes));
    };

    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleNewPost = async (content) => {
    const newPost = { content, author: user.displayName, photoURL: user.photoURL, comments: [], upvotes: 0, upvotedBy: [] };
    const docRef = await addDoc(collection(db, 'posts'), newPost);
    setPosts([{ id: docRef.id, ...newPost }, ...posts]);
  };

  const handleDeletePost = async (id) => {
    await deleteDoc(doc(db, 'posts', id));
    setPosts(posts.filter(post => post.id !== id));
  };

  const handleAddComment = async (postId, commentContent) => {
    const postDoc = doc(db, 'posts', postId);
    const post = posts.find(post => post.id === postId);
    const newComment = {
      content: commentContent,
      author: user.displayName,
      photoURL: user.photoURL,
    };
    const updatedComments = [...post.comments, newComment];
    await updateDoc(postDoc, { comments: updatedComments });
    setPosts(posts.map(p => (p.id === postId ? { ...p, comments: updatedComments } : p)));
  };

  const handleUpvote = async (postId) => {
    if (!user) {
      alert('Please log in to upvote.');
      return;
    }
    const postDoc = doc(db, 'posts', postId);
    const post = posts.find(post => post.id === postId);
    if (post.upvotedBy.includes(user.uid)) {
      alert('You have already upvoted this post.');
      return;
    }
    const newUpvoteCount = (post.upvotes || 0) + 1;
    const updatedUpvotedBy = [...post.upvotedBy, user.uid];
    await updateDoc(postDoc, { upvotes: newUpvoteCount, upvotedBy: updatedUpvotedBy });
    setPosts(posts.map(p => (p.id === postId ? { ...p, upvotes: newUpvoteCount, upvotedBy: updatedUpvotedBy } : p)).sort((a, b) => b.upvotes - a.upvotes));
  };

  return (
    <div id='communityforum' className="community-forum">
      <h1>Community Forum</h1>
      {user && <NewPost onNewPost={handleNewPost} />}
      <div className="posts">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onDelete={handleDeletePost}
            onAddComment={handleAddComment}
            onUpvote={handleUpvote}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};

export default CommunityForum;

import React, { useState } from 'react';


const Post = ({ post, onDelete, onAddComment, onUpvote, user }) => {
  const [comment, setComment] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(post.id, comment);
      setComment('');
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-info">
          <img src={post.photoURL} alt="Profile" className="profile-picture" />
          <div>
            <div className="post-author">{post.author}</div>
            <div className="post-content">{post.content}</div>
          </div>
        </div>
        {user && user.displayName === post.author && (
          <button className="delete-button" onClick={() => onDelete(post.id)}>Delete</button>
        )}
      </div>
      <div className="post-comments">
        {post.comments.map((comment, index) => (
          <div key={index} className="comment">
            <img src={comment.photoURL} alt="Profile" className="profile-picture" />
            <div className="comment-info">
              <div className="comment-author">{comment.author}</div>
              <div className="comment-content">{comment.content}</div>
            </div>
          </div>
        ))}
        {user && (
          <form className="new-comment" onSubmit={handleSubmitComment}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
            ></textarea>
            <button type="submit">Add Comment</button>
          </form>
        )}
      </div>
      <div className="post-actions">
        <button className="btn-primary upvote-button" onClick={() => onUpvote(post.id)}>
          Upvote (<span className="upvote-count">{post.upvotes}</span>)
        </button>
        
      </div>
    </div>
  );
};

export default Post;

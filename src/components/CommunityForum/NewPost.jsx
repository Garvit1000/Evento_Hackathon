
import React, { useState } from 'react';

const NewPost = ({ onNewPost }) => {
  const [content, setContent] = useState("");

  const handlePost = () => {
    onNewPost(content);
    setContent("");
  };

  return (
    <div className="new-post">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
      ></textarea>
      <button onClick={handlePost}>Post</button>
    </div>
  );
};

export default NewPost;

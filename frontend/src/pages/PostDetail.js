import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '../services/posts';
import { FaUser,FaCalendar, FaArrowLeft } from 'react-icons/fa';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await postService.getPostById(id);
      setPost(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return (
      <div className="error-container">
        <h3>Post not found</h3>
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="post-detail">
      <Link to="/" className="back-link">
        <FaArrowLeft /> Back to Posts
      </Link>

      <article className="post-article">
        <div className="post-header">
          <div className="post-meta">
            <span className="meta-item">
              <FaUser /> {post.author?.username || 'Unknown'}
            </span>
            <span className="meta-item">
              <FaCalendar /> {formatDate(post.createdAt)}
            </span>
            {post.category && (
              <span className="post-category">{post.category}</span>
            )}
          </div>

          <h1 className="post-title">{post.title}</h1>
        </div>

        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        )}
        
      </article>
    </div>
  );
};

export default PostDetail;
import React from 'react';
import { Link } from 'react-router-dom';
import {FaCalendar, FaArrowRight } from 'react-icons/fa';

const PostCard = ({ post }) => {
  if (!post) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="post-card">
      <div className="card-header">
        <div className="author-info">
          <div className="author-avatar">
            {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="author-details">
            <span className="author-name">{post.author?.username || 'Unknown'}</span>
            <span className="post-date">
              <FaCalendar /> {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        {post.category && (
          <span className="category-tag">{post.category}</span>
        )}
      </div>

      <div className="card-content">
        <h3 className="post-title">
          <Link to={`/post/${post._id}`}>{post.title || 'Untitled Post'}</Link>
        </h3>
        <p className="post-excerpt">
          {post.content && post.content.length > 100 
            ? `${post.content.substring(0, 100)}...` 
            : post.content || 'No content available'}
        </p>
      </div>

      <div className="card-footer">
        <Link to={`/post/${post._id}`} className="read-btn">
          Read Post <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
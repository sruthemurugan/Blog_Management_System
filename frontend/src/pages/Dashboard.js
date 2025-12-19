import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/posts';
import { authService } from '../services/auth';
import PostCard from '../components/PostCard';
import { FaPlus, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserPosts();
    setUser(authService.getCurrentUser());
  }, []);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getUserPosts();
      setPosts(data || []); 
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(postId);
        setPosts(posts.filter(post => post._id !== postId));
        alert('Post deleted successfully!');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <div className="user-avatar">
            <FaUser />
          </div>
          <div>
            <h2>Welcome, {user?.username}</h2>
            <p>{user?.email}</p>
          </div>
        </div>
        
        <Link to="/create" className="btn-create">
          <FaPlus /> Create New Post
        </Link>
      </div>

      <div className="dashboard-content">
        <h3>My Posts</h3>
        
        {loading ? (
          <div className="loading">Loading your posts...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <p>You haven't created any posts yet.</p>
            <Link to="/create" className="btn-create-first">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <div key={post._id} className="dashboard-post-item">
                <PostCard post={post} />
                <div className="post-actions">
                  <Link to={`/edit/${post._id}`} className="btn-edit">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(post._id)} 
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
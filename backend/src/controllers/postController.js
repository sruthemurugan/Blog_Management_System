const Post = require('../models/Post');

const createPost = async (req, res) => {
  try {
    const { title, content, tags, category, imageUrl } = req.body;
    
    const post = new Post({
      title,
      content,
      author: req.userId,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      category: category || 'General',
      imageUrl: imageUrl || ''
    });

    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublished: true })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.userId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, tags, category, imageUrl } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags ? tags.split(',').map(tag => tag.trim()) : post.tags;
    post.category = category || post.category;
    post.imageUrl = imageUrl || post.imageUrl;
    post.updatedAt = Date.now();
    
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }
    
    
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false,
        error: 'Not authorized' 
      });
    }
    
    await post.deleteOne();
    res.json({
      success: true,
      message: 'Post deleted successfully' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error' 
    });
  }
};


module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost
};
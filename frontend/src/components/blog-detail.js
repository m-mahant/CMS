import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/blogdetail.css';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/blog-posts/${id}`);
                setPost(response.data.blog_post);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching blog post:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!post) {
        navigate('/');
        return null;
    }

    return (
        <div className="blog-detail card">
            <div className="card-content">
                <h1 className='post-title'>{post.title}</h1>
                {post.images && post.images.length > 0 && (
                    <img src={`http://127.0.0.1:8000/images/${post.images[post.images.length - 1]}`} alt="Last Image" />
                )}
                <p className="published-date">Published on: {formatDate(post.publication_date)}</p>
                <div className="post-content">{post.content}</div>
                <div className="tags">
                    <p>Tags:
                        {post.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './styles/home.css';

const Home = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [sortBy, setSortBy] = useState('');
    const user_id = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsResponse, usersResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/blog-posts'),
                    axios.get('http://127.0.0.1:8000/api/users')
                ]);
                setBlogPosts(postsResponse.data.blog_posts);
                setUsers(usersResponse.data.users);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    function formatPublicationDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const suffix = getDaySuffix(day);

        return `${day}${suffix}, ${month} ${year}`;
    }

    function getDaySuffix(day) {
        if (day >= 11 && day <= 13) {
            return 'th';
        }
        switch (day % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }

    const handleAuthorChange = (event) => {
        setSelectedAuthor(event.target.value);
    };

    const handleSortByChange = (event) => {
        setSortBy(event.target.value);
    };

    const filteredPosts = selectedAuthor ? blogPosts.filter(post => {
        const authorName = users.find(user => user.id === post.author_id)?.name;
        return authorName === selectedAuthor;
    }) : blogPosts;

    const sortedPosts = sortBy ? filteredPosts.slice().sort((a, b) => {
        if (sortBy === 'name') {
            const authorA = users.find(user => user.id === a.author_id)?.name || '';
            const authorB = users.find(user => user.id === b.author_id)?.name || '';
            return authorA.localeCompare(authorB);
        }
        return 0;
    }) : filteredPosts;

    return (
        <>
            <div className='filter-section'>
                <label htmlFor="author">Filter by Author:</label>
                <select id="author" value={selectedAuthor} onChange={handleAuthorChange}>
                    <option value="">All Authors</option>
                    {users.map(user => (
                        <option key={user.id} value={user.name}>{user.name}</option>
                    ))}
                </select>
                &nbsp;&nbsp;&nbsp;
                <label htmlFor="sortBy">Sort by:</label>
                <select id="sortBy" value={sortBy} onChange={handleSortByChange}>
                    <option value="">None</option>
                    <option value="name">Name</option>
                </select>
            </div>
            <div className="container blog-container">
                {sortedPosts.length === 0 ? (
                    <p>No blog posts available.</p>
                ) : (
                    sortedPosts.map(post => (
                        <div className="blog-card" key={post.id}>
                            {post.images && post.images.length > 0 && (
                                <img src={`http://127.0.0.1:8000/images/${post.images[post.images.length - 1]}`} alt="Last Image" />
                            )}
                            <div className="card-content">
                                <br></br>
                                <h2 className="post-title">{post.title}</h2>
                                <p className="post-content">{post.content}</p>
                                <div className="tags">
                                    Tags: {post.tags.map((tag, index) => (
                                        <span key={index} className="tag">{tag}</span>
                                    ))}
                                </div>
                                <p className="publication-date">Published: {formatPublicationDate(post.publication_date)}</p>
                                <p className="publication-date">Posted by: {users.find(user => user.id === post.author_id)?.name}</p>
                                <div className="buttons">
                                    <p>
                                        <Link to="/">
                                            <Button variant="dark">View more</Button>{' '}
                                        </Link>
                                    </p>
                                    {user_id && parseInt(user_id) === post.author_id && (
                                        <p>
                                            <Link to={`/edit/${post.id}`}>
                                                <Button variant="primary">Edit Blog</Button>{' '}
                                            </Link>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default Home;

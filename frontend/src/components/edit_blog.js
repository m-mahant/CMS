import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        publication_date: '',
        tags: [],
        author_id: '',
    });
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/blog-posts/${id}`);
                const postData = response.data.blog_post;
                setFormData({
                    title: postData.title,
                    content: postData.content,
                    publication_date: moment(postData.publication_date).format('YYYY-MM-DD'),
                    tags: postData.tags,
                    author_id: postData.author_id,
                });
                setImages(postData.images);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch post data. Please try again later.');
                setLoading(false);
            }
        };

        fetchPostData();
    }, [id]);

    const handleChange = e => {
        const { name, value } = e.target;
        if (name === 'tags') {
            const tagsArray = value.split(',').map(tag => tag.trim());
            setFormData({ ...formData, [name]: tagsArray });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleImageChange = e => {
        setSelectedImages([...e.target.files]);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        const formDataWithImages = new FormData();
        formDataWithImages.append('title', formData.title);
        formDataWithImages.append('content', formData.content);
        formDataWithImages.append('publication_date', formData.publication_date);
        formDataWithImages.append('tags', formData.tags.join(','));
        formDataWithImages.append('author_id', formData.author_id);

        selectedImages.forEach(image => {
            formDataWithImages.append('images', image);
        });

        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/update-blog/${id}`, formDataWithImages, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccessMessage(response.data.message);
            navigate("/");
        } catch (error) {
            setError('Failed to update blog. Please try again later.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container form-width">
            <h2 className="title">Edit Blog</h2>
            <Form onSubmit={handleSubmit} className="edit-post-form">
                <Form.Group controlId="formBasicTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter title" name="title" value={formData.title} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formBasicContent">
                    <Form.Label>Content</Form.Label>
                    <Form.Control as="textarea" rows={4} placeholder="Enter content" name="content" value={formData.content} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formBasicPublicationDate">
                    <Form.Label>Publication Date</Form.Label>
                    <Form.Control type="date" name="publication_date" value={formData.publication_date} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formBasicTags">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter tags (comma separated)"
                        name="tags"
                        value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicImages">
                    <Form.Label>Existing Images</Form.Label>
                    <div className="existing-images-container">
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={`http://127.0.0.1:8000/images/${image}`}
                                alt={`Image ${index}`}
                                className="existing-image"
                                style={{ width: '200px', height: '150px' }}
                            />
                        ))}
                    </div>
                </Form.Group>

                <Form.Group controlId="formBasicNewImages">
                    <Form.Label>New Images</Form.Label>
                    <Form.Control type="file" name="images" accept="image/*" multiple onChange={handleImageChange} />
                </Form.Group>

                <br />
                <Button variant="dark" type="submit">
                    Update Blog
                </Button>
                <br /><br /><br /><br />
                {error && <div className="error">{error}</div>}
                {successMessage && <div className="success">{successMessage}</div>}
            </Form>
        </div>
    );
};

export default EditPost;

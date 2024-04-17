import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

const user_id = localStorage.getItem('user_id');

const NewPost = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author_id: user_id,
        publication_date: '',
        tags: [],
    });
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const handleChange = e => {
        const { name, value } = e.target;
        if (name === 'tags') {
            const tagsArray = value.split(',').map(tag => tag.trim());
            setFormData({ ...formData, [name]: tagsArray });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = e => {
        const files = e.target.files;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

        const validFiles = Array.from(files).filter(file => allowedTypes.includes(file.type));
        const invalidFiles = Array.from(files).filter(file => !allowedTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            setError('Please upload only jpeg, png, jpg, or gif files.');
        } else {
            setImages(validFiles);
            setError(null);

            const imagePreviews = [];
            validFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = () => {
                    imagePreviews.push(reader.result);
                    if (imagePreviews.length === validFiles.length) {
                        setImagesPreview(imagePreviews);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        if (formData.title.trim() === '') {
            setError('Please enter a title.');
            return;
        }

        if (formData.content.trim() === '') {
            setError('Please enter content for your blog.');
            return;
        }

        if (formData.publication_date.trim() === '') {
            setError('Please select a publication date.');
            return;
        }

        if (formData.tags.length === 0) {
            setError('Please enter at least one tag.');
            return;
        }

        if (images.length === 0) {
            setError('Please upload at least one image.');
            return;
        }

        try {
            const formDataWithImages = new FormData();
            formDataWithImages.append('title', formData.title);
            formDataWithImages.append('content', formData.content);
            formDataWithImages.append('author_id', formData.author_id);
            formDataWithImages.append('publication_date', formData.publication_date);
            formData.tags.forEach((tag, index) => {
                formDataWithImages.append(`tags[${index}]`, tag);
            });

            images.forEach((image, index) => {
                formDataWithImages.append(`images[${index}]`, image);
            });

            const response = await axios.post('http://127.0.0.1:8000/api/create-blog', formDataWithImages);
            setSuccessMessage(response.data.message);
            setFormData({
                title: '',
                content: '',
                author_id: '',
                publication_date: '',
                tags: [],
            });
            setImages([]);
            setImagesPreview([]);
            navigate("/");
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="container form-width">
            <h2 className="title">Create New Blog</h2>
            <Form onSubmit={handleSubmit} className="new-post-form">
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
                    <Form.Label>Images</Form.Label>
                    <Form.Control type="file" name="images" onChange={handleFileChange} multiple />
                    {imagesPreview.map((preview, index) => (
                        <img key={index} src={preview} alt={`Image ${index}`} style={{ maxWidth: '200px', maxHeight: '200px', margin: '5px' }} />
                    ))}
                </Form.Group>
                <br />
                <Button variant="dark" type="submit">
                    Create Blog
                </Button>
                <br /><br /><br /><br />
                {error && <div className="error">{error}</div>}
                {successMessage && <div className="success">{successMessage}</div>}
            </Form>
        </div>
    );
};

export default NewPost;

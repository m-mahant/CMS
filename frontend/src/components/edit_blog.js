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
        images: []
    });
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
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
                const imagesArray = postData.images.split('|');
                setImages(imagesArray);
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
        const previews = [];
        for (let i = 0; i < e.target.files.length; i++) {
            previews.push(URL.createObjectURL(e.target.files[i]));
        }
        setImagePreviews(previews);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        const formDataWithImages = new FormData();
        formDataWithImages.append('title', formData.title);
        formDataWithImages.append('content', formData.content);
        formDataWithImages.append('publication_date', formData.publication_date);
        formDataWithImages.append('author_id', formData.author_id);
        formData.tags.forEach(tag => {
            formDataWithImages.append('tags[]', tag);
        });

        if (selectedImages.length > 0) {
            selectedImages.forEach((image, index) => {
                formDataWithImages.append(`images[${index}]`, image);
            });
        }

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/update-blog/${id}`, formDataWithImages, {
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

    const existingImages = images.map((image, index) => (
        <img key={index} src={`http://127.0.0.1:8000/images/${image}`} alt="Existing" className="existing-image" style={{ width: '100px', height: '100px', gap: '10px' }} />
    ));

    const newImageInput = (
        <Form.Group controlId="formBasicNewImages">
            <Form.Label>Upload New Images</Form.Label>
            <Form.Control type="file" multiple onChange={handleImageChange} />
        </Form.Group>
    );

    const imagePreviewElements = imagePreviews.map((preview, index) => (
        <img key={index} src={preview} alt="Preview" className="image-preview" style={{ width: '100px', height: '100px', gap: '10px' }} />
    ));

    const message = successMessage ? <div className="success-message">{successMessage}</div> : null;
    const errorMessage = error ? <div className="error-message">{error}</div> : null;

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
                        value={formData.tags.join(', ')}
                        onChange={handleChange}
                    />
                </Form.Group>
                <br /><br />
                <div className="existing-images-container">
                    {existingImages}
                </div>
                {newImageInput}
                <br /><br />
                <div className="image-preview-container">
                    {imagePreviewElements}
                </div>
                <br /><br />
                <Button variant="primary" type="submit">
                    Update Blog
                </Button>
                {message}
                {errorMessage}

            </Form>
        </div>
    );
};

export default EditPost;

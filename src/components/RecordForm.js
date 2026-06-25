import React, { useState, useEffect } from 'react';

function RecordForm({ onSave, editingRecord, onCancelEdit }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        image: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingRecord) {
            const { id, createdAt, ...data } = editingRecord;
            setFormData(data);
            setErrors({});
        }
    }, [editingRecord]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (formData.url && !isValidUrl(formData.url)) {
            newErrors.url = 'Please enter a valid URL';
        }

        if (formData.image && !isValidUrl(formData.image)) {
            newErrors.image = 'Please enter a valid image URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            url: '',
            image: '',
            notes: ''
        });
        setErrors({});
        if (editingRecord) {
            onCancelEdit();
        }
    };

    return (
        <div className="panel-card">
            <h2>{editingRecord ? 'Edit Record' : 'Create or Update Record'}</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                    <label>
                        Title
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Record title"
                            className={errors.title ? 'error' : ''}
                        />
                        {errors.title && <span className="error">{errors.title}</span>}
                    </label>

                    <label>
                        Description
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Short description"
                            className={errors.description ? 'error' : ''}
                        ></textarea>
                        {errors.description && <span className="error">{errors.description}</span>}
                    </label>

                    <label>
                        Link URL
                        <input
                            type="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            className={errors.url ? 'error' : ''}
                        />
                        {errors.url && <span className="error">{errors.url}</span>}
                    </label>

                    <label>
                        Image URL
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className={errors.image ? 'error' : ''}
                        />
                        {errors.image && <span className="error">{errors.image}</span>}
                    </label>

                    <label>
                        Notes
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Any extra notes"
                        ></textarea>
                    </label>
                </div>

                <div className="form-actions">
                    <button type="submit" className="primary-btn">
                        {editingRecord ? 'Update Record' : 'Save Record'}
                    </button>
                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={resetForm}
                    >
                        {editingRecord ? 'Cancel' : 'Reset'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RecordForm;

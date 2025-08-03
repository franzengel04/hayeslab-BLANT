// src/pages/ContactUs.tsx
import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to handle form submission (e.g., send an email) will go here
        console.log('Contact form submitted:', formData);
        alert('Thank you for your message!');
        // Optionally, reset the form
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="cu-pageContainer">
            <div className="cu-contactBox">
                <h2 className="cu-title">Contact Us</h2>
                <form onSubmit={handleSubmit}>
                    <div className="cu-formGroup">
                        <label htmlFor="name" className="cu-label">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="cu-input"
                            placeholder="Enter name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="cu-formGroup">
                        <label htmlFor="email" className="cu-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="cu-input"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="cu-formGroup">
                        <label htmlFor="subject" className="cu-label">Subject:</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            className="cu-input"
                            placeholder="Enter subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="cu-formGroup">
                        <label htmlFor="message" className="cu-label">Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            className="cu-textarea"
                            placeholder="Enter message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="cu-submitButton">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactUs;

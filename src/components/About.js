import React from 'react';
import './About.css';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="about-wrapper">
      <div className="about-left">
        <h1>Your Notes, Organized</h1>
        <p>
          iNotebook helps you capture ideas, not down reminders, and manage your personal or work notes all in one place.
        </p>
        <div className="about-buttons">
          <button className="primary-btn d-flex align-item-center"  onClick={handleGetStarted}>Get Started</button>
        </div>
      </div>

      <div className="about-right">
        <div className="note-card">
          <h2>Meeting Notes</h2>
          <p>- Discuss project roadmap</p>
          <p>- Assign development tasks</p>
          <p>- Review client feedback</p>
          <p>- Plan next sprint goals</p>
        </div>
      </div>
    </div>
  );
};

export default About;

import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import useUserStore from '../../store/userStore';
import apiBase from '../../utils/api';
import './personalInformation.css';
import { FaCamera, FaPlus } from 'react-icons/fa';

function PersonalInformationUpdateForm() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [surName, setSurName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const { mutate, isLoading } = useMutation({
    mutationFn: async (updatedUserObj) => {
      const response = await fetch(`${apiBase}/users`, {
        method: 'PUT',
        body: JSON.stringify(updatedUserObj),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      return data;
    },

    onSuccess: (data) => {
      setUser(data);
      setMessage('Your information has been successfully updated!');
      setMessageType('success');
    },

    onError: (err) => {
      setMessage(`Error: ${err.message}`);
      setMessageType('error');
    },
  });

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setMiddleName(user.middleName);
    setEmailAddress(user.emailAddress);
    setSurName(user.surName);
    setProfileImageUrl(user.profileImageUrl || '');
  }, [user]);

  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 2000); 

      return () => clearTimeout(timer); 
    }
  }, [message]);

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'v5fhffpd');
    formData.append('cloud_name', 'dbxiinf5v');

    setIsUploading(true);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dbxiinf5v/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setProfileImageUrl(data.secure_url); 
      setMessage('Profile photo uploaded successfully');
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to upload profile photo');
      setMessageType('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdatePersonalInformation = (e) => {
    e.preventDefault();
    setMessage(''); 

    if (!firstName || !lastName || !emailAdress || !userName) {
      setMessage('All fields are required');
      setMessageType('error');
      return;
    }

    mutate({ firstName, middleName, emailAddress, surName, profileImageUrl });
  };

  return (
    <div className='personal-information-section'>
    <div className="personal-info-update-form">
      <h2 className="form-title">Update Personal Information</h2>

      {message && (
        <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleUpdatePersonalInformation} className="form">
        <div className="form-group profile-photo-group">
          <label htmlFor="profile-photo" className="profile-photo-label">
            <span className="upload-icon">
              <FaCamera aria-hidden="true" />
              <FaPlus aria-hidden="true" />
            </span>
            <input
              type="file"
              id="profile-photo"
              className="profile-input"
              accept="image/*"
              onChange={handleProfilePhotoUpload}
              style={{ display: 'none' }}
            />
          </label>
          {isUploading && <p className="uploading-text">Uploading...</p>}
          {profileImageUrl && <img src={profileImageUrl} alt="Profile Preview" className="profile-preview" />}
        </div>

        <div className="form-group">
          <label htmlFor="first-name" className="form-label">First Name:</label>
          <input
            type="text"
            id="first-name"
            className="form-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="middle-name" className="form-label">middle Name:</label>
          <input
            type="text"
            id="last-name"
            className="form-input"
            value={middleName}
            onChange={(e) => setMName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email-address" className="form-label">Email Address:</label>
          <input
            type="email"
            id="email-address"
            className="form-input"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="username" className="form-label">Username:</label>
          <input
            type="text"
            id="surname"
            className="form-input"
            value={surName}
            onChange={(e) => setSurName(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading || isUploading}>
          {isLoading ? 'Updating...' : 'Update Info'}
        </button>
      </form>
    </div>
    </div>
  );
}

export default PersonalInformationUpdateForm;






import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../components/AuthContext/firebase';
import { useAuth } from '../../components/AuthContext/AuthContext';
import './EditProfilePage.css';

const EditProfilePage = () => {
  const { user } = useAuth(); 
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    mobile: '',
    pronouns: '',
    college: '',
    about: '',
    skills: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error('No such user!');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUser();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, userData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="edit-profile-page">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} required />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} required />
        </label>
        <label>
          Username:
          <input type="text" name="username" value={userData.username} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={userData.email} onChange={handleChange} required />
        </label>
        <label>
          Mobile:
          <input type="text" name="mobile" value={userData.mobile} onChange={handleChange} required />
        </label>
        <label>
          Pronouns:
          <input type="text" name="pronouns" value={userData.pronouns} onChange={handleChange} required />
        </label>
        <label>
          College:
          <input type="text" name="college" value={userData.college} onChange={handleChange} required />
        </label>
        <label>
          About:
          <textarea name="about" value={userData.about} onChange={handleChange} required></textarea>
        </label>
        <label>
          Skills:
          <textarea name="skills" value={userData.skills} onChange={handleChange} required></textarea>
        </label>
        <button type="submit">Update Details</button>
      </form>
    </div>
  );
};

export default EditProfilePage;

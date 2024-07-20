import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../components/CommunityForum/Firebase';
import { useAuth } from '../../components/AuthContext/AuthContext'; 
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

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

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        {user.photoURL && (
          <img src={user.photoURL} alt="Profile" className="profile-image" />
        )}
        <div className="profile-info">
          <h1>{`${userData.firstName} ${userData.lastName}`} <span>({userData.pronouns})</span></h1>
          <p>@{userData.username}</p>
          <p>{userData.college}</p>
          <Link to="/edit-profile" className="edit-profile-button">Edit Profile</Link>
        </div>
      </div>
      <div className="profile-sections">
        <div className="profile-section">
          <h2>About</h2>
          <p>{userData.about}</p>
        </div>
        <div className="profile-section">
          <h2>Skills</h2>
          <p>{userData.skills}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

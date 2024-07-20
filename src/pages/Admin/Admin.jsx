import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../components/CommunityForum/Firebase';
import './Admin.css';

const AdminPage = () => {
  const [eventRequests, setEventRequests] = useState([]);

  useEffect(() => {
    const fetchEventRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'eventRequests'));
        const requestsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEventRequests(requestsData);
      } catch (error) {
        console.error("Error fetching event requests: ", error);
      }
    };

    fetchEventRequests();
  }, []);

  const handleApprove = async (eventId) => {
    try {
      const eventDocRef = doc(db, 'eventRequests', eventId);
      const eventDoc = await getDoc(eventDocRef);
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        await addDoc(collection(db, 'events'), { ...eventData, approved: true });
        await deleteDoc(eventDocRef); 
        setEventRequests(eventRequests.filter(event => event.id !== eventId));
      }
    } catch (error) {
      console.error("Error approving event: ", error);
    }
  };

  const handleDeny = async (eventId) => {
    try {
      const eventDocRef = doc(db, 'eventRequests', eventId);
      await deleteDoc(eventDocRef); 
      setEventRequests(eventRequests.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Error denying event: ", error);
    }
  };

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
      <div className="event-requests">
        {eventRequests.map(event => (
          <div key={event.id} className="event-request-card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <button onClick={() => handleApprove(event.id)}>Approve</button>
            <button onClick={() => handleDeny(event.id)}>Deny</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;

import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, query, where, doc } from 'firebase/firestore';
import { db } from '../../components/CommunityForum/Firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; 
import './DashboardPage.css';

const DashboardPage = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [hostedEvents, setHostedEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const fetchEvents = async () => {
        try {
          // Fetch registered events
          const registeredEventsCollection = collection(db, 'users', currentUser.uid, 'registeredEvents');
          const registeredSnapshot = await getDocs(registeredEventsCollection);
          const registeredData = registeredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // Fetch hosted events
          const hostedQuery = query(collection(db, 'events'), where('organizerId', '==', currentUser.uid));
          const hostedSnapshot = await getDocs(hostedQuery);
          const hostedData = hostedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

          setRegisteredEvents(registeredData);
          setHostedEvents(hostedData);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };

      fetchEvents();
    }
  }, [currentUser]);

  const handleDelete = async (eventId) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      setHostedEvents(hostedEvents.filter((event) => event.id !== eventId));
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    }
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  const data = {
    labels: registeredEvents.map((event, index) => `Event ${index + 1}`),
    datasets: [
      {
        label: 'Registered Events',
        data: registeredEvents.map((_, index) => index + 1),
        borderColor: '#007bff',
        fill: false,
      },
      {
        label: 'Hosted Events',
        data: hostedEvents.map((_, index) => index + 1),
        borderColor: '#28a745',
        fill: false,
      },
    ],
  };

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      <div className="chart-container">
        <Line data={data} />
      </div>
      <div className="event-lists">
        <div className="event-list">
          <h3>Registered Events</h3>
          <div className="event-cards">
            {registeredEvents.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>{event.organizer}</p>
                <p>{event.location}</p>
                <p>{event.date}</p>
                <p>{event.prize}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="event-list">
          <h3>Hosted Events</h3>
          <div className="event-cards">
            {hostedEvents.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <button onClick={() => handleDelete(event.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

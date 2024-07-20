import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { doc, getDoc,deleteDoc } from 'firebase/firestore';
import { db } from '../../components/CommunityForum/Firebase';
import { getAuth } from 'firebase/auth';
import './EventDetails.css';

const EventDetails = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const history = useNavigate();
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    useEffect(() => {
      const fetchEvent = async () => {
        try {
          const eventDocRef = doc(db, 'events', eventId);
          const eventDoc = await getDoc(eventDocRef);
          if (eventDoc.exists()) {
            setEvent(eventDoc.data());
          } else {
            console.error('No such event!');
          }
        } catch (error) {
          console.error('Error fetching event details:', error);
        }
      };
  
      fetchEvent();
    }, [eventId]);
  
    const handleDelete = async () => {
      try {
        await deleteDoc(doc(db, 'events', eventId));
        alert('Event deleted successfully');
        history.push('/dashboard'); 
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please try again.');
      }
    };
  
    if (!event) {
      return <p>Loading...</p>;
    }
  
    return (
      <div className="event-details-page">
        <h1>Event Details </h1>
        <h1>{event.title}</h1>
        <p>Organizer: {event.organizer}</p>
        <p>Prize: {event.prize}</p>
        <p>Registered: {event.registered}</p>
        <p>Days Left: {event.daysLeft}</p>
        <p>Participation: {event.participation}</p>
        <p>Registration Deadline: {event.deadline}</p>
        <p>Impressions: {event.impressions}</p>
        <p>Tags: {event.tags.join(', ')}</p>
        <p>Description: {event.description}</p>
        {currentUser.uid === event.organizerId && (
        <button onClick={handleDelete}>Delete Event</button>
      )}
      </div>
    );
  };
  

export default EventDetails;

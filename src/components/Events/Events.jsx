import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, where, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../CommunityForum/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Events.css';
import { useNavigate } from 'react-router-dom';

const sampleEvents = [
  // Sample events
];

const Events = () => {
  const [events, setEvents] = useState(sampleEvents);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [filters, setFilters] = useState({ location: '', tags: [], status: '', sortBy: '' });
  const [user, setUser] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [registeringEventId, setRegisteringEventId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsQuery = query(collection(db, 'events'), where('approved', '==', true));
        const querySnapshot = await getDocs(eventsQuery);
        const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    const fetchRegisteredEvents = async (userId) => {
      try {
        const registeredEventsCollection = collection(db, 'users', userId, 'registeredEvents');
        const registeredEventsSnapshot = await getDocs(registeredEventsCollection);
        const registeredEventsData = registeredEventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRegisteredEvents(registeredEventsData);
      } catch (error) {
        console.error("Error fetching registered events: ", error);
      }
    };

    const fetchUser = () => {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          fetchRegisteredEvents(currentUser.uid);
        } else {
          setUser(null);
          setRegisteredEvents([]);
        }
      });
    };

    fetchEvents();
    fetchUser();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      if (!user) {
        alert("Please login to register.");
        return;
      }

      const event = events.find(event => event.id === eventId);
      if (!event) return;

      if (event.participation === 'Team') {
        setRegisteringEventId(eventId);
        setTeamMembers(Array(event.teamSize).fill(''));
      } else {
        await completeRegistration(eventId, event);
      }
    } catch (error) {
      console.error("Error registering for event: ", error);
    }
  };

  const completeRegistration = async (eventId, event) => {
    try {
      const userRegisteredEventsCollection = collection(db, 'users', user.uid, 'registeredEvents');
      const registrationData = event.participation === 'Team'
        ? { ...event, team: { name: teamName, members: teamMembers } }
        : event;
      
      await setDoc(doc(userRegisteredEventsCollection, eventId), registrationData);

      const eventDocRef = doc(db, 'events', eventId);
      const eventDoc = await getDoc(eventDocRef);
      if (eventDoc.exists()) {
        const newRegisteredCount = eventDoc.data().registered + 1;
        await updateDoc(eventDocRef, {
          registered: newRegisteredCount
        });

        setEvents(events.map(event => event.id === eventId ? { ...event, registered: newRegisteredCount } : event));
      }

      setRegisteredEvents([...registeredEvents, registrationData]);
      setRegisteringEventId(null); 
    } catch (error) {
      console.error("Error completing registration: ", error);
    }
  };

  const handleEventClick = async (eventId) => {
    try {
      const eventDocRef = doc(db, 'events', eventId);
      const eventDoc = await getDoc(eventDocRef);
      if (eventDoc.exists()) {
        const newImpressions = eventDoc.data().impressions + 1;
        await updateDoc(eventDocRef, {
          impressions: newImpressions
        });

        setEvents(events.map(event => event.id === eventId ? { ...event, impressions: newImpressions } : event));
      }

      navigate(`/event-details/${eventId}`);
    } catch (error) {
      console.error("Error updating impressions: ", error);
    }
  };

  const filterEvents = () => {
    return events.filter(event => {
      const matchesLocation = !filters.location || event.place.includes(filters.location);
      const matchesTags = filters.tags.length === 0 || filters.tags.every(tag => event.tags.includes(tag));
      const matchesStatus = !filters.status || (filters.status === 'ongoing' && new Date(event.endDate) > new Date()) || (filters.status === 'ended' && new Date(event.endDate) <= new Date());
      return matchesLocation && matchesTags && matchesStatus;
    });
  };

  const sortEvents = (filteredEvents) => {
    if (filters.sortBy === 'location') {
      return filteredEvents.sort((a, b) => a.place.localeCompare(b.place));
    } else if (filters.sortBy === 'category') {
      return filteredEvents.sort((a, b) => a.tags[0].localeCompare(b.tags[0]));
    }
    return filteredEvents;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
  };

  const handleSortChange = (sortBy) => {
    setFilters(prevFilters => ({ ...prevFilters, sortBy }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredEvents = sortEvents(filterEvents());
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  return (
    <div id='events' className="event-page">
      <h1>Events</h1>
      <div className="filters">
        <button onClick={() => handleSortChange('location')}>Sort By Location</button>
        
        <input 
          type="text" 
          placeholder="Filter by place" 
          onChange={(e) => handleFilterChange('location', e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Filter by tags (comma-separated)" 
          onChange={(e) => handleFilterChange('tags', e.target.value.split(','))} 
        />
      </div>
      <div className="event-list">
        {currentEvents.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-info" onClick={() => handleEventClick(event.id)}>
              <h3>{event.title}</h3>
              <p>{event.organizer}</p>
              <p className="event-prize">{event.prize}</p>
              <p>{event.registered} Registered</p>
              <div className="event-tags">
                {event.tags && event.tags.map(tag => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="event-actions">
              <p>Free</p>
              {!user ? (
                <p>Please login to register</p>
              ) : registeredEvents.some(e => e.id === event.id) ? (
                <p>You have registered</p>
              ) : (
                <button className="register-button" onClick={(e) => {
                  e.stopPropagation();
                  handleRegister(event.id);
                }}>Register</button>
              )}
            </div>
            <div className="event-details">
              <p>Registered: {event.registered}</p>
              <p>Registration Deadline: {event.deadline}</p>
              <p>Impressions: {event.impressions}</p>
              <p>Participation: {event.participation}</p>
            </div>
            {registeringEventId === event.id && event.participation === 'Team' && (
              <div className="team-registration">
                <input 
                  type="text" 
                  placeholder="Team Name" 
                  value={teamName} 
                  onChange={(e) => setTeamName(e.target.value)} 
                />
                {Array.from({ length: event.teamSize }, (_, index) => (
                  <input 
                    key={index} 
                    type="text" 
                    placeholder={`Team Member ${index + 1}`} 
                    value={teamMembers[index] || ''} 
                    onChange={(e) => {
                      const newTeamMembers = [...teamMembers];
                      newTeamMembers[index] = e.target.value;
                      setTeamMembers(newTeamMembers);
                    }} 
                  />
                ))}
                <button onClick={() => completeRegistration(event.id, event)}>Complete Registration</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Events;

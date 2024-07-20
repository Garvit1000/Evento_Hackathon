import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../components/CommunityForum/Firebase';
import './HostEventPage.css';
import { getAuth } from 'firebase/auth';

const CreateEventPage = () => {
  const [eventData, setEventData] = useState({
    title: '',
    organizer: '',
    prize: '',
    registered: 0,
    tags: '',
    participation: 'Individual',
    deadline: '',
    impressions: 0,
    description: '',
    place: '',
    startDate: '',
    endDate: '',
    rewards: '',
    teamSize: 1,
    status: 'pending'
  });

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'eventRequests'), {
        ...eventData,
        tags: eventData.tags.split(',').map((tag) => tag.trim()),
        registered: 0, 
        impressions: 0, 
        organizerId: currentUser.uid, 
      });
      alert('Event creation request sent for approval!');
      // Clear the form
      setEventData({
        title: '',
        organizer: '',
        prize: '',
        registered: 0,
        tags: '',
        participation: 'Individual',
        deadline: '',
        impressions: 0,
        description: '',
        place: '',
        startDate: '',
        endDate: '',
        rewards: '',
        teamSize: 1,
        status: 'pending'
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error creating event. Please try again.');
    }
  };

  return (
    <div className="create-event-page">
      <h2>Create an Event</h2>
      <form onSubmit={handleSubmit} className="create-event-form">
        <label>
          Event Title:
          <input type="text" name="title" value={eventData.title} onChange={handleChange} required />
        </label>
        <label>
          Organizer:
          <input type="text" name="organizer" value={eventData.organizer} onChange={handleChange} required />
        </label>
        <label>
          Prize:
          <input type="text" name="prize" value={eventData.prize} onChange={handleChange} required />
        </label>
        <label>
          Place:
          <input type="text" name="place" value={eventData.place} onChange={handleChange} required />
        </label>
        <label>
          Start Date:
          <input type="date" name="startDate" value={eventData.startDate} onChange={handleChange} required />
        </label>
        <label>
          End Date:
          <input type="date" name="endDate" value={eventData.endDate} onChange={handleChange} required />
        </label>
        <label>
          Rewards:
          <input type="text" name="rewards" value={eventData.rewards} onChange={handleChange} required />
        </label>
        <label>
          Tags (comma separated):
          <input type="text" name="tags" value={eventData.tags} onChange={handleChange} required />
        </label>
        <label>
          Participation Type:
          <select name="participation" value={eventData.participation} onChange={handleChange} required>
            <option value="Individual">Individual</option>
            <option value="Team">Team</option>
          </select>
        </label>
        {eventData.participation === 'Team' && (
          <label>
            Team Size (Max 4):
            <input
              type="number"
              name="teamSize"
              value={eventData.teamSize}
              onChange={handleChange}
              min="1"
              max="4"
              required
            />
          </label>
        )}
        <label>
          Registration Deadline:
          <input type="text" name="deadline" value={eventData.deadline} onChange={handleChange} required />
        </label>
        <label>
          Event Description:
          <textarea name="description" value={eventData.description} onChange={handleChange} required></textarea>
        </label>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEventPage;

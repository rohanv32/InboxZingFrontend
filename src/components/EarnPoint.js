// src/components/EarnPoints.js
import React, { useState } from 'react';
import api from '../api';  // Import your API helper

function EarnPoints({ username }) {
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState('');

  const handleEarnPoints = async () => {
    try {
      // Assume each action (e.g., reading an article) earns 10 points
      const earnedPoints = 10;
      const response = await api.post(`/earn_points/${username}`, { points: earnedPoints });

      setPoints(response.data.total_points);
      setMessage(`You earned ${earnedPoints} points! Total points: ${response.data.total_points}`);
    } catch (error) {
      setMessage('Error earning points. Try again!');
    }
  };

  return (
    <div>
      <h2>Earn Points</h2>
      <p>{message}</p>
      <button onClick={handleEarnPoints}>Earn Points</button>
      <p>Your current points: {points}</p>
    </div>
  );
}

export default EarnPoints;
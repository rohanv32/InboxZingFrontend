import React, { useState, useEffect } from 'react';

const EarnPoints = () => {
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [milestone, setMilestone] = useState(false);
  const [doublePoints, setDoublePoints] = useState(false);

  // Toggle double points event on weekends (Saturday and Sunday)
  useEffect(() => {
    const day = new Date().getDay();
    setDoublePoints(day === 6 || day === 0); // 6 is Saturday, 0 is Sunday
  }, []);

  // Handle article reading (simple point addition with streak and double points bonuses)
  const handleReadArticle = () => {
    let earnedPoints = 10; // Base points for reading an article

    // Apply streak bonus: +10% per day in a streak, max 50%
    if (streak > 0) {
      earnedPoints += Math.min(streak, 5) * 0.1 * earnedPoints;
    }

    // Apply double points if event is active
    if (doublePoints) {
      earnedPoints *= 2;
    }

    setPoints(points + earnedPoints);
    setStreak(streak + 1);

    // Check for milestone (example: 100 points milestone)
    if (!milestone && points + earnedPoints >= 100) {
      setMilestone(true);
      alert("Congrats! You reached 100 points!");
    }
  };

  // Reset streak if no article was read in a day
  useEffect(() => {
    const resetStreak = () => setStreak(0);
    const timer = setInterval(resetStreak, 24 * 60 * 60 * 1000); // Reset streak every 24 hours
    return () => clearInterval(timer); // Clear interval on component unmount
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Earn Points</h2>
      <p>Current Points: {points}</p>
      <p>Current Streak: {streak} day(s)</p>
      {doublePoints && <p>🎉 Double Points Event Active! 🎉</p>}
      <button onClick={handleReadArticle}>Read an Article (+10 Points)</button>
    </div>
  );
};

export default EarnPoints;
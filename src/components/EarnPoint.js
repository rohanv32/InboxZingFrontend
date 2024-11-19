import React from 'react';
import { useUserContext } from './UserContext';

const EarnPoints = () => {
  const { points, streak, doublePoints, earnPoints } = useUserContext();

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Earn Points</h2>
      <p>Current Points: {points}</p>
      <p>Current Streak: {streak} day(s)</p>
      {doublePoints && <p>🎉 Double Points Event Active! 🎉</p>}
      <button onClick={earnPoints}>Read an Article (+10 Points)</button>
    </div>
  );
};

export default EarnPoints;
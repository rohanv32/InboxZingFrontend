import React, { useEffect, useState } from 'react';

function Podcast({ username }) {
  const [podcastScript, setPodcastScript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      setError("Username not set. Please log in.");
      return;
    }

    const fetchPodcastScript = async () => {
      try {
        const response = await fetch(`/podcast_script/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch podcast script');
        }
        const data = await response.json();
        setPodcastScript(data.podcast_script || "No script generated.");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcastScript();
  }, [username]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading your podcast...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">Your Podcast</h1>

        <div className="space-y-6">
          {podcastScript ? (
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Podcast Script:</h2>
              <p className="text-sm text-gray-700">{podcastScript}</p>
            </div>
          ) : (
            <p className="text-center text-gray-500">No podcast script found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Podcast;
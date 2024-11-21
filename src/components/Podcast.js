import React, { useEffect, useState } from "react";

const Podcast = ({ username }) => {
    const [podcastScript, setPodcastScript] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPodcast = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/podcast_script/${username}`);
                if (!response.ok) {
                    throw new Error("Failed to generate podcast");
                }

                const data = await response.json();
                setPodcastScript(data.podcast_script);
                setAudioUrl(data.audio_url);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (username) {
            fetchPodcast();
        }
    }, [username]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-8 text-center bg-white rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-8">Podcast for {username}</h1>
                
                {isLoading ? (
                    <p className="text-lg">Loading your podcast...</p>
                ) : error ? (
                    <p className="text-red-500 mb-4">Error: {error}</p>
                ) : (
                    <>
                        <div className="podcast-script mb-6">
                            <h2 className="text-2xl font-semibold mb-4">Podcast Script</h2>
                            <p className="text-left">{podcastScript}</p>
                        </div>

                        <div className="podcast-audio mb-6">
                            <h2 className="text-2xl font-semibold mb-4">Audio</h2>
                            {audioUrl ? (
                                <audio controls className="w-full">
                                    <source src={audioUrl} type="audio/wav" />
                                    Your browser does not support the audio element.
                                </audio>
                            ) : (
                                <p className="text-gray-500">No audio available</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Podcast;
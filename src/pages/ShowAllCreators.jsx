import React, { useEffect, useState } from 'react';
import supabase from '../client';
import { Link } from 'react-router-dom';
import instagramWhiteImage from '../assets/instagramWhite.png';
import twitterWhiteImage from '../assets/twitterWhite.png';
import youtubeWhiteImage from '../assets/youtubeWhite.png';
import editImage from '../assets/edit.png';
import viewImage from '../assets/view.png';

const ShowAllCreators = () => {
  const [contentCreators, setContentCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContentCreators = async () => {
      try {
        const { data, error } = await supabase
          .from('creators')
          .select('*')
          .order('id', { ascending: true }); //prevent the order to change after the update

        if (error) throw error;

        setContentCreators(data || []);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchContentCreators();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div className="container">
      {contentCreators.length === 0 ? (
        <p style={{color: 'white'}}>No content creators found.</p>
      ) : (
        contentCreators.map((creator) => (
          <article key={creator.id} className="card">
            {creator.imageURL && (
              <div className="card-image-wrapper">
                <img
                  src={creator.imageURL}
                  alt={creator.name}
                  className="card-image"
                  onError={(e) => {
                    e.target.style.display = 'none'; // Hide the image on error
                  }}
                />
              </div>
            )}
            <div className="card-body">
              <div className="card-header">
                <h3>{creator.name}</h3>
                <div className="card-actions">
                  <Link to={`/view/${creator.id}`} className="action-link">
                    <img src={viewImage} alt="View" />
                  </Link>
                  <Link to={`/edit/${creator.id}`} className="action-link">
                    <img src={editImage} alt="Edit" />
                  </Link>
                </div>
              </div>
              <div className="social-links">
                {creator.youtube && (
                  <a href={creator.youtube} target="_blank" rel="noopener noreferrer" className="social-link">
                    <img src={youtubeWhiteImage} alt="YouTube" />
                  </a>
                )}
                {creator.instagram && (
                  <a href={creator.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                    <img src={instagramWhiteImage} alt="Instagram" />
                  </a>
                )}
                {creator.twitter && (
                  <a href={creator.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                    <img src={twitterWhiteImage} alt="Twitter" />
                  </a>
                )}
              </div>
              <p>{creator.description}</p>
            </div>
          </article>
        ))
      )}
    </div>
  );
};

export default ShowAllCreators;

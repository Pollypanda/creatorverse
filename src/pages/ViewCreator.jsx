import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../client';
import instagramImage from '../assets/instagramWhite.png';
import twitterImage from '../assets/twitterWhite.png';
import youtubeImage from '../assets/youtubeWhite.png';
import warningImage from '../assets/warning.png'


// Utility function to extract username from URL
const extractUsername = (url) => {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split('/').pop() || pathname.split('/').slice(-2)[0];
  } catch (error) {
    return 'unknown';
  }
};


const ViewCreator = () => {
  const { id } = useParams();

  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const { data, error } = await supabase
          .from('creators')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setCreator(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('creators')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      window.location.href = '/view-all';
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div className="view-wrapper">
      <div className="view-container">
        <div className="card-view-image">
          {creator && creator.imageURL ? (
            <img src={creator.imageURL} alt={creator.name} />
          ) : (
            <div className="placeholder">No Image Available</div>
          )}
        </div>
        <div className="view-additional-container">
          <h2>{creator.name}</h2>
          <p>{creator.description}</p>
          <div className="social-links">
            <ul>
              {creator.instagram && (
                <li>
                  <a href={creator.instagram} target="_blank" rel="noopener noreferrer">
                    <img src={instagramImage} alt="Instagram" />
                    @{extractUsername(creator.instagram)}
                  </a>
                </li>
              )}
              {creator.twitter && (
                <li>
                  <a href={creator.twitter} target="_blank" rel="noopener noreferrer">
                    <img src={twitterImage} alt="Twitter" />
                    @{extractUsername(creator.twitter)}
                  </a>
                </li>
              )}
              {creator.youtube && (
                <li>
                  <a href={creator.youtube} target="_blank" rel="noopener noreferrer">
                    <img src={youtubeImage} alt="YouTube" />
                    @{extractUsername(creator.youtube)}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="view-button">
        <Link to={`/edit/${id}`}>
          <button className="button">EDIT</button>
        </Link>
        <button className="button secondary" onClick={() => setIsModalOpen(true)} disabled={loading}>
          {loading ? 'Deleting...' : 'DELETE'}
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className='warning-title'><img src={warningImage}/> WAIT <img src={warningImage}/></h3>
            <p className='warning-message'>Are you sure you want to delete {creator && creator.name}?</p>
            <div className="modal-buttons">
              <button className="button secondary" onClick={handleDelete} disabled={loading}>
                {loading ? 'Deleting...' : 'YES, DELETE'}
              </button>
              <button className="button cancel" onClick={() => setIsModalOpen(false)}>
                NO, CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCreator;

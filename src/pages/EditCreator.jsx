import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../client';
import instagramImage from '../assets/instagram.png';
import twitterImage from '../assets/twitter.png';
import youtubeImage from '../assets/youtube.png';
import warningImage from '../assets/warning.png';

const EditCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [name, setName] = useState('');
  const [youtube, setYoutube] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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
        setName(data.name);
        setImageURL(data.imageURL || '');
        setDescription(data.description);
        setYoutube(data.youtube);
        setTwitter(data.twitter);
        setInstagram(data.instagram);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id]);

  const validateURL = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

  const formatURL = (url, platform) => {
    if (!url) return '';

    let formattedURL = url.trim();

    switch (platform) {
      case 'instagram':
        if (!formattedURL.startsWith('https://instagram.com/')) {
          formattedURL = `https://instagram.com/${formattedURL}`;
        }
        break;
      case 'twitter':
        if (!formattedURL.startsWith('https://twitter.com/')) {
          formattedURL = `https://twitter.com/${formattedURL}`;
        }
        break;
      case 'youtube':
        if (!formattedURL.startsWith('https://youtube.com/')) {
          formattedURL = `https://youtube.com/${formattedURL}`;
        }
        break;
      default:
        break;
    }

    return formattedURL;
  };

  const validateForm = () => {
    if (!name || !description) {
      setError('Name and description are required.');
      return false;
    }
    if (!validateURL(imageURL)) {
      setError('Invalid image URL.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formattedInstagram = formatURL(instagram, 'instagram');
    const formattedTwitter = formatURL(twitter, 'twitter');
    const formattedYoutube = formatURL(youtube, 'youtube');

    console.log('Formatted Instagram URL:', formattedInstagram);
    console.log('Formatted Twitter URL:', formattedTwitter);
    console.log('Formatted YouTube URL:', formattedYoutube);

    try {
      const { data, error } = await supabase
        .from('creators')
        .update({
          name,
          imageURL,
          description,
          youtube: formattedYoutube,
          twitter: formattedTwitter,
          instagram: formattedInstagram
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSuccess('Content creator updated successfully!');
      navigate('/view-all');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('creators')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSuccess('Content creator deleted successfully!');
      navigate('/view-all');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error}</p>;

  return (
    <article data-theme='light' className='add-creator-container'>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='name' style={{ fontWeight: 'bold' }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='imageURL' style={{ fontWeight: 'bold' }}>Image
            <p>Provide a link to the creator's image (include http://)</p>
          </label>
          <input
            type="url"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='description' style={{ fontWeight: 'bold' }}>Description
            <p>Describe the creator and what makes them interesting</p>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className='social-media-section'>
          <h6>SOCIAL MEDIA LINKS</h6>
          <p>Provide at least one of the creator's social media links</p>
        </div>
        <div className='form-group'>
          <label htmlFor='youtube' style={{ fontWeight: 'bold' }}>
            <img src={youtubeImage} alt='YouTube' /> YouTube
            <p>The creator's YouTube handle (without the @)</p>
          </label>
          <input
            type="text"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='twitter' style={{ fontWeight: 'bold' }}>
            <img src={twitterImage} alt='Twitter' /> Twitter
            <p>The creator's Twitter handle (without the @)</p>
          </label>
          <input
            type="text"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='instagram' style={{ fontWeight: 'bold' }}>
            <img src={instagramImage} alt='Instagram' /> Instagram
            <p>The creator's Instagram handle (without the @)</p>
          </label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>
        <div className='button-container'>
          <button type="submit" disabled={loading} className='update-button'>
            {loading ? 'Updating...' : 'UPDATE'}
          </button>
          <button type="button" onClick={openModal} disabled={loading} className='button secondary'>
            {loading ? 'Deleting...' : 'DELETE'}
          </button>
        </div>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h3 className='warning-title'><img src={warningImage} alt='Warning' /> WAIT <img src={warningImage} alt='Warning' /></h3>
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
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </article>
  );
};

export default EditCreator;

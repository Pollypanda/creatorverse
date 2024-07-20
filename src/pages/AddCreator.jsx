import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../client';
import instagramImage from '../assets/instagram.png';
import twitterImage from '../assets/twitter.png';
import youtubeImage from '../assets/youtube.png';

const AddCreator = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [youtube, setYoutube] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const formatURL = (handle, platform) => {
    if (!handle) return '';
    const baseURLs = {
      instagram: 'https://www.instagram.com/',
      twitter: 'https://twitter.com/',
      youtube: 'https://www.youtube.com/user/',
    };
    return baseURLs[platform] + handle;
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

  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
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

    try {
      const { data, error } = await supabase
        .from('creators')
        .insert([{ name, imageURL, description, youtube: formattedYoutube, twitter: formattedTwitter, instagram: formattedInstagram }]);

      if (error) {
        throw error;
      }

      setSuccess('Content creator added successfully!');
      setName('');
      setImageURL('');
      setDescription('');
      setYoutube('');
      setTwitter('');
      setInstagram('');

      navigate('/view-all');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article data-theme='light' className='add-creator-container'>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='name' style={{ fontWeight: 'bold' }}>Name</label>
          <input
            type="text"
            id="name"
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
            id="imageURL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='description' style={{ fontWeight: 'bold' }}>Description
            <p>Describe the creator and what makes them interesting</p>
          </label>
          <textarea
            id="description"
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
            id="youtube"
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
            id="twitter"
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
            id="instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>
        
        <button type="submit" disabled={loading} className='submit-button'>
          {loading ? 'Submitting...' : 'SUBMIT'}
        </button>
      </form>
      {error && <p className='error'>{error}</p>}
      {success && <p className='success'>{success}</p>}
    </article>
  );
};

export default AddCreator;

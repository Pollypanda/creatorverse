import { useEffect, useState } from 'react';
import { useRoutes, useNavigate } from 'react-router-dom';
import './App.css';
import AddCreator from './pages/AddCreator.jsx';
import EditCreator from './pages/EditCreator.jsx';
import ShowAllCreators from './pages/ShowAllCreators.jsx';
import ViewCreator from './pages/ViewCreator.jsx';
import supabase from './client';
import backgroundImage from './assets/background.png';

function App() {
  const navigate = useNavigate();
  const routes = useRoutes([
    { path: "/add-creator", element: <AddCreator /> },
    { path: "/view-all", element: <ShowAllCreators /> },
    { path: "/edit/:id", element: <EditCreator /> },
    { path: "/view/:id", element: <ViewCreator /> }
  ]);

  useEffect(() => {
    const fetchContentCreators = async () => {
      try {
        const { data, error } = await supabase
          .from('creators')
          .select('*');

        if (error) {
          throw error;
        }

        console.log('Fetched content creators:', data);

      } catch (error) {
        console.error('Error fetching content creators:', error.message);
      }
    };

    fetchContentCreators();
  }, []);

  const handleShowAll = () => {
    navigate('/view-all');
  };

  const handleAddCreator = () => {
    navigate('/add-creator');
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <img src={backgroundImage} alt="Background" />
          <h1>CREATORVERSE</h1>
          <button onClick={handleShowAll}>VIEW ALL CREATORS</button>
          <button onClick={handleAddCreator}>ADD A CREATOR</button>
        </div>
      </header>
      <div className="additional-content">
        <main>
          {routes}
        </main>
      </div>
    </div>
  );
}

export default App;

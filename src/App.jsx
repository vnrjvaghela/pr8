import React from 'react';
import ProfileCard from './ProfileCard';
import myPhoto from './assets/inner peace.jpg';

function App() {
  return (
    <div className="app">
      <ProfileCard
        name="Po"
        photo={myPhoto}
        bio="Noodles, don't Noodles"
      />
    </div>
  );
}

export default App;

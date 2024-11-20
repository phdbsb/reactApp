import React from 'react';
import { Navbar } from './components/Navbar';
import Exams from './components/Exams/Exams';

const App = () => {
  return (
    <div>
      <Navbar />
      <Exams />
    </div>
  );
};

export default App;
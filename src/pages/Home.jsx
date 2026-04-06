import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Process from '../components/Process';
import Stats from '../components/Stats';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Process />
      <Stats />
      <Contact />
    </>
  );
};

export default Home;

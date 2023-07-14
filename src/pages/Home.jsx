import React from 'react';
import CompaniesContainer from '../components/Companies/CompaniesContainer';
import PreventNav from '../components/Functions/Navigate';

const Home = () => {
  return (
    <>
      <PreventNav />
      <CompaniesContainer />
    </>
  );
}

export default Home;

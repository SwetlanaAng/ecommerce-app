import React from 'react';
import { TeammateCard } from '../../components/teammateCard/TeammateCard';
import './AboutUs.css';
import { gitInitTeam } from './gitInitNeam';
const { sveta, olya, elmira } = gitInitTeam;

const AboutUs: React.FC = () => {
  return (
    <div className="about-us-page">
      <h1>About us</h1>
      <h3>Meet Out GitInit Team</h3>
      <div className="team-cards-container">
        <TeammateCard
          name={sveta.name}
          role={sveta.role}
          img={sveta.img}
          text={sveta.text}
          contributions={sveta.contributions}
          gitLink={sveta.gitLink}
          education={sveta.education}
          languages={sveta.languages}
        />
        <TeammateCard
          name={olya.name}
          role={olya.role}
          img={olya.img}
          text={olya.text}
          contributions={olya.contributions}
          gitLink={olya.gitLink}
          education={olya.education}
          languages={olya.languages}
        />
        <TeammateCard
          name={elmira.name}
          role={elmira.role}
          img={elmira.img}
          text={elmira.text}
          contributions={elmira.contributions}
          gitLink={elmira.gitLink}
          education={elmira.education}
          languages={elmira.languages}
        />
      </div>
    </div>
  );
};

export default AboutUs;

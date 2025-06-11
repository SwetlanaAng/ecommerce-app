import React from 'react';
import { TeammateCard } from '../../components/teammateCard/TeammateCard';
import './AboutUs.css';
import { gitInitTeam } from './gitInitNeam';
const { sveta, olya, elmira } = gitInitTeam;
import logo from '../../assets/logo-rsschool.svg';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us-page">
      <h1>About us</h1>
      <h3>Meet Our GitInit Team</h3>
      <p className="description">
        Our three team members met for the first time and decided to collaborate on developing a new
        application. We worked together effectively by dividing tasks according to our skills and
        communicating regularly to stay aligned. Throughout the project, we supported each other,
        sharing ideas and providing encouragement, which strengthened our teamwork. Each of us
        contributed our unique talents and best qualities, which ultimately led to a successful
        outcome. This experience allowed us to grow both personally and professionally, showing us
        that collaboration and mutual support are key to achieving our goals.
      </p>
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

      <a href="https://rs.school/" target="_blank" className="rs">
        <div className="rsLogo">
          <img src={logo} alt="rs school logo" />{' '}
        </div>
      </a>
    </div>
  );
};

export default AboutUs;

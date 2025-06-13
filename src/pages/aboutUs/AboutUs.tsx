import React from 'react';
import { TeammateCard } from '../../components/teammateCard/TeammateCard';
import './AboutUs.css';
import { gitInitTeam } from './gitInitTeam';
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
        {Object.values(gitInitTeam).map(teammate => (
          <TeammateCard key={teammate.name} {...teammate} />
        ))}
      </div>

      <a href="https://rs.school/" target="_blank" className="rs" aria-label="schoolLogo">
        <div className="rsLogo">
          <img src={logo} alt="rs school logo" />{' '}
        </div>
      </a>
    </div>
  );
};

export default AboutUs;

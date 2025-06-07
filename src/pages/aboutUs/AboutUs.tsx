import React from 'react';
import { TeammateCard } from '../../components/teammateCard/TeammateCard';
import './AboutUs.css';
import Sveta from '../../assets/Sveta.jpg';
import Olya from '../../assets/Olya.png';
import Elmira from '../../assets/Elmira.jpeg';
const contributionsSveta: string[] = [
  'Developed the engaging "About Us" page.',
  'Set up the CommerceTools project and API client.',
  'Developed the user-friendly registration page.',
  'Created the interactive user profile page.',
  'Implemented pop-up notifications for user feedback and alerts.',
];

const AboutUs: React.FC = () => {
  return (
    <div className="about-us-page">
      <h1>About us</h1>
      <h3>Meet Out GitInit Team</h3>
      <div className="team-cards-container">
        <TeammateCard
          name="Sveta"
          role="Frontend Developer"
          img={Sveta}
          text={`A few years ago I decided to try myself in something new for me and promising, so I tried front-end development. I've hit the mark and feel the strength to develop in this direction,reach the goal to become a real professional`}
          contributions={contributionsSveta}
          gitLink="https://github.com/SwetlanaAng"
        />
        <TeammateCard
          name="Olya"
          role="Frontend Developer"
          img={Olya}
          text={`A few years ago I decided to try myself in something new for me and promising, so I tried front-end development. I've hit the mark and feel the strength to develop in this direction,reach the goal to become a real professional`}
          contributions={contributionsSveta}
          gitLink="https://github.com/SwetlanaAng"
        />
        <TeammateCard
          name="Elmira"
          role="Frontend Developer"
          img={Elmira}
          text={`A few years ago I decided to try myself in something new for me and promising, so I tried front-end development. I've hit the mark and feel the strength to develop in this direction,reach the goal to become a real professional`}
          contributions={contributionsSveta}
          gitLink="https://github.com/SwetlanaAng"
        />
      </div>
    </div>
  );
};

export default AboutUs;

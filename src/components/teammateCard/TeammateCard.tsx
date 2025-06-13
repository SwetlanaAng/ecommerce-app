import Button from '../button/Button';
import './TeammateCard.css';
import arrowDown from '../../assets/arrow_down.png';
import { useState } from 'react';

export interface TeammateCardProps {
  name: string;
  surname: string;
  role: string;
  img: string;
  text: string;
  contributions: string[];
  gitLink: string;
  education: string;
  languages: string[];
}

export const TeammateCard = ({
  name,
  surname,
  role,
  img,
  text,
  contributions,
  education,
  gitLink,
  languages,
}: TeammateCardProps) => {
  type AccordionSection = 'contributions' | 'education' | 'languages' | null;
  const [activeSection, setActiveSection] = useState<AccordionSection>(null);
  const toggleSection = (section: AccordionSection) => {
    setActiveSection(activeSection === section ? null : section);
  };
  return (
    <>
      <div className={`team-card`}>
        <div className="team-image">
          <img src={img} alt={name} />
        </div>
        <h3>{name}</h3>
        <h3>{surname}</h3>
        <h4 className="role">{role}</h4>
        <p>{text}</p>
        <div className="accordion">
          <div className="accordion-box" onClick={() => toggleSection('contributions')}>
            <h5>
              Contributions
              <img
                className={`arrow ${activeSection === 'contributions' ? 'active' : ''}`}
                src={arrowDown}
                alt="arrow-down"
              />
            </h5>
            <ul className={`contributions ${activeSection === 'contributions' ? 'active' : ''}`}>
              {contributions.map((contribution, index) => (
                <li key={index}>{contribution}</li>
              ))}
            </ul>
          </div>

          <div className="accordion-box" onClick={() => toggleSection('education')}>
            <h5>
              Education
              <img
                className={`arrow ${activeSection === 'education' ? 'active' : ''}`}
                src={arrowDown}
                alt="arrow-down"
              />
            </h5>
            <div className={`education ${activeSection === 'education' ? 'active' : ''}`}>
              <p>{education}</p>
            </div>
          </div>

          <div className="accordion-box" onClick={() => toggleSection('languages')}>
            <h5>
              Languages
              <img
                className={`arrow ${activeSection === 'languages' ? 'active' : ''}`}
                src={arrowDown}
                alt="arrow-down"
              />
            </h5>
            <ul className={`languages ${activeSection === 'languages' ? 'active' : ''}`}>
              {languages.map((language, index) => (
                <li key={index}>{language}</li>
              ))}
            </ul>
          </div>
        </div>
        <a href={gitLink} target="_blank" className="gh">
          <Button children="GitHub" />
        </a>
      </div>
    </>
  );
};

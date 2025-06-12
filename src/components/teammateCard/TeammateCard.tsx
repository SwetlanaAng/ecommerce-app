import Button from '../button/Button';
import './TeammateCard.css';
import arrowDown from '../../assets/arrow_down.png';
import { useState } from 'react';

export interface TeammateCardProps {
  name: string;
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
  role,
  img,
  text,
  contributions,
  education,
  gitLink,
  languages,
}: TeammateCardProps) => {
  const [isContributionActive, setIsContributionActive] = useState(false);
  const [isEducationActive, setIsEducationActive] = useState(false);
  const [isLanguagesActive, setIsLanguagesActive] = useState(false);
  function onContributionsClick() {
    setIsContributionActive(!isContributionActive);
    setIsEducationActive(false);
    setIsLanguagesActive(false);
  }
  function onEducationClick() {
    setIsContributionActive(false);
    setIsEducationActive(!isEducationActive);
    setIsLanguagesActive(false);
  }
  function onLanguagesClick() {
    setIsContributionActive(false);
    setIsEducationActive(false);
    setIsLanguagesActive(!isLanguagesActive);
  }
  return (
    <>
      <div className={`team-card`}>
        <div className="team-image">
          <img src={img} alt={name} />
        </div>
        <h3>{name}</h3>
        <h4 className="role">{role}</h4>
        <p>{text}</p>
        <div className="accordion">
          <div className="accordion-box" onClick={onContributionsClick}>
            <h5>
              Contributions
              <img
                className={`arrow ${isContributionActive ? 'active' : ''}`}
                src={arrowDown}
                alt="arrow-down"
              />
            </h5>
            <ol className={`contributions ${isContributionActive ? 'active' : ''}`}>
              {contributions.map((contribution, index) => (
                <li key={index}>{contribution}</li>
              ))}
            </ol>
          </div>

          <div className="accordion-box" onClick={onEducationClick}>
            <h5>
              Education
              <img
                className={`arrow ${isEducationActive ? 'active' : ''}`}
                src={arrowDown}
                alt="arrow-down"
              />
            </h5>
            <div className={`education ${isEducationActive ? 'active' : ''}`}>
              <p>{education}</p>
            </div>
          </div>

          <div className="accordion-box" onClick={onLanguagesClick}>
            <h5>
              Languages
              <img
                className={`arrow ${isLanguagesActive ? 'active' : ''}`}
                src={arrowDown}
                alt="arrow-down"
              />
            </h5>
            <ul className={`languages ${isLanguagesActive ? 'active' : ''}`}>
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

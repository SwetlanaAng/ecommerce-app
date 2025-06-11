import { Link } from 'react-router-dom';
import Button from '../button/Button';
import './TeammateCard.css';
import arrowDown from '../../assets/arrow_down.png';
import { useState } from 'react';
import arrowUp from '../../assets/arrow_up.png';

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
          <div
            className="accordion-box"
            onClick={() => setIsContributionActive(!isContributionActive)}
          >
            <h5>
              Contributions
              <img
                className="arrow"
                src={isContributionActive ? arrowUp : arrowDown}
                alt="arrow-down"
              />
            </h5>
            {isContributionActive && (
              <ol className="contributions ">
                {contributions.map((contribution, index) => (
                  <li key={index}>{contribution}</li>
                ))}
              </ol>
            )}
          </div>
          <div className="accordion-box" onClick={() => setIsEducationActive(!isEducationActive)}>
            <h5>
              Education
              <img
                className="arrow"
                src={isEducationActive ? arrowUp : arrowDown}
                alt="arrow-down"
              />
            </h5>
            {isEducationActive && <div className="education">{education}</div>}
          </div>
          <div className="accordion-box" onClick={() => setIsLanguagesActive(!isLanguagesActive)}>
            <h5>
              Languages
              <img
                className="arrow"
                src={isLanguagesActive ? arrowUp : arrowDown}
                alt="arrow-down"
              />
            </h5>
            {isLanguagesActive && (
              <ul className="languages">
                {languages.map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <Link to={gitLink}>
          <Button children="GitHub" />
        </Link>
      </div>
    </>
  );
};

import github from '../../assets/github.svg';
import './TeammateCard.css';

export interface TeammateCardProps {
  name: string;
  surname: string;
  role: string;
  img: string;
  text: string;
  contributions: string[];
  gitLink: string;
  teamLead?: boolean;
}

export const TeammateCard = ({
  name,
  surname,
  role,
  img,
  text,
  contributions,
  gitLink,
  teamLead,
}: TeammateCardProps) => {
  return (
    <div className="team-card">
      <div className="team-card-content">
        <div className="team-image">
          <img src={img} alt={name} />
        </div>
        <div className="team-info">
          <div className="team-info-header">
            <h4>
              {name} {surname}
            </h4>
            {teamLead && <div className="team-lead">Team Lead</div>}
          </div>
          <div className="role">{role}</div>
          <a href={gitLink} target="_blank" className="gh">
            <img src={github} alt="GitHub" />
            GitHub Profile
          </a>
        </div>
      </div>
      <div className="team-card-text">{text}</div>
      <div className="team-card-info">
        <div>What She Brought to the Recipe</div>
        <ul className="contributions">
          {contributions.map((contribution, index) => (
            <li key={index}>{contribution}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

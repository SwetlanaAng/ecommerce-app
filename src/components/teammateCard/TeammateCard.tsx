import { Link } from 'react-router-dom';
import Button from '../button/Button';
import './TeammateCard.css';

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
  gitLink,
}: TeammateCardProps) => (
  <>
    <div className={`team-card`}>
      <div className="team-image">
        <img src={img} alt={name} />
      </div>
      <h3>{name}</h3>
      <h4 className="role">{role}</h4>
      <p>{text}</p>
      <h4>Contributions</h4>
      <ol className="contributions">
        {contributions.map((contribution, index) => (
          <li key={index}>{contribution}</li>
        ))}
      </ol>
      <Link to={gitLink}>
        <Button children="GitHub" />
      </Link>
    </div>
  </>
);

import { TeammateCard } from '../../components/teammateCard/TeammateCard';
import { gitInitTeam } from './gitInitTeam';
import logo from '../../assets/logo-rsschool.svg';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us-page">
      <section className="about-us-page-content">
        <h1>
          Whisked with <span>Code</span>,<br />
          Glazed with <span>Passion</span>
        </h1>
        <p className="description">
          It started with three people, zero shared background, and one goal: build something real.
          Built during our RS School frontend course, this Macaron Store is more than a website—it's
          a product of learning, growth, and the determination to turn challenges into code.
        </p>
      </section>
      <section className="about-us-page-content-team">
        <h1>
          Meet the <span>Makers</span>
        </h1>
        <p className="description">Each member brings their own flavor to our recipe for success</p>
        <div className="team-cards-container">
          {Object.values(gitInitTeam).map(teammate => (
            <TeammateCard key={teammate.name} {...teammate} />
          ))}
        </div>
      </section>
      <section className="section about-us-page-content-communication">
        <h1> Dash of Communication, A Pinch of Support</h1>
        <p className="description">
          Despite living in different cities and time zones, our team synced like a perfect meringue
          whip. We worked in sprints, used GitHub for version control, divided tasks based on our
          strengths, and communicated daily
        </p>
        <div className="communication-cards-container">
          <div className="communication-card">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21M16 3.128C16.8578 3.35037 17.6174 3.85126 18.1597 4.55206C18.702 5.25286 18.9962 6.11389 18.9962 7C18.9962 7.88611 18.702 8.74714 18.1597 9.44794C17.6174 10.1487 16.8578 10.6496 16 10.872M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                stroke="#E7426D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h5>Team Sync</h5>
            <p>Daily standups across time zones</p>
          </div>
          <div className="communication-card">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 9C6.65685 9 8 7.65685 8 6C8 4.34315 6.65685 3 5 3C3.34315 3 2 4.34315 2 6C2 7.65685 3.34315 9 5 9ZM5 9V21M19 15C17.3431 15 16 16.3431 16 18C16 19.6569 17.3431 21 19 21C20.6569 21 22 19.6569 22 18C22 16.3431 20.6569 15 19 15ZM19 15V8C19 7.46957 18.7893 6.96086 18.4142 6.58579C18.0391 6.21071 17.5304 6 17 6H12M15 9L12 6M12 6L15 3"
                stroke="#E7426D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h5>Version Control</h5>
            <p>Git workflows & code reviews</p>
          </div>
          <div className="communication-card">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2V4M14 2V4M16 8C16.2652 8 16.5196 8.10536 16.7071 8.29289C16.8946 8.48043 17 8.73478 17 9V17C17 18.0609 16.5786 19.0783 15.8284 19.8284C15.0783 20.5786 14.0609 21 13 21H7C5.93913 21 4.92172 20.5786 4.17157 19.8284C3.42143 19.0783 3 18.0609 3 17V9C3 8.73478 3.10536 8.48043 3.29289 8.29289C3.48043 8.10536 3.73478 8 4 8H18C19.0609 8 20.0783 8.42143 20.8284 9.17157C21.5786 9.92172 22 10.9391 22 12C22 13.0609 21.5786 14.0783 20.8284 14.8284C20.0783 15.5786 19.0609 16 18 16H17M6 2V4"
                stroke="#E7426D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h5>Late Nights</h5>
            <p>Debugging sessions & breakthroughs</p>
          </div>
          <div className="communication-card">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.477 12.89L16.992 21.416C17.009 21.5164 16.9949 21.6196 16.9516 21.7118C16.9084 21.8039 16.838 21.8807 16.7499 21.9318C16.6619 21.9829 16.5603 22.0059 16.4588 21.9977C16.3573 21.9895 16.2607 21.9506 16.182 21.886L12.602 19.199C12.4292 19.0699 12.2192 19.0001 12.0035 19.0001C11.7878 19.0001 11.5778 19.0699 11.405 19.199L7.819 21.885C7.74032 21.9494 7.64386 21.9883 7.5425 21.9965C7.44113 22.0047 7.33967 21.9818 7.25166 21.9309C7.16365 21.8799 7.09328 21.8033 7.04992 21.7113C7.00656 21.6193 6.99229 21.5163 7.009 21.416L8.523 12.89M18 8C18 11.3137 15.3137 14 12 14C8.68629 14 6 11.3137 6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8Z"
                stroke="#E7426D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h5>Achievement</h5>
            <p>Delivered with pride</p>
          </div>
        </div>
      </section>
      <section className="section about-us-page-content-rs">
        <div>
          <h1>
            Powered by <span>Learning</span>
          </h1>
          <p>
            This project was created as part of our journey through The Rolling Scopes School's
            comprehensive frontend development course. RS School provided us with the foundation,
            mentorship, and community that helped us transform from learners into creators
          </p>
        </div>
        <a href="https://rs.school/" target="_blank" className="rs" aria-label="schoolLogo">
          <img src={logo} alt="rs school logo" />
        </a>
      </section>
    </div>
  );
};

export default AboutUs;

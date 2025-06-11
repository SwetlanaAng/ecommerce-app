import Sveta from '../../assets/Sveta.jpg';
import Olya from '../../assets/Olya.png';
import Elmira from '../../assets/Elmira.jpeg';
import { TeammateCardProps } from '../../components/teammateCard/TeammateCard';
interface GitInitTeam {
  [key: string]: TeammateCardProps;
}
export const gitInitTeam: GitInitTeam = {
  sveta: {
    name: 'Sveta',
    role: 'Frontend Developer',
    img: Sveta,
    text: 'Extremely self-disciplined, dedicated and hardworking. She is very active and always eager to contribute to our project. Additionally, she is highly responsible and attentive to details, making significant contributions during the testing phase of our product.',
    contributions: [
      'Developed the engaging "About Us" page.',
      'Set up the CommerceTools project and API client.',
      'Developed the user-friendly "Registration" page.',
      'Created the interactive "Profile" page.',
      'Implemented pop-up notifications for user feedback and alerts.',
    ],
    gitLink: 'https://github.com/SwetlanaAng',
    education: 'Saratov State Medical University - Faculty of Dentistry ',
    languages: ['Russian - native speaker', 'English - B2'],
  },
  olya: {
    name: 'Olya',
    role: 'Frontend Developer, TeamLead',
    img: Olya,
    text: 'Our team leader who is the heart of the project. She has poured her soul into this work and always demonstrates commitment and passion. As a team lead, she was always ready to help solve any issues, offer support, and tackle the most challenging tasks with enthusiasm and professionalism.',
    contributions: [
      'Developed environment configuration.',
      'Set up all products in the CommerceTools project.',
      'Wrote tests with Jest.',
      'Developed routing implementation.',
      'Implemented promo code feature.',
      'Created "Main", "Card", and "Catalog" pages.',
      'Implemented product filtering, sorting and searching.',
    ],
    gitLink: 'https://github.com/olya-us',
    education: 'Belarus State Economic University - Marketing Department',
    languages: ['Russian - native', 'English - Intermediate'],
  },
  elmira: {
    name: 'Elmira',
    role: 'Frontend Developer',
    img: Elmira,
    text: 'Incredibly reliable and trustworthy. You can always count on her to handle tasks independently. She willingly takes on responsibilities and successfully completes the assignments entrusted to her, demonstrating great initiative and dedication.',
    contributions: [
      'Created  a "Login" page for an application.',
      'Authored the comprehensive README file.',
      'Enabled detailed display of product information.',
      'Implemented efficient loading of products on catalog-page.',
      'Set up remove product from cart functionality.',
    ],
    gitLink: 'https://github.com/Lososel',
    education: 'Maqsut Narikbayev University, Astana, Kazakhstan - Business Administration in IT',
    languages: ['Russian - fluent', 'English - advanced (IELTS C1)', 'Kazakh - advanced'],
  },
};

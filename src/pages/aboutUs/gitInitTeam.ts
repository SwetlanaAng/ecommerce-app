import Sveta from '../../assets/Sveta.jpg';
import Olya from '../../assets/Olya.png';
import Elmira from '../../assets/Elmira.jpeg';
import { TeammateCardProps } from '../../components/teammateCard/TeammateCard';

interface GitInitTeam {
  [key: string]: TeammateCardProps;
}

export const gitInitTeam: GitInitTeam = {
  sveta: {
    name: 'Svetlana',
    surname: 'Angeliuk',
    role: 'Frontend Developer',
    img: Sveta,
    text: "Sveta brings laser-sharp attention to detail and a drive that never quits. Whether she's fine-tuning our forms or making the profile page feel like home, she's always a step ahead. Reliable, creative, and always pushing for polish.",
    contributions: [
      'Baked the “About Us” page you’re reading',
      'Set up the CommerceTools API',
      'Built Registration & Profile pages',
      'Developed notification pop-ups that delight',
    ],
    gitLink: 'https://github.com/SwetlanaAng',
  },
  olya: {
    name: 'Olga',
    surname: 'Us',
    role: 'Frontend Developer',
    img: Olya,
    teamLead: true,
    text: 'Olya led with heart and code. From sketching page logic to untangling complex filters, she brought leadership and depth to every task. Think of her as the perfect macaron base—stable, smooth, and essential.',
    contributions: [
      'Team leadership & task planning',
      'Main & Catalog pages, Product Card component',
      'Routing, filtering & promo code features',
      'Product setup in CommerceTools',
      'Environment setup & Jest testing',
      'Research, copywriting & UX/UI',
    ],
    gitLink: 'https://github.com/olya-us',
  },
  elmira: {
    name: 'Elmira',
    surname: 'Shainurova',
    role: 'Frontend Developer',
    img: Elmira,
    text: 'Dependable and fiercely capable, Elmira tackled functionality with flair. Her work on user login and cart features is seamless, and her README tied the whole box together. The kind of teammate who never drops the tray.',
    contributions: [
      'Login and Product page implementation',
      'README authoring',
      'Efficient product loading',
      'Product removal from cart functionality',
    ],
    gitLink: 'https://github.com/Lososel',
  },
};

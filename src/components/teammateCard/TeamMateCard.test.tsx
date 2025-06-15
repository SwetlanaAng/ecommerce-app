import { render, screen } from '@testing-library/react';
import { TeammateCard } from './TeammateCard';

describe('TeammateCard', () => {
  it('renders with required props', () => {
    render(
      <TeammateCard
        name="TestName"
        surname="TestSurname"
        role="TestRole"
        gitLink="https://github.com/SwetlanaAng"
        img="../../assets/Sveta.jpg"
        text="TestText"
        contributions={['TestContribution1', 'TestContribution2']}
      />
    );

    expect(screen.getByText('TestName TestSurname')).toBeInTheDocument();
    expect(screen.getByText('TestRole')).toBeInTheDocument();
    expect(screen.getByText('TestText')).toBeInTheDocument();
    expect(screen.getByText('TestContribution1')).toBeInTheDocument();
    expect(screen.getByText('TestContribution2')).toBeInTheDocument();
  });
  it('renders with required img', () => {
    render(
      <TeammateCard
        name="TestName"
        surname="TestSurname"
        role="TestRole"
        img="../../assets/Sveta.jpg"
        text="TestText"
        contributions={['TestContribution1', 'TestContribution2']}
        gitLink="https://github.com/SwetlanaAng"
      />
    );

    expect(screen.getByAltText('TestName')).toBeInTheDocument();
  });
  it('navigates to gitHub page when anchor is clicked', () => {
    render(
      <TeammateCard
        name="TestName"
        surname="TestSurname"
        role="TestRole"
        img="../../assets/Sveta.jpg"
        text="TestText"
        contributions={['TestContribution1', 'TestContribution2']}
        gitLink="https://github.com/SwetlanaAng"
      />
    );

    const anchor = screen.getByRole('link', { name: /GitHub/i });
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', 'https://github.com/SwetlanaAng');
  });
});

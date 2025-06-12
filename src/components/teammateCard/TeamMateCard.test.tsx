import { render, screen } from '@testing-library/react';
import { TeammateCard } from './TeammateCard';

describe('TeammateCard', () => {
  it('renders with required props', () => {
    render(
      <TeammateCard
        name="TestName"
        role="TestRole"
        img="../../assets/Sveta.jpg"
        text="TestText"
        contributions={['TestContribution1', 'TestContribution2']}
        gitLink="https://github.com/SwetlanaAng"
        education="TestEducation"
        languages={['TestLanguage1', 'TestLanguage2']}
      />
    );

    expect(screen.getByText('TestName')).toBeInTheDocument();
    expect(screen.getByText('TestRole')).toBeInTheDocument();
    expect(screen.getByText('TestText')).toBeInTheDocument();
    expect(screen.getByText('TestEducation')).toBeInTheDocument();
    expect(screen.getByText('TestContribution1')).toBeInTheDocument();
    expect(screen.getByText('TestContribution2')).toBeInTheDocument();
    expect(screen.getByText('TestLanguage1')).toBeInTheDocument();
    expect(screen.getByText('TestLanguage2')).toBeInTheDocument();
  });
  it('renders with required img', () => {
    render(
      <TeammateCard
        name="TestName"
        role="TestRole"
        img="../../assets/Sveta.jpg"
        text="TestText"
        contributions={['TestContribution1', 'TestContribution2']}
        gitLink="https://github.com/SwetlanaAng"
        education="TestEducation"
        languages={['TestLanguage1', 'TestLanguage2']}
      />
    );

    expect(screen.getByAltText('TestName')).toBeInTheDocument();
  });
  it('navigates to gitHub page when anchor is clicked', () => {
    render(
      <TeammateCard
        name="TestName"
        role="TestRole"
        img="../../assets/Sveta.jpg"
        text="TestText"
        contributions={['TestContribution1', 'TestContribution2']}
        gitLink="https://github.com/SwetlanaAng"
        education="TestEducation"
        languages={['TestLanguage1', 'TestLanguage2']}
      />
    );

    const anchor = screen.getByRole('link', { name: /GitHub/i });
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', 'https://github.com/SwetlanaAng');
  });
});

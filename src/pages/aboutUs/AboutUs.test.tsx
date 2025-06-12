import { render, screen } from '@testing-library/react';
import AboutUs from './AboutUs';

describe('AboutUs', () => {
  it('renders with required headers', () => {
    render(<AboutUs />);

    expect(screen.getByText('About us')).toBeInTheDocument();
    expect(screen.getByText('Meet Our GitInit Team')).toBeInTheDocument();
  });
  it('renders with required img logo', () => {
    render(<AboutUs />);

    expect(screen.getByAltText('rs school logo')).toBeInTheDocument();
  });
  it('navigates to rsSchool page when anchor is clicked', () => {
    render(<AboutUs />);

    const anchor = screen.getByRole('link', { name: 'schoolLogo' });
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', 'https://rs.school/');
  });
});

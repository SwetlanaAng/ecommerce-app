import { render, screen } from '@testing-library/react';
import { InfoBox } from './InfoBox';

describe('InfoBox', () => {
  it('renders with required props', () => {
    render(<InfoBox spanText="Test Label" />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with optional infoText', () => {
    render(<InfoBox spanText="Test Label" infoText="Test Info" />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Info')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<InfoBox spanText="Test Label" className="custom-class" />);

    const infoBox = screen.getByText('Test Label').parentElement;
    expect(infoBox).toHaveClass('custom-class');
    expect(infoBox).toHaveClass('info-box');
  });

  it('renders without infoText', () => {
    render(<InfoBox spanText="Test Label" />);

    const infoBox = screen.getByText('Test Label').parentElement;
    expect(infoBox?.textContent).toBe('Test Label');
  });
});

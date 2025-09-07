// React is imported automatically with JSX
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Disclaimer from '../Disclaimer';

describe('Disclaimer', () => {
  it('renders disclaimer with default icon', () => {
    render(<Disclaimer />);

    expect(screen.getByText('Important Disclaimer')).toBeInTheDocument();
    expect(screen.getByText(/This tool provides estimates only/)).toBeInTheDocument();
    expect(screen.getByText(/Consult an attorney/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Georgia Child Support Commission/ })
    ).toBeInTheDocument();
  });

  it('renders disclaimer without icon when showIcon is false', () => {
    render(<Disclaimer showIcon={false} />);

    expect(screen.getByText('Important Disclaimer')).toBeInTheDocument();
    // Should not have the alert-triangle icon
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Disclaimer className="custom-class" />);

    expect(container.firstChild).toHaveClass('usa-alert', 'usa-alert--warning', 'custom-class');
  });

  it('contains link to official calculator', () => {
    render(<Disclaimer />);

    const link = screen.getByRole('link', { name: /Georgia Child Support Commission/ });
    expect(link).toHaveAttribute('href', 'https://csc.georgiacourts.gov/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

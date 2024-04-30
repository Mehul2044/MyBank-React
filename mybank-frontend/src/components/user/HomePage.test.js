import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this line
import HomePage from './HomePage';

test('renders HomePage component without crashing', () => {
    render(<HomePage />);
});

test('renders title and subtitle', () => {
    render(<HomePage />);
    const title = screen.getByText(/Welcome to MyBank/i);
    const subtitle = screen.getByText(/Welcome to our bank, where we are committed to providing exceptional financial services to individuals, businesses, and communities. Our bank is built on a foundation of trust and reliability and with a team of professionals./i);
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
});
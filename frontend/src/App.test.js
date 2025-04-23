import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('redirects to login page by default', () => {
  render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
  );
  expect(screen.getByText(/Đăng Nhập/i)).toBeInTheDocument();
});
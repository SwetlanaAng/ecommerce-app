import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import { useEffect } from 'react';

const scrollToMock = jest.fn();
Object.defineProperty(window, 'scrollTo', {
  value: scrollToMock,
  writable: true,
});

const TestComponent = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/new-page');
  }, [navigate]);

  return null;
};

describe('ScrollToTop', () => {
  beforeEach(() => {
    scrollToMock.mockClear();
  });

  it('calls window.scrollTo on pathname change', async () => {
    render(
      <MemoryRouter initialEntries={['/initial']}>
        <ScrollToTop />
        <Routes>
          <Route path="*" element={<TestComponent />} />
        </Routes>
      </MemoryRouter>
    );

    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });
});

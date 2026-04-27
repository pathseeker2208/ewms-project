import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomThemeProvider, ColorModeContext } from '../../theme/ThemeContext';

// Helper component that consumes the ColorModeContext
const ThemeConsumer = () => {
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button onClick={toggleColorMode}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides "light" as the default theme mode', () => {
    render(
      <CustomThemeProvider>
        <ThemeConsumer />
      </CustomThemeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });

  it('toggles from light to dark when toggleColorMode is called', () => {
    render(
      <CustomThemeProvider>
        <ThemeConsumer />
      </CustomThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /toggle/i }));
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('toggles back to light from dark on second click', () => {
    render(
      <CustomThemeProvider>
        <ThemeConsumer />
      </CustomThemeProvider>
    );
    const btn = screen.getByRole('button', { name: /toggle/i });
    fireEvent.click(btn); // → dark
    fireEvent.click(btn); // → light
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });

  it('persists theme preference in localStorage with key "themeMode"', () => {
    render(
      <CustomThemeProvider>
        <ThemeConsumer />
      </CustomThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /toggle/i }));
    expect(localStorage.getItem('themeMode')).toBe('dark');
  });

  it('reads persisted "dark" theme from localStorage on initial render', () => {
    localStorage.setItem('themeMode', 'dark');
    render(
      <CustomThemeProvider>
        <ThemeConsumer />
      </CustomThemeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });
});

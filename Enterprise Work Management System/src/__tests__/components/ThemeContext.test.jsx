import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomThemeProvider, ColorModeContext } from '../../theme/ThemeContext';
import { useTheme } from '@mui/material/styles';

const TestComponent = () => {
  const { toggleColorMode } = useContext(ColorModeContext);
  const theme = useTheme();

  return (
    <div>
      <span data-testid="mode">{theme.palette.mode}</span>
      <button onClick={toggleColorMode}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders with default light theme', () => {
    render(
      <CustomThemeProvider>
        <TestComponent />
      </CustomThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('light');
  });

  it('toggles theme correctly', () => {
    render(
      <CustomThemeProvider>
        <TestComponent />
      </CustomThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'Toggle' });
    fireEvent.click(button);

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(localStorage.getItem('themeMode')).toBe('dark');
  });
});

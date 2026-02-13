import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Base64Tool from './Base64Tool';

// Mock Tauri invoke
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

describe('Base64Tool Component', () => {
  it('renders input and output areas', () => {
    render(<Base64Tool />);
    expect(screen.getByPlaceholderText(/Type or paste text to encode/i)).toBeInTheDocument();
    expect(screen.getByText(/Waiting for input/i)).toBeInTheDocument();
  });

  it('renders mode switch buttons', () => {
    render(<Base64Tool />);
    expect(screen.getByText('Encode')).toBeInTheDocument();
    expect(screen.getByText('Decode')).toBeInTheDocument();
  });
});

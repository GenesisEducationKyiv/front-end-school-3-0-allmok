import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GenreTag from '../components/GenreTag/GenreTag';

describe('GenreTag', () => {
  it('should render the genre name', () => {
    const genreName = 'Electronic';
    render(<GenreTag genre={genreName} />);

    // Checking if the genre text is displayed
    const tagElement = screen.getByText(genreName);
    expect(tagElement).toBeInTheDocument();

    // Checking for a base CSS class
    expect(tagElement).toHaveClass('genre-tag');
    expect(tagElement).toHaveClass('genre-electronic');
  });

  it('should sanitize genre names for CSS class', () => {
     render(<GenreTag genre="Synth Pop" />);
     const tagElement = screen.getByText("Synth Pop");
     expect(tagElement).toHaveClass('genre-synth-pop');

     render(<GenreTag genre="R&B" />);
     const tagElementRB = screen.getByText("R&B");
     expect(tagElementRB).toHaveClass('genre-rb'); 
  });
});
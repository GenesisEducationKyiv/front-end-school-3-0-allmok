import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TrackForm, { TrackFormData } from "../features/tracks/components/TrackForm";
import React from 'react';

vi.mock("../components/GenreTag/GenreTag", () => ({
  default: ({
    genre,
    onRemove,
  }: {
    genre: string;
    onRemove?: (g: string) => void;
  }) => (
    <span
      data-testid={`genre-tag-${genre}`}
      className={`genre-tag genre-${genre.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
    >
      {genre}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(genre)}
          aria-label={`Remove genre ${genre}`}
          data-testid={`remove-genre-${genre}`}
          style={{
            marginLeft: "5px",
            cursor: "pointer",
            border: "none",
            background: "none",
            color: "inherit",
          }}
        >
          x
        </button>
      )}
    </span>
  ),
}));

describe("TrackForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const availableGenres = ["Pop", "Rock", "Jazz", "Electronic"];

  const renderForm = (props: Partial<React.ComponentProps<typeof TrackForm>> = {}) => {
    const defaultProps: React.ComponentProps<typeof TrackForm> = {
      onSubmit: mockOnSubmit,
      onCancel: mockOnCancel,
      availableGenres: availableGenres,
      isLoading: false,
    };
    return render(<TrackForm {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks(); 
  });

  // testing

  it("should render all form fields correctly in create mode", () => {
    renderForm();
    expect(screen.getByTestId("track-form")).toBeInTheDocument();
    expect(screen.getByLabelText(/Track name \*/i)).toBeInTheDocument(); 
    expect(screen.getByLabelText(/Artist \*/i)).toBeInTheDocument(); 
    expect(screen.getByLabelText(/Album/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Link to the cover/i)).toBeInTheDocument();

    const genreSelector = screen.getByTestId("genre-selector");
    expect(within(genreSelector).getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add genre\(\+\)/i }) // Екрануємо +
    ).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toHaveTextContent(
      /Create Track/i,
    );
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByText(/No genre selected/i)).toBeInTheDocument();
  });

  it("should pre-populate fields in edit mode", () => {
    const initialData: Partial<TrackFormData> = {
      title: "Existing Title",
      artist: "Existing Artist",
      album: "Existing Album",
      coverImage: "http://example.com/cover.jpg",
      genres: ["Rock"],
    };
    renderForm({ initialData });

    expect(screen.getByTestId("input-title")).toHaveValue("Existing Title");
    expect(screen.getByTestId("input-artist")).toHaveValue("Existing Artist");
    expect(screen.getByTestId("input-album")).toHaveValue("Existing Album");
    expect(screen.getByTestId("input-cover-image")).toHaveValue(
      "http://example.com/cover.jpg",
    );
    expect(screen.getByTestId("submit-button")).toHaveTextContent(
      /Save Changes/i,
    );
    expect(screen.getByTestId("genre-tag-Rock")).toBeInTheDocument();
    expect(screen.queryByText(/No genre selected/i)).not.toBeInTheDocument();
  });

  it("should update input values on change", async () => {
    const user = userEvent.setup();
    renderForm();
    const titleInput = screen.getByTestId("input-title");
    await user.type(titleInput, "My New Song");
    expect(titleInput).toHaveValue("My New Song");

    const artistInput = screen.getByTestId("input-artist");
    await user.type(artistInput, "The Band");
    expect(artistInput).toHaveValue("The Band");

    const albumInput = screen.getByTestId("input-album");
    await user.type(albumInput, "The Album");
    expect(albumInput).toHaveValue("The Album");

    const coverInput = screen.getByTestId("input-cover-image");
    await user.type(coverInput, "http://new.com/img.png");
    expect(coverInput).toHaveValue("http://new.com/img.png");
  });

  it("should add and display selected genres", async () => {
    const user = userEvent.setup();
    renderForm();
    const genreSelector = screen.getByTestId("genre-selector");
    const genreSelect = within(genreSelector).getByRole("combobox");
    const addButton = screen.getByRole("button", { name: /Add genre\(\+\)/i });

    await user.selectOptions(genreSelect, "Pop");
    expect(addButton).not.toBeDisabled(); 
    await user.click(addButton);

    expect(await screen.findByTestId("genre-tag-Pop")).toBeInTheDocument();
    expect(within(genreSelect).queryByRole("option", { name: "Pop" })).not.toBeInTheDocument();
    expect(genreSelect).toHaveValue("");
    expect(addButton).toBeDisabled(); 

    await user.selectOptions(genreSelect, "Jazz");
    expect(addButton).not.toBeDisabled();
    await user.click(addButton);

    expect(await screen.findByTestId("genre-tag-Jazz")).toBeInTheDocument();
    expect(screen.getByTestId("genre-tag-Pop")).toBeInTheDocument();
    expect(within(genreSelect).queryByRole("option", { name: "Jazz" })).not.toBeInTheDocument();
    expect(genreSelect).toHaveValue("");
    expect(addButton).toBeDisabled();
  });

  it("should remove a genre when its remove button is clicked", async () => {
    const user = userEvent.setup();
    const initialData: Partial<TrackFormData> = {
      title: "Test",
      artist: "Test",
      genres: ["Rock", "Pop"],
    };
    renderForm({ initialData });

    expect(screen.getByTestId("genre-tag-Rock")).toBeInTheDocument();
    expect(screen.getByTestId("genre-tag-Pop")).toBeInTheDocument();

    const genreSelector = screen.getByTestId("genre-selector");
    const genreSelect = within(genreSelector).getByRole("combobox");

    expect(within(genreSelect).queryByRole("option", { name: "Rock" })).not.toBeInTheDocument();

    const removeRockButton = screen.getByTestId("remove-genre-Rock");
    await user.click(removeRockButton);

    expect(screen.queryByTestId("genre-tag-Rock")).not.toBeInTheDocument();
    expect(screen.getByTestId("genre-tag-Pop")).toBeInTheDocument(); 

    expect(
      await within(genreSelect).findByRole("option", { name: "Rock" })
    ).toBeInTheDocument();
  });

  it("should show validation errors for required fields on submit", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByTestId("submit-button"));

    expect(await screen.findByTestId("error-title")).toHaveTextContent(
      "Track name is required"
    );
    expect(screen.getByTestId("input-title")).toHaveAttribute("aria-invalid", "true"); 

    expect(await screen.findByTestId("error-artist")).toHaveTextContent(
      "Artist name is required"
    );
    expect(screen.getByTestId("input-artist")).toHaveAttribute("aria-invalid", "true"); 

    expect(await screen.findByTestId("error-genre")).toHaveTextContent(
      "Choose at least one genre"
    );

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should show validation error for invalid cover image URL", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.type(screen.getByTestId("input-title"), "Valid Title");
    await user.type(screen.getByTestId("input-artist"), "Valid Artist");
    const genreSelector = screen.getByTestId("genre-selector");
    const genreSelect = within(genreSelector).getByRole("combobox");
    await user.selectOptions(genreSelect, "Rock");
    await user.click(screen.getByRole("button", { name: /Add genre\(\+\)/i }));
    expect(await screen.findByTestId("genre-tag-Rock")).toBeInTheDocument();

    const coverInput = screen.getByTestId("input-cover-image");
    await user.type(coverInput, "not-a-valid-url");
    await user.click(screen.getByTestId("submit-button"));

    expect(await screen.findByTestId("error-cover-image")).toHaveTextContent(
      /Please enter a valid image link/i
    );
    expect(coverInput).toHaveAttribute("aria-invalid", "true"); 
    expect(mockOnSubmit).not.toHaveBeenCalled();

    await user.clear(coverInput);
    await user.type(coverInput, "http://example.com/document.pdf");
    await user.click(screen.getByTestId("submit-button"));

    expect(await screen.findByTestId("error-cover-image")).toHaveTextContent(
      /Please enter a valid image link/i
    );
     expect(coverInput).toHaveAttribute("aria-invalid", "true");
    expect(mockOnSubmit).not.toHaveBeenCalled();

    await user.clear(coverInput);
    await user.type(coverInput, "http://example.com/image.webp");
    await user.click(screen.getByTestId("submit-button"));

    expect(screen.queryByTestId("error-cover-image")).not.toBeInTheDocument();
    expect(coverInput).not.toHaveAttribute("aria-invalid", "true"); 
    expect(mockOnSubmit).toHaveBeenCalledTimes(1); 
  });

  it("should clear validation error when a required field is updated", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByTestId("submit-button")); 

    expect(await screen.findByTestId("error-title")).toBeInTheDocument();
    expect(await screen.findByTestId("error-artist")).toBeInTheDocument();

    const titleInput = screen.getByTestId("input-title");
    await user.type(titleInput, "A");

    await waitFor(() => {
      expect(screen.queryByTestId("error-title")).not.toBeInTheDocument();
    });
     expect(titleInput).not.toHaveAttribute("aria-invalid", "true"); 

    expect(screen.getByTestId("error-artist")).toBeInTheDocument();

    const artistInput = screen.getByTestId("input-artist");
    await user.type(artistInput, "B");

    await waitFor(() => {
      expect(screen.queryByTestId("error-artist")).not.toBeInTheDocument();
    });
    expect(artistInput).not.toHaveAttribute("aria-invalid", "true"); 
  });

  it("should clear genre validation error when a genre is added", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.type(screen.getByTestId("input-title"), "Title");
    await user.type(screen.getByTestId("input-artist"), "Artist");

    await user.click(screen.getByTestId("submit-button"));
    expect(await screen.findByTestId("error-genre")).toBeInTheDocument();

    const genreSelector = screen.getByTestId("genre-selector");
    const genreSelect = within(genreSelector).getByRole("combobox");
    const addButton = screen.getByRole("button", { name: /Add genre\(\+\)/i });
    await user.selectOptions(genreSelect, "Pop");
    await user.click(addButton);

    expect(await screen.findByTestId("genre-tag-Pop")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("error-genre")).not.toBeInTheDocument();
    });
  });

  it("should call onSubmit with correct data when form is valid", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByTestId("input-title"), "Awesome Song");
    await user.type(screen.getByTestId("input-artist"), "Super Band");
    await user.type(screen.getByTestId("input-album"), "Greatest Hits");
    await user.type(
      screen.getByTestId("input-cover-image"),
      "http://images.com/cover.png"
    );


    const genreSelector = screen.getByTestId("genre-selector");
    const genreSelect = within(genreSelector).getByRole("combobox");
    await user.selectOptions(genreSelect, "Electronic");
    await user.click(screen.getByRole("button", { name: /Add genre\(\+\)/i }));
    expect(await screen.findByTestId("genre-tag-Electronic")).toBeInTheDocument();

    await user.click(screen.getByTestId("submit-button"));

    expect(screen.queryByTestId("error-title")).not.toBeInTheDocument();
    expect(screen.queryByTestId("error-artist")).not.toBeInTheDocument();
    expect(screen.queryByTestId("error-genre")).not.toBeInTheDocument();
    expect(screen.queryByTestId("error-cover-image")).not.toBeInTheDocument();

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: "Awesome Song",
      artist: "Super Band",
      album: "Greatest Hits",
      coverImage: "http://images.com/cover.png",
      genres: ["Electronic"],
    });
  });

  it("should call onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("should disable Submit and Cancel buttons when isLoading is true", () => {
    renderForm({ isLoading: true });

    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-disabled", "true");
    expect(submitButton).toHaveTextContent('Saving...'); 

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    expect(cancelButton).toBeDisabled();
    expect(cancelButton).toHaveAttribute("aria-disabled", "true");

    const addButton = screen.getByRole("button", { name: /Add genre\(\+\)/i });
    expect(addButton).toBeDisabled();
  });

  it('should enable "Add Genre" button only when a genre is selected in the dropdown', async () => {
    const user = userEvent.setup();
    renderForm();

    const genreSelector = screen.getByTestId("genre-selector");
    const genreSelect = within(genreSelector).getByRole("combobox");
    const addButton = screen.getByRole("button", { name: /Add genre\(\+\)/i });

    expect(addButton).toBeDisabled();
    expect(genreSelect).toHaveValue(""); 


    await user.selectOptions(genreSelect, "Jazz");
    expect(genreSelect).toHaveValue("Jazz"); 

    expect(addButton).not.toBeDisabled(); 
    // "Add genre"
    await user.click(addButton);
    expect(await screen.findByTestId("genre-tag-Jazz")).toBeInTheDocument(); 
    expect(genreSelect).toHaveValue(""); 
    expect(addButton).toBeDisabled(); 
 
    await user.selectOptions(genreSelect, "Pop");
    expect(genreSelect).toHaveValue("Pop");
    expect(addButton).not.toBeDisabled(); 
  });


  it('should disable genre select and add button if all available genres are selected', async () => {
    const user = userEvent.setup();
    const limitedGenres = ["Pop", "Rock"];
    renderForm({ availableGenres: limitedGenres });

    const genreSelector = screen.getByTestId("genre-selector");
    const genreSelect = within(genreSelector).getByRole("combobox");
    const addButton = screen.getByRole("button", { name: /Add genre\(\+\)/i });

  
    await user.selectOptions(genreSelect, "Pop");
    await user.click(addButton);
    expect(await screen.findByTestId("genre-tag-Pop")).toBeInTheDocument();
    expect(within(genreSelect).queryByRole('option', { name: 'Pop'})).not.toBeInTheDocument();
    expect(addButton).toBeDisabled();

  
    await user.selectOptions(genreSelect, "Rock");
    await user.click(addButton);
    expect(await screen.findByTestId("genre-tag-Rock")).toBeInTheDocument();
    expect(within(genreSelect).queryByRole('option', { name: 'Rock'})).not.toBeInTheDocument();
    expect(addButton).toBeDisabled(); 
    expect(genreSelect).toBeDisabled();
    expect(within(genreSelect).queryAllByRole('option').length).toBe(1);
    expect(within(genreSelect).getByRole('option', { name: '-- Choose a genre --'})).toBeDisabled();

  });

});
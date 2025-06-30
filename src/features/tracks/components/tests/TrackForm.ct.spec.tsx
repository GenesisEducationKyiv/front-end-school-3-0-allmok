// import { test, expect } from '@playwright/experimental-ct-react';
// import TrackForm from '../TrackForm';
// import { TrackFormData } from '../TrackForm';

// const availableGenres = ['Electronic', 'Rock', 'Pop', 'Jazz', 'Classical'];

// test.describe('TrackForm Component Test', () => {
//   test('should fill and submit the form successfully in create mode', async ({ mount }) => {
//     let submittedData: TrackFormData | null = null as TrackFormData | null;
//     const handleSubmit = (data: TrackFormData) => {
//       submittedData = data;
//     };

//     const component = await mount(
//       <TrackForm onSubmit={handleSubmit} onCancel={() => {}} availableGenres={availableGenres} />
//     );

//     await component.getByTestId('input-title').fill('Solaris');
//     await component.getByTestId('input-artist').fill('Photonic');
//     await component.getByTestId('input-album').fill('Starlight');


//     await component.getByTestId('genre-selector').locator('select').selectOption('Electronic');
//     await component.getByRole('button', { name: 'Add genre(+)' }).click();

//     await expect(component.getByText('Electronic')).toBeVisible();

//     await component.getByTestId('submit-button').click();

//     await expect.poll(() => submittedData).not.toBeNull();
//   });


//   test('should display validation errors for required fields on submit', async ({ mount }) => {
//     let wasSubmitted = false;
//     const component = await mount(
//       <TrackForm onSubmit={() => { wasSubmitted = true; }} onCancel={() => {}} availableGenres={availableGenres} />
//     );

//     await component.getByTestId('submit-button').click();

//     await expect(component.getByTestId('error-title')).toBeVisible();
//     await expect(component.getByTestId('error-artist')).toBeVisible();
//     await expect(component.getByTestId('error-genre')).toBeVisible();

//     expect(wasSubmitted).toBe(false);

//     await component.getByTestId('input-title').fill('A title');
//     await component.getByTestId('submit-button').click();
//     await expect(component.getByTestId('error-title')).not.toBeVisible();
//     await expect(component.getByTestId('error-artist')).toBeVisible();
//   });

//   test('should disable controls when isLoading is true', async ({ mount }) => {
//     const component = await mount(
//       <TrackForm
//         onSubmit={() => {}}
//         onCancel={() => {}}
//         availableGenres={availableGenres}
//         isLoading={true}
//       />
//     );

//     await expect(component.getByTestId('submit-button')).toBeDisabled();
//     await expect(component.getByRole('button', { name: 'Cancel' })).toBeDisabled();
//     await expect(component.getByTestId('submit-button')).toHaveText('Saving...');
//   });

//   test('should call onCancel when the cancel button is clicked', async ({ mount }) => {
//     let cancelCalled = false;
//     const handleCancel = () => {
//       cancelCalled = true;
//     };
    
//     const component = await mount(
//       <TrackForm onSubmit={() => {}} onCancel={handleCancel} availableGenres={availableGenres} />
//     );

//     await component.getByRole('button', { name: 'Cancel' }).click();

//     expect(cancelCalled).toBe(true);
//   });
// });
import { test, expect } from '@playwright/experimental-ct-react';
import TrackForm from '../TrackForm';

const availableGenres = ['Electronic', 'Rock', 'Pop', 'Jazz', 'Classical'];


  test('should disable controls when isLoading is true', async ({ mount }) => {
    const component = await mount(
      <TrackForm
        onSubmit={() => {}}
        onCancel={() => {}}
        availableGenres={availableGenres}
        isLoading={true}
      />
    );

    await expect(component.getByTestId('submit-button')).toBeDisabled();
    await expect(component.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await expect(component.getByTestId('submit-button')).toHaveText('Saving...');
  });

  test('should call onCancel when the cancel button is clicked', async ({ mount }) => {
    let cancelCalled = false;
    const handleCancel = () => {
      cancelCalled = true;
    };
    
    const component = await mount(
      <TrackForm onSubmit={() => {}} onCancel={handleCancel} availableGenres={availableGenres} />
    );

    await component.getByRole('button', { name: 'Cancel' }).click();

    expect(cancelCalled).toBe(true);
  });;
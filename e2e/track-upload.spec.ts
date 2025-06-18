import { test, expect } from '@playwright/test';

const mockTracksList = [
  { 
      id: '1', 
      title: 'Living in a Ghost Town', 
      artist: 'The Rolling Stones', 
      album: 'Single',
      genres: ['Rock'], 
      duration: 247, 
      audioFile: null, 
      coverImage: null, 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
  },
  { 
      id: '2', 
      title: 'Blinding Lights', 
      artist: 'The Weeknd',
      album: 'After Hours',
      genres: ['Synth-pop'], 
      duration: 200, 
      audioFile: 'blinding_lights.mp3', 
      coverImage: 'http://localhost:8000/api/files/cover.jpg', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
  }
];

test.describe('Full Track Management Flow', () => {
  test.beforeEach(async ({ page }) => {
      await page.route('**/api/tracks**', (route) => {
          route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                  data: mockTracksList,
                  meta: { 
                      total: 2, 
                      page: 1, 
                      limit: 10,
                      totalPages: 1 
                  }
              }),
          });
      });
        
        await page.route('**/api/tracks/1/upload', async (route) => {
            const updatedTrack = { ...mockTracksList[0], audioFile: 'ghost_town_uploaded.mp3' };
            route.fulfill({ status: 200, body: JSON.stringify(updatedTrack) });
        });
    });

    test('should open upload modal, select a file, and submit', async ({ page }) => {
        const apiResponsePromise = page.waitForResponse('**/api/tracks**');

        await page.goto('/');

        await apiResponsePromise;

        const trackListContainer = page.locator('.track-list-container');
        await expect(trackListContainer).toBeVisible({ timeout: 10000 });

        const trackToUpload = trackListContainer.getByTestId('track-item-1');
        await expect(trackToUpload).toBeVisible();

        const uploadButton = trackToUpload.getByTestId('upload-track-1');
        await uploadButton.click();

        const modal = page.locator('.modal-content');
        await expect(modal).toBeVisible();

        await modal.getByTestId('input-audio-file').setInputFiles({
            name: 'test-ghost.mp3',
            mimeType: 'audio/mpeg',
            buffer: Buffer.from('e2e-audio-data'),
        });

        await modal.getByTestId('submit-upload-button').click();
        await expect(modal).not.toBeVisible();
    });
});
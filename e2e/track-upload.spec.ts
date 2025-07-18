import { test, expect } from '@playwright/test';
import type { Track } from '../src/types/track';

const mockTracksList: Partial<Track>[] = [
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
    updatedAt: new Date().toISOString(),
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
    updatedAt: new Date().toISOString(),
  },
];

interface GraphQLRequestBody {
  operationName: string;
  variables?: {
    id?: string;
    [key: string]: unknown;
  };
}

test.describe('Full Track Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/graphql', async (route) => {
      const requestBody = route.request().postDataJSON() as GraphQLRequestBody;

      if (requestBody.operationName === 'GetTracks') {
        console.log('Intercepted GetTracks operation.');
        return await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              tracks: {
                data: mockTracksList,
                meta: { total: 2, page: 1, limit: 10, totalPages: 1, __typename: 'Meta' },
                __typename: 'TracksResponse',
              },
            },
          }),
        });
      }

      if (requestBody.operationName === 'UpdateTrack' && requestBody.variables?.id === '1') {
        console.log('Intercepted UpdateTrack operation for track 1.');
        const updatedTrack = {
          ...mockTracksList[0],
          audioFile: 'ghost_town_uploaded.mp3',
          __typename: 'Track',
        };
        return await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: { updateTrack: updatedTrack },
          }),
        });
      }

      return await route.continue();
    });

    await page.route('**/api/upload', async (route) => {
      console.log('Intercepted file upload request to /api/upload.');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ filename: 'ghost_town_uploaded.mp3' }),
      });
    });
  });

test('should open upload modal, select a file, and submit', async ({ page }) => {
  const getTracksResponsePromise = page.waitForResponse((response) => 
    (response.url().includes('/graphql') && response.request().postData()?.includes('GetTracks')) ?? false
  );
  await page.goto('/');
  await getTracksResponsePromise;

  const trackToUpload = page.getByTestId('track-item-1');
  await expect(trackToUpload).toBeVisible({ timeout: 10000 });
  await trackToUpload.getByTestId('upload-track-1').click();

  const modal = page.getByTestId('upload-track-modal'); 
  await expect(modal).toBeVisible();

  await modal.getByTestId('file-input').setInputFiles({
    name: 'test-ghost.mp3',
    mimeType: 'audio/mpeg',
    buffer: Buffer.from('e2e-audio-data'),
  });

  const submitButton = modal.getByTestId('upload-button');

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/upload') && res.status() === 200),
    page.waitForResponse((res) => (res.request().postData()?.includes('UpdateTrack')) ?? false),
    page.waitForResponse((res) => (res.request().postData()?.includes('GetTracks')) ?? false),
    submitButton.click(),
  ]);

  await expect(modal).not.toBeVisible();
});
});
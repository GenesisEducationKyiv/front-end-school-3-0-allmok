import { test, expect } from "@playwright/experimental-ct-react";
import TrackForm from "../TrackForm";

const availableGenres = ["Electronic", "Rock", "Pop", "Jazz", "Classical"];

test("should call onCancel when the cancel button is clicked", async ({ mount }) => {
  let cancelCalled = false;
  const handleCancel = () => { cancelCalled = true; };

  const component = await mount(
    <TrackForm
      onSubmit={() => {}}
      onCancel={handleCancel}
      availableGenres={availableGenres}
      formId={"track-form-test"}
    />
  );

  const cancelButton = component.getByTestId('track-form-cancel-button');

  await cancelButton.waitFor({ state: 'attached', timeout: 10000 });
  
  await expect(cancelButton).toBeEnabled();
  await cancelButton.click();
  expect(cancelCalled).toBe(true);
  
});

test("should have correct text on submit button", async ({ mount }) => {
    const component = await mount(
      <TrackForm
        onSubmit={() => {}}
        onCancel={() => {}}
        availableGenres={availableGenres}
        formId={"track-form-test"}
        isLoading={false}
      />
    );
    const submitButton = component.getByTestId('track-form-submit-button');
    
    await submitButton.waitFor({ state: 'attached', timeout: 10000 });

    await expect(submitButton).toHaveText('Create');
});
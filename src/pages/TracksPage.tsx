import React from 'react';
import { TracksPageLayout } from '../components/TracksPageLayout';
import { TracksHeader } from '../components/TracksHeader';
import { TracksContent } from '../components/TracksContent';

const TracksPage: React.FC = () => {
  return (
    <TracksPageLayout
      header={<TracksHeader />}
      content={<TracksContent />}
    />
  );
};

export default TracksPage;
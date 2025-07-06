import React from 'react';
import '../css/TracksPage.css';

interface TracksPageLayoutProps {
  header: React.ReactNode;
  content: React.ReactNode;
}

export const TracksPageLayout: React.FC<TracksPageLayoutProps> = ({ header, content }) => {
  return (
    <div className="tracks-page">
      {header}
      <main>
        {content}
      </main>
    </div>
  );
};
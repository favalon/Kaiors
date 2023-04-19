// AccountPage.tsx
import React from 'react';

const AccountPage: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '3000px', border: 'none' }}>
      <iframe
        src="/account-page.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Account Page"
      />
      {/* The rest of the AccountPage component */}
    </div>
  );
};

export default AccountPage;
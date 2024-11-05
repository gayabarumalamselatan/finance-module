import React, { useState, useEffect } from "react";
import { userLoggin } from "../config/Constant";

const DashboardPr = () => {
  const [embedUrl, setEmbedUrl] = useState("");
  const userId = userLoggin();

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        const response = await fetch('http://localhost:3101/generate-embed-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dashboard: 2, // Ganti dengan ID dashboard yang sesuai
            requestor: [userId], // Menyertakan userId
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch embed URL');
        }

        const data = await response.json();
        setEmbedUrl(data.iframeUrl); // Mengatur embed URL dari respons
      } catch (error) {
        console.error('Error fetching embed URL:', error);
      }
    };

    fetchEmbedUrl();
  }, [userId]);

  if (!embedUrl) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="metabase-embed-container">
      <iframe
        src={embedUrl}
        frameBorder="0"
        width="100%"
        height="600px"
        allowTransparency
      />
    </div>
  );
};

export default DashboardPr;

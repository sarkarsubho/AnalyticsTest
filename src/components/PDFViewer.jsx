import React, { useEffect, useState } from "react";

const PDFViewer = ({ pdfUrl }) => {
  const [startTime, setStartTime] = useState(Date.now());
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    // Push open event
    window.dataLayer.push({
      event: "pdf_open",
      pdf_url: pdfUrl,
      open_time: new Date().toISOString()
    });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab inactive → pause timer
        const duration = Date.now() - startTime;
        setTotalDuration(prev => prev + duration);

        window.dataLayer.push({
          event: "pdf_hidden",
          pdf_url: pdfUrl,
          duration_so_far: Math.round((prev => prev + duration) / 1000)
        });
      } else {
        // Tab becomes active again
        setStartTime(Date.now());
        window.dataLayer.push({
          event: "pdf_visible",
          pdf_url: pdfUrl
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      const duration = totalDuration + (Date.now() - startTime);
      window.dataLayer.push({
        event: "pdf_close",
        pdf_url: pdfUrl,
        total_duration_seconds: Math.round(duration / 1000),
        close_time: new Date().toISOString()
      });

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pdfUrl, startTime, totalDuration]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        title="PDF Viewer"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
};

export default PDFViewer;

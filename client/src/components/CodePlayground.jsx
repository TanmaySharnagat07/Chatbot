import React, { useState, useEffect } from 'react';

export const CodePlayground = ({ initialCode }) => {
  const [iframeKey, setIframeKey] = useState(0); 

  useEffect(() => {
    setIframeKey(prevKey => prevKey + 1);
  }, [initialCode]); 

  return (
    <div className="code-playground">
      <div className="preview">
        <iframe
          key={iframeKey}  
          srcDoc={initialCode}
          title="Output"
          height={"400px"}
          width={"500px"}
          sandbox="allow-scripts"
          className="bg-white object-none"
        />
      </div>
    </div>
  );
};

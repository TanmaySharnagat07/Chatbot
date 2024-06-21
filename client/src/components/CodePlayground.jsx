import React, { useState, useEffect } from "react";

export const CodePlayground = ({ initialCode }) => {
  const [iframeSrcDoc, setIframeSrcDoc] = useState("");
  const [iframeKey, setIframeKey] = useState(0);
  useEffect(() => {
    setIframeSrcDoc(initialCode);
    setIframeKey((prevKey) => prevKey + 1);
  }, [initialCode]);

  return (
    <div className="code-playground">
      <div className="preview">
        <iframe
          key={iframeKey}
          srcDoc={iframeSrcDoc}
          title="Output"
          height={"400px"}
          width={"500px"}
          sandbox="allow-scripts"
          className="bg-white"
        />
      </div>
    </div>
  );
};

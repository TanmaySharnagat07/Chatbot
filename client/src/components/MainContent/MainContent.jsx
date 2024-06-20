import React, { useContext, useState, useEffect } from "react";
import { Client } from "@gradio/client";
import { assets } from "../../assets/img/assets";
import "./MainContent.css";
import { DataContext } from "../Context/Context";
import { MapComponent } from "../MapComponent";
import { CodePlayground } from "../CodePlayground";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
export const MainContent = () => {
  const handleDownloadPDF = async () => {
    const doc = new jsPDF("landscape"); // Set the PDF to landscape mode

    // Render message on the first page
    const messageLines = doc.splitTextToSize(`Message: ${message}`, 280); // Adjusted for landscape width
    doc.text(messageLines, 10, 10);

    // Add a new page for the HTML content
    doc.addPage();

    // Create an iframe to render the full HTML content
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    iframe.style.position = "absolute";
    iframe.style.top = "-10000px";
    iframe.style.width = "1000px";
    iframe.style.height = "500px";

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(htmlContent); // Assuming htmlContent contains full HTML including the map
    iframeDoc.close();

    // Wait for the iframe to load content
    iframe.onload = async () => {
      try {
        const canvas = await html2canvas(iframeDoc.body, { scale: 2 });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.addImage(imgData, "PNG", 10, 10, imgWidth - 20, imgHeight);

        doc.save("result.pdf");

        document.body.removeChild(iframe);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please try again.");

        // Clean up the iframe in case of error
        document.body.removeChild(iframe);
      }
    };
  };

  const {
    query,
    latMin,
    latMax,
    lonMin,
    lonMax,
    message,
    htmlContent,
    loading,
    showResult,
    error,
    searchHistory,
    setQuery,
    setLatMin,
    setLatMax,
    setLonMin,
    setLonMax,
    setError,
    setShowResult,
    setHtmlContent,
    setMessage,
    updateSearchHistory,
    setLoading,
  } = useContext(DataContext);

  const [resultsHistory, setResultsHistory] = useState([]);
  const [inputLatMin, setInputLatMin] = useState("");
  const [inputLatMax, setInputLatMax] = useState("");
  const [inputLonMin, setInputLonMin] = useState("");
  const [inputLonMax, setInputLonMax] = useState("");

  const getResponse = async () => {
    try {
      const client = await Client.connect(
        "TusharsinghBaghel/Data_Explorer_Agent"
      );
      const result = await client.predict("/predict", {
        query: query,
        lat_min: latMin,
        lat_max: latMax,
        long_min: lonMin,
        long_max: lonMax,
      });
      if (result) {
        return result;
      } else {
        throw new Error("No result data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const handleSearch = async () => {
    const latMinValue = inputLatMin || latMin;
    const latMaxValue = inputLatMax || latMax;
    const lonMinValue = inputLonMin || lonMin;
    const lonMaxValue = inputLonMax || lonMax;

    if (!latMinValue || !latMaxValue || !lonMinValue || !lonMaxValue) {
      alert("Please select an area on the map or input coordinates.");
      return;
    }

    setLatMin(latMinValue);
    setLatMax(latMaxValue);
    setLonMin(lonMinValue);
    setLonMax(lonMaxValue);

    setLoading(true);
    setShowResult(true);
    setError(null);

    try {
      const res = await getResponse();
      console.log(res);
      const newEntry = {
        query: query,
        latMin: latMinValue,
        latMax: latMaxValue,
        lonMin: lonMinValue,
        lonMax: lonMaxValue,
        htmlContent: res.data[0].html,
        message: res.data[0].message,
      };
      if (newEntry.htmlContent === undefined) {
        newEntry.htmlContent = "";
      }
      setHtmlContent(newEntry.htmlContent);
      setMessage(newEntry.message);

      updateSearchHistory([newEntry, ...searchHistory]);
      setResultsHistory([...resultsHistory, newEntry]);

      setShowResult(true);
      setQuery("");
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateRectangleCoordinates = ({ latMin, latMax, lonMin, lonMax }) => {
    setLatMin(latMin);
    setLatMax(latMax);
    setLonMin(lonMin);
    setLonMax(lonMax);
    setInputLatMin("");
    setInputLatMax("");
    setInputLonMin("");
    setInputLonMax("");
  };

  const renderWithLineBreaks = (text) => {
    return text.split("\n").map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
  };

  return (
    <>
      <div className="main">
        <div className="nav">
          <h1>Data Mode</h1>
        </div>
        <div className="main-container">
          <div className="response">
            <div className="api">
              {!showResult ? (
                <>
                  <div className="greet">
                    <p>
                      <span>Hello</span>
                    </p>
                    <p>How can I help you</p>
                  </div>
                </>
              ) : (
                <div className="result">
                  {resultsHistory.map((entry, index) => (
                    <div key={index} className="result-section">
                      <div className="result-title">
                        <img src={assets.user} alt="" />
                        <div className="query-box">
                          <p>{entry.query}</p>
                        </div>
                      </div>
                      <div className="result-data">
                        <p>{renderWithLineBreaks(entry.message)}</p>
                        {entry.htmlContent ? (
                          <>
                            <div className="code-display">
                              <div className="text">
                                <div className="border-text top">North</div>
                                <div className="border-text bottom">South</div>
                                <div className="border-text left">West</div>
                                <div className="border-text right">East</div>
                              </div>
                              <div className="content">
                                <div id="html-content">
                                  <CodePlayground
                                    initialCode={entry.htmlContent}
                                  />
                                </div>
                              </div>
                            </div>
                            <button onClick={handleDownloadPDF}>
                              Download PDF
                            </button>
                          </>
                        ) : (
                          <p className="text-sm text-red-400">No Maps</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <>
                      <div className="result-title">
                        <img src={assets.user} alt="" />
                        <p className="text-white">{query}</p>
                      </div>
                      <div className="loader">
                        <hr />
                        <hr />
                        <hr />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="map-comp">
              <div>
                <MapComponent
                  updateRectangleCoordinates={updateRectangleCoordinates}
                />
              </div>
              <div className="flex justify-center">
                <p>OR</p>
              </div>
              <div>
                <div className="coordinate-inputs">
                  <div className="input-row">
                    <div className="part">
                      <label>Lat Min:</label>
                      <input
                        type="number"
                        value={inputLatMin}
                        onChange={(e) => setInputLatMin(e.target.value)}
                      />
                    </div>
                    <div className="part">
                      <label>Lat Max:</label>
                      <input
                        type="number"
                        value={inputLatMax}
                        onChange={(e) => setInputLatMax(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="part">
                      <label>Lon Min:</label>
                      <input
                        type="number"
                        value={inputLonMin}
                        onChange={(e) => setInputLonMin(e.target.value)}
                      />
                    </div>
                    <div className="part">
                      <label>Lon Max:</label>
                      <input
                        type="number"
                        value={inputLonMax}
                        onChange={(e) => setInputLonMax(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="main-bottom">
            <div className="search-box">
              <input
                type="text"
                placeholder="Enter your Query Here"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <div onClick={handleSearch}>
                <img src={assets.send_icon} alt="Send" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

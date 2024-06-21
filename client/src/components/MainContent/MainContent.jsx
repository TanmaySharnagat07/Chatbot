import React, { useContext, useState, useEffect, useRef } from "react";
import { Client } from "@gradio/client";
import { assets } from "../../assets/img/assets";
import "./MainContent.css";
import { DataContext } from "../Context/Context";
import { MapComponent } from "../MapComponent";
import { CodePlayground } from "../CodePlayground";
import jsPDF from "jspdf";

export const MainContent = () => {
  const [hoverText, setHoverText] = useState("");

  const handleMouseEnter = (altText) => {
    setHoverText(altText);
  };

  const handleMouseLeave = () => {
    setHoverText("");
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(16);
    doc.text(`Area Statistics:`, 10, 10);
    doc.setFontSize(12);
    const messageLines = doc.splitTextToSize(message, 180);
    doc.text(messageLines, 10, 20);

    const lineHeight = doc.getLineHeight();
    const lastMessageY =
      messageLines.length > 0 ? messageLines.length * lineHeight +120 : 20;

    const htmlContentLink = `Click here to view the interactive map`;
    doc.setTextColor(0, 0, 255);
    doc.textWithLink(htmlContentLink, 10, lastMessageY + 10, {
      url: generateHtmlContentLink(),
    });

    doc.save("result.pdf");
  };

  const generateHtmlContentLink = () => {
  
    const file = new Blob([htmlContent], { type: "text/html" });

    return URL.createObjectURL(file);
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
  const [selectedMaps, setSelectedMaps] = useState([]);
  const [combinedHtmlContent, setCombinedHtmlContent] = useState("");

  const resultRef = useRef(null);

  const scrollToBottom = () => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  };

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
      // console.log(res);
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
    scrollToBottom();
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

  const handleMapSelection = (index) => {
    if (selectedMaps.includes(index)) {
      setSelectedMaps(selectedMaps.filter((i) => i !== index));
    } else {
      setSelectedMaps([...selectedMaps, index]);
    }
  };

  const combineSelectedMaps = () => {
    const combinedContent = selectedMaps
      .map((index) => resultsHistory[index].htmlContent)
      .join("");
    setCombinedHtmlContent(combinedContent);
    const newEntry = {
      query: "Combined Map of query 1:" + resultsHistory[0].query + " and query 2:" + resultsHistory[1].query,
      latMin: resultsHistory[selectedMaps[0]].latMin,
      latMax: resultsHistory[selectedMaps[0]].latMax,
      lonMin: resultsHistory[selectedMaps[0]].lonMin,
      lonMax: resultsHistory[selectedMaps[0]].lonMax,
      htmlContent: combinedContent,
      message: "This is a combined map.",
    };
    setResultsHistory([...resultsHistory, newEntry]);
    setSelectedMaps([]);
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
                <div className="result" ref={resultRef}>
                  
                  {resultsHistory.map((entry, index) => (
                    <div key={index} className="result-section">
                      <div className="result-title">
                        <div className="flex gap-4">
                          <img src={assets.user} alt="" className="h-10 mt-2" />
                          <div className="query-box">
                            <p>{entry.query}</p>
                          </div>
                        </div>
                        <div className="overlay-div">
                          <input
                            type="checkbox"
                            checked={selectedMaps.includes(index)}
                            onChange={() => handleMapSelection(index)}
                            className="text-xl"
                          />
                          Select for overlay
                        </div>
                      </div>
                      <div className="result-data">
                        <p>{renderWithLineBreaks(entry.message)}</p>
                        {entry.htmlContent ? (
                          <>
                            <div className="code-display">
                              <CodePlayground initialCode={entry.htmlContent} />
                            </div>

                            <button
                              onClick={handleDownloadPDF}
                              className="download-btn"
                            >
                              Download Now
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
              <div className="mr-3 icon-wrapper">
                <img
                  src={assets.combine_icon}
                  alt="Overlay"
                  onMouseEnter={() => handleMouseEnter("Overlay")}
                  onMouseLeave={handleMouseLeave}
                  onClick={combineSelectedMaps}
                  style={{
                    opacity: selectedMaps.length < 2 ? 0.5 : 1,
                    cursor: "pointer",
                  }}
                  disabled={selectedMaps.length < 2}
                />
                {hoverText === "Overlay" && (
                  <div className="hover-popup">{hoverText}</div>
                )}
              </div>
              <div className="icon-wrapper">
                <img
                  src={assets.send_icon}
                  alt="Send"
                  onMouseEnter={() => handleMouseEnter("Send")}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: "pointer" }}
                  onClick={handleSearch}
                />
                {hoverText === "Send" && (
                  <div className="hover-popup">{hoverText}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

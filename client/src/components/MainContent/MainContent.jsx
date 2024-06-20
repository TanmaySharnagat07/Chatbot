import React, { useContext, useState, useEffect } from "react";
import { Client } from "@gradio/client";
import { assets } from "../../assets/img/assets";
import "./MainContent.css";
import { DataContext } from "../Context/Context";
import { MapComponent } from "../MapComponent";
import { CodePlayground } from "../CodePlayground";

export const MainContent = () => {
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
    setError(true);

    try {
      const res = await getResponse();
      console.log(res)
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
                        <p className="text-white">{entry.query}</p>
                      </div>
                      <div className="result-data">
                        <p>{entry.message}</p>
                        {entry.htmlContent ? (
                          <>
                            <div className="code-display">
                              <div class="text">
                                <div class="border-text top">North</div>
                                <div class="border-text bottom">South</div>
                                <div class="border-text left">West</div>
                                <div class="border-text right">East</div>
                              </div>
                              <div class="content">
                                <div>
                                  <CodePlayground
                                    initialCode={entry.htmlContent}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
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
              <div className="flex justify-center mb-0">
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

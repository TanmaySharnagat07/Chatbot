import React, { createContext, useState } from "react";

// Create a context object
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [latMin, setLatMin] = useState("");
  const [latMax, setLatMax] = useState("");
  const [lonMin, setLonMin] = useState("");
  const [lonMax, setLonMax] = useState("");
  const [message, setMessage] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const updateSearchHistory = (newHistory) => {
    setSearchHistory(newHistory);
    localStorage.setItem("queryHistory", JSON.stringify(newHistory));
  };

  // Function to update chat details
  const updateChatDetails = (newChatDetails) => {
    setQuery(newChatDetails.query);
    setLatMin(newChatDetails.latMin);
    setLatMax(newChatDetails.latMax);
    setLonMin(newChatDetails.lonMin);
    setLonMax(newChatDetails.lonMax);
    setHtmlContent(newChatDetails.htmlContent);
    setMessage(newChatDetails.message);
    setShowResult(true);
  };

  // Value object to be passed to consumers
  const value = {
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
    setMessage,
    setHtmlContent,
    setShowResult,
    setSearchHistory,   
    updateSearchHistory,
    updateChatDetails,
    setLoading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

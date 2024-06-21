import React, { useState } from "react";
import { Client } from "@gradio/client";
import { useNavigate } from "react-router-dom";

export const Query = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [context, setContext] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMetadata, setExpandedMetadata] = useState(null);
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getResponse = async () => {
    try {
      const client = await Client.connect("TusharsinghBaghel/MECL_RAG");
      const result = await client.predict("/predict", { query: query });

      if (result) {
        return result;
      } else {
        throw new Error("No result data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Throw the error to be caught by the caller
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setShowResult(false);
    setError(null);

    try {
      const res = await getResponse();
      const newEntry = {
        query: query,
        answer: res.data[0].answer,
        context: res.data[0].context,
      };
      setAnswer(newEntry.answer);
      setContext(newEntry.context);
      setHistory((prevHistory) => [newEntry, ...prevHistory]);
      setShowResult(true);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
    setQuery("");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMetadata = (index) => {
    setExpandedMetadata(expandedMetadata === index ? null : index);
  };

  const getPartAfterMetadata = (str) => {
    // Find the start of metadata
    const metadataIndex = str.indexOf("metadata=");
    if (metadataIndex !== -1) {
      // Extract the metadata substring
      const metadataSubstring = str
        .substring(metadataIndex + "metadata=".length)
        .trim();

      // Replace single quotes with double quotes to make it valid JSON
      const metadataJSON = metadataSubstring.replace(/'/g, '"');

      // Parse the metadata JSON into an object
      const metadataObj = JSON.parse(metadataJSON);

      return metadataObj; // Return the parsed metadata object
    }
    return null;
  };

  const handleHistoryItemClick = (selectedEntry) => {
    setQuery(selectedEntry.query); // Set the selected query from history to the input field
    setAnswer(selectedEntry.answer);
    setContext(selectedEntry.context);
    setShowResult(true);
  };

  return (
    <>
      <div
        className={`flex w-screen h-screen bg-cover bg-center`}
        id="queryMode"
      >
        <div
          className={`fixed lg:relative top-0 left-0 w-52 h-full border-r-2 border-r-gray-500 dark:bg-gray-900 z-50 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:translate-x-0`}
        >
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Menu</h2>
            <button
              onClick={() => navigate("/")}
              className="py-2 px-4 mb-4 w-full bg-gray-500 text-white font-semibold rounded-full shadow-lg hover:bg-gray-600 transition duration-300"
            >
              Change Mode
            </button>
            {sidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="py-2 px-4 mb-4 w-full bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition duration-300 lg:hidden"
              >
                Back
              </button>
            )}
            <div>
              <h3 className="text-xl font-semibold mb-2">Search History</h3>
              <ul className="list-disc pl-5">
                {history.map((entry, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleHistoryItemClick(entry)}
                      className="text-blue-400 hover:underline focus:outline-none"
                    >
                      {entry.query}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex-1 flex flex-col justify-between items-center p-4 lg:ml-5">
            <div className="w-full max-w-[64rem]">
              <button
                onClick={toggleSidebar}
                className="mb-4 lg:hidden py-2 px-4 bg-gray-700 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 transition duration-300"
              >
                Menu
              </button>
              <h1
                id="titleOfQuery"
                className="text-6xl font-extrabold mb-6 text-blue-400"
              >
                Query Mode
              </h1>

              {error && (
                <div className="w-full p-4 mb-4 bg-red-200 text-red-800 rounded-lg">
                  {error}
                </div>
              )}
              {showResult && (
                <div className="w-full space-y-4 flex flex-wrap text-gray-700">
                  <div className="w-full p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">
                      Your Question
                    </h2>
                    <p>{query}</p>
                  </div>
                  {loading ? (
                    <>
                      <div className="loader">
                        <hr />
                        <hr />
                        <hr />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full lg:w-[60%] p-4 lg:mr-12 bg-white dark:bg-gray-700 rounded-lg shadow">
                        <div className="h-72 overflow-y-auto">
                          <h2 className="text-xl font-semibold mb-2 text-[#5BAEFE]">
                            Answer
                          </h2>
                          <p className="typewriter">{answer}</p>
                        </div>
                      </div>

                      <div className="w-full lg:w-[35%] p-4 mb-5 bg-white dark:bg-gray-700 rounded-lg shadow">
                        <div className="h-72 overflow-y-auto">
                          <details>
                            <summary className="text-xl font-semibold mb-2 text-[#3F2435]">
                              References
                            </summary>
                            <div>
                              {context.map((contextItem, index) => {
                                const metadata =
                                  getPartAfterMetadata(contextItem);
                                return (
                                  <div
                                    key={index}
                                    className="mb-4 border-b border-gray-200 pb-4"
                                  >
                                    <div
                                      onClick={() => toggleMetadata(index)}
                                      className="cursor-pointer flex justify-between items-center text-gray-500"
                                    >
                                      <span className="font-bold text-black">
                                        {index + 1}.
                                      </span>
                                      <div className="dropdown">
                                        <button className="dropbtn font-bold">
                                          Source
                                        </button>
                                        <div className="dropdown-content">
                                          <p>{metadata.source}</p>
                                        </div>
                                      </div>
                                      <div className="dropdown">
                                        <button className="dropbtn font-bold">
                                          Page
                                        </button>
                                        <div className="dropdown-content">
                                          <p>{metadata.page}</p>
                                        </div>
                                      </div>
                                    </div>
                                    {expandedMetadata === index && (
                                      <div className="mt-2">
                                        <h3 className="font-semibold mb-1">
                                          Page Content:
                                        </h3>
                                        <p>{contextItem}</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </details>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="w-full flex items-center max-w-[52rem] mb-6">
              <input
                type="text"
                placeholder="Enter your query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="h-12 text-black px-4 mt-4 w-full border-2 border-[#57A7FB] rounded-l-full focus:outline-none focus:border-[#2A1F3B]"
              />
              <button
                onClick={handleSearch}
                className="h-12 py-2 px-6 mt-4 bg-[#57A7FB] items-center text-white font-semibold rounded-r-full shadow-lg hover:bg-[#2A1F3B] transition duration-300"
              >
                <span>{loading ? "Searching..." : "Search"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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
  const navigate = useNavigate();

  const getResponse = async () => {
    try {
      const client = await Client.connect("TusharsinghBaghel/MECL_RAG");
      const result = await client.predict("/predict", { query: query });

      if (result) {
        console.log(result);
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
      const ans = JSON.parse(res);
      setAnswer(ans.data[0].answer);
      setContext(ans.data[0].context);
      setHistory((prevHistory) => [query, ...prevHistory]);
      setShowResult(true);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div
        className={`flex w-screen h-screen  bg-cover bg-center`}
        id="queryMode"
      >
        {/* Sidebar */}
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
                {history.map((item, index) => (
                  <ul key={index}>{item}</ul>
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
              <h1 id="titleOfQuery" className="text-6xl font-extrabold mb-6  text-blue-400">
                Query Mode
              </h1>

              {error && (
                <div className="w-full p-4 mb-4 bg-red-200 text-red-800 rounded-lg">
                  {error}
                </div>
              )}
              {showResult && (
                <div className="w-full space-y-4 flex flex-wrap">
                  <div className="w-full p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">
                      Your Question
                    </h2>
                    <p>{query}</p>
                  </div>
                  <div className="w-full lg:w-[60%] p-4 lg:mr-12 bg-white dark:bg-gray-700 rounded-lg shadow">
                    <div className="max-h-96 overflow-y-auto">
                      <h2 className="text-xl font-semibold mb-2">Answer</h2>
                      <p>{answer}</p>
                    </div>
                  </div>
                  <div className="w-full lg:w-[35%] p-4 mb-5 bg-white dark:bg-gray-700 rounded-lg shadow">
                    <div className="max-h-96 overflow-y-auto">
                      <details>
                        <summary className="text-xl font-semibold mb-2">
                          References
                        </summary>
                        <ul className="list-disc pl-5">
                          {context.map((item, index) => (
                            <p key={index}>
                              <div>
                                <details>
                                  <summary>Page Content {index + 1}</summary>
                                  <h4>{item.page_content}</h4>
                                </details>
                                <details className="bottom-1">
                                  <summary className="font-semibold">
                                    Metadata:
                                  </summary>
                                  <p>
                                    <span className="font-semibold">
                                      Source:
                                    </span>{" "}
                                    {item.metadata.source}
                                  </p>
                                  <p className="font-semibold">
                                    <span className="font-semibold">Page:</span>{" "}
                                    {item.metadata.page}
                                  </p>
                                </details>
                              </div>
                            </p>
                          ))}
                        </ul>
                      </details>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full flex items-center max-w-[52rem] mb-6">
              <input
                type="text"
                placeholder="Enter your query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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

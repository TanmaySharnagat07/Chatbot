import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Data = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  const handleQuery = () => {
    setResponse("Work in Progress");
    setShowResponse(true);
  };

  return (
    <>
      <div className="flex w-screen h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
        <div className="w-full  flex items-center justify-center h-full">
          <div className="h-full w-full bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg flex items-center flex-col justify-center p-8 rounded-xl shadow-lg">
            <h1 className="text-5xl font-extrabold mb-10 text-purple-700">Data Mode</h1>
            <input
              type="text"
              placeholder="Enter your query"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="p-3 text-gray-500 mb-6 w-full max-w-md border-2 border-purple-300 rounded-md focus:outline-none focus:border-purple-500 transition duration-300"
            />
            <button
              onClick={handleQuery}
              className="py-3 px-6 mb-8 bg-purple-700 text-white font-semibold rounded-full shadow-lg hover:bg-purple-800 transition duration-300"
            >
              Submit
            </button>
            {showResponse && (
              <div className="w-full max-w-md bg-white bg-opacity-90 p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-purple-700">Response</h2>
                <div className="flex justify-center items-center">
                  <img
                    className="h-28 w-40"
                    src="https://i.ibb.co/25n9W8B/work-in-progress.png"
                    alt="Work in Progress"
                  />
                </div>
                <p className="text-gray-700 text-center">{response}</p>
              </div>
            )}
            <button
              onClick={() => navigate("/")}
              className="mt-8 py-3 px-6 bg-gray-700 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 transition duration-300"
            >
              Change Mode
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

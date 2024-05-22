import React from "react";
import { useNavigate } from "react-router-dom";
export const Known = () => {
  const navigate = useNavigate();

  const goToNewPage = () => {
    navigate("/queryMode");
  };
  return (
    <>
      <div id="query">
        <div
          id="kExp"
          className="flex items-center justify-center min-h-screen p-6"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center animate-fade-in-up">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Knowledge Explorer
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Navigate through our expertly curated sections, visual aids, and
                interactive elements to explore geological surveys, geochemical
                analysis, drilling techniques, and more. Begin your journey into
                the depths of mineral exploration and uncover the secrets
                beneath the Earth's surface!
              </p>
              <button
                onClick={goToNewPage}
                className="bg-[#EDB379] hover:bg-[#944E22] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
              >
                Go to Knowledge Explorer
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="./src/assets/img/queryPage.png"
                alt="Chatbot"
                className="w-full h-auto max-w-xs md:max-w-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

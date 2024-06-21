import React, { useContext, useState } from "react";
import { assets } from "../../assets/img/assets";
import "./Sidebar.css";
import { DataContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const { searchHistory, updateSearchHistory, updateChatDetails } =
    useContext(DataContext);
  const [extended, setExtended] = useState(true);

  const newChat = () => {
    const newEntry = {
      query: "",
      latMin: "",
      latMax: "",
      lonMin: "",
      lonMax: "",
      htmlContent: "",
      message: "",
    };
    updateSearchHistory([newEntry, ...searchHistory]);
    updateChatDetails(newEntry);
  };

  const handleHistoryClick = (entry) => {
    updateChatDetails(entry);
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="sidebar">
        <div className="top">
          <img
            src={assets.menu_icon}
            className="menu"
            alt="menu-icon"
            onClick={() => {
              setExtended((prev) => !prev);
            }}
          />
          <div className="new-chat" onClick={newChat}>
            <img src={assets.plus_icon} alt="" />
            {extended && <p>New Chat</p>}
          </div>
          <div className="back" onClick={() => navigate("/")}>
            <img src={assets.back_icon} alt="" />
            {extended && <p>Back</p>}
          </div>
          {extended && (
            <div className="recent">
              <p className="recent-title">History</p>
              <ul className="search-history">
                {searchHistory.map((item, index) => (
                  <li key={index} className="history-item" onClick={() => handleHistoryClick(item)}>
                    {item.query}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="bottom">
          <div className="bottom-item recent-entry">
            <img src={assets.question_icon} alt="" />
            {extended && <p>Help</p>}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.setting_icon} alt="" />
            {extended && <p>Settings</p>}
          </div>
        </div>
      </div>
    </>
  );
};

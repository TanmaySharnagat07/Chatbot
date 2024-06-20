// data.jsx
import React from "react";
import { Sidebar } from "./Sidebar/Sidebar";
import { MainContent } from "./MainContent/MainContent";
import { DataProvider } from "./Context/Context";

export const Data = () => {
  return (
    <DataProvider>
      <div className="flex">
        <Sidebar />
        <MainContent />
      </div>
    </DataProvider>
  );
};

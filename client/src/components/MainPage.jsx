import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar } from "./NavBar";
import { Banner } from "./Banner";
import { Known } from "./Known";
import { DExplorer } from "./DExplorer";
import { CustomCursor } from "./Customize/CustomCursor";
export const MainPage = () => {
  return (
    
    <div className="App" >
      <CustomCursor />
      <NavBar />
      <section id="home">
        <Banner />
      </section>
      <div className="h-[50px] w-full bg-gradient-to-b from-[#121212] via-[#1B1619] to-[#000000] "></div>
      <section id="known">
        <Known />
      </section>
      <div className="h-[50px] w-full bg-gradient-to-b from-[#000000] via-[#171217] to-[#0B0F28] "></div>
      <section id="dexplorer">
        <DExplorer />
      </section>
    </div>
  );
};

import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar } from "./NavBar";
import { Banner } from "./Banner";
import { Known } from "./Known";
import { DExplorer } from "./DExplorer";

export const MainPage = () => {
  return (
    <div className="App">
      <NavBar />
      <section id="home">
        <Banner />
      </section>
      <section id="known">
        <Known />
      </section>
      <section id="dexplorer">
        <DExplorer />
      </section>
    </div>
  );
};

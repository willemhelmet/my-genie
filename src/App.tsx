import { Loader } from "@react-three/drei";
import { Route, Switch } from "wouter";
import { MainMenu } from "./components/ui/MainMenu.tsx";
import { useEffect } from "react";
import { socketManager } from "./services/socketManager";
import { World } from "./components/World.tsx";
import { GenerateScreen } from "./components/ui/screens/GenerateScreen.tsx";
import { ReviewScreen } from "./components/ui/screens/ReviewScreen.tsx";

function App() {
  // Initialize socket connection
  useEffect(() => {
    socketManager.connect();
    return () => {
      socketManager.disconnect();
    };
  }, []);

  return (
    <>
      <Switch>
        <Route path="/" component={MainMenu} />
        <Route path="/generate" component={GenerateScreen} />
        <Route path="/review" component={ReviewScreen} />
        <Route path="/world" component={World} />
      </Switch>
      <Loader />
    </>
  );
}
export default App;


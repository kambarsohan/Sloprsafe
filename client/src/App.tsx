import { Route, Switch } from "wouter";
import { Toaster } from "sonner";
import { AppProvider } from "./contexts/AppContext";
import AppShell from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import RiskMap from "./pages/RiskMap";
import Weather from "./pages/Weather";
import Sensors from "./pages/Sensors";
import Report from "./pages/Report";
import Admin from "./pages/Admin";
import LocationDetails from "./pages/LocationDetails";

function MainApp() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/map" component={RiskMap} />
        <Route path="/weather" component={Weather} />
        <Route path="/sensors" component={Sensors} />
        <Route path="/report" component={Report} />
        <Route path="/admin" component={Admin} />
        <Route path="/locations/:id" component={LocationDetails} />
        <Route><Dashboard /></Route>
      </Switch>
    </AppShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: "14px", border: "1px solid #dce5dd", background: "#fbfdf9", color: "#20312b" } }} />
    </AppProvider>
  );
}

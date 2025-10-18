import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Summary from "./pages/Summary";
import Brands from "./pages/Brands";
import BrandDetail from "./pages/BrandDetail";
import Personas from "./pages/Personas";
import Sentiment from "./pages/Sentiment";
import SentimentDetail from "./pages/SentimentDetail";
import DataSources from "./pages/DataSources";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/summary" component={Summary} />
          <Route path="/brands" component={Brands} />
          <Route path="/brands/:brandId" component={BrandDetail} />
          <Route path="/personas" component={Personas} />
          <Route path="/sentiment" component={Sentiment} />
          <Route path="/sentiment/:brandId" component={SentimentDetail} />
          <Route path="/data-sources" component={DataSources} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;


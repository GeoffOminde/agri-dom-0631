
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Route-level code splitting
const Index = lazy(() => import("./pages/Index"));
const ParcelsPage = lazy(() => import("./pages/ParcelsPage"));
const ParcelsDetailsPage = lazy(() => import("./pages/ParcelsDetailsPage"));
const CropsPage = lazy(() => import("./pages/CropsPage"));
const InventoryPage = lazy(() => import("./pages/InventoryPage"));
const FinancePage = lazy(() => import("./pages/FinancePage"));
const StatsPage = lazy(() => import("./pages/StatsPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
import { CRMProvider } from "./contexts/CRMContext";
import { StatisticsProvider } from "./contexts/StatisticsContext";
import { AppSettingsProvider, useAppSettings } from "./contexts/AppSettingsContext";
import { trackPageView } from "./utils/analytics";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import LoadingScreen from "./components/common/LoadingScreen";
import "./i18n";
import i18n from "./i18n";

// Define routes configuration with redirects (English primary, French legacy redirects)
const routes = [
  // Auth
  { path: "/login", element: <LoginPage /> },

  // Dashboard
  { path: "/", element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    )
  },
  { path: "/dashboard", element: <Navigate to="/" replace /> },

  // Parcels
  { path: "/parcels", element: (
      <ProtectedRoute>
        <ParcelsPage />
      </ProtectedRoute>
    )
  },
  { path: "/parcels/:id", element: (
      <ProtectedRoute>
        <ParcelsDetailsPage />
      </ProtectedRoute>
    )
  },

  // Crops
  { path: "/crops", element: (
      <ProtectedRoute>
        <CropsPage />
      </ProtectedRoute>
    )
  },

  // Inventory
  { path: "/inventory", element: (
      <ProtectedRoute>
        <InventoryPage />
      </ProtectedRoute>
    )
  },

  // Finance
  { path: "/finance", element: (
      <ProtectedRoute>
        <FinancePage />
      </ProtectedRoute>
    )
  },

  // Statistics
  { path: "/statistics", element: (
      <ProtectedRoute>
        <StatisticsProvider><StatsPage /></StatisticsProvider>
      </ProtectedRoute>
    )
  },

  // Reports and Settings (English)
  { path: "/reports", element: (
      <ProtectedRoute>
        <ReportsPage />
      </ProtectedRoute>
    )
  },
  { path: "/settings", element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    )
  },

  // Legacy French redirects
  { path: "/parcelles", element: <Navigate to="/parcels" replace /> },
  { path: "/parcelles/:id", element: <Navigate to="/parcels/:id" replace /> },
  { path: "/cultures", element: <Navigate to="/crops" replace /> },
  { path: "/inventaire", element: <Navigate to="/inventory" replace /> },
  { path: "/finances", element: <Navigate to="/finance" replace /> },
  { path: "/statistiques", element: <Navigate to="/statistics" replace /> },
  { path: "/rapports", element: <Navigate to="/reports" replace /> },
  { path: "/parametres", element: <Navigate to="/settings" replace /> },

  // 404
  { path: "*", element: <NotFound /> }
];

// Create query client with enhanced configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Router change handler component
const RouterChangeHandler = () => {
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Track page view for analytics
    const currentPath = window.location.pathname;
    const pageName = currentPath === '/' ? 'dashboard' : currentPath.replace(/^\//, '');
    trackPageView(pageName);
  }, [location.pathname]);
  
  return null;
};

// Keep i18next language in sync with AppSettings
const LocaleSync: React.FC = () => {
  const { settings: { locale } } = useAppSettings();
  useEffect(() => {
    const lang = (locale || 'en').split('-')[0];
    void i18n.changeLanguage(lang);
  }, [locale]);
  return null;
};

// Keep theme (dark mode) in sync with AppSettings
const ThemeSync: React.FC = () => {
  const { settings: { darkMode } } = useAppSettings();
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);
  return null;
};

// Application main component with properly nested providers
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppSettingsProvider>
        <CRMProvider>
          <BrowserRouter>
            <AuthProvider>
              <TooltipProvider>
                <RouterChangeHandler />
                <LocaleSync />
                <ThemeSync />
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    {routes.map((route) => (
                      <Route 
                        key={route.path} 
                        path={route.path} 
                        element={route.element} 
                      />
                    ))}
                  </Routes>
                </Suspense>
              </TooltipProvider>
            </AuthProvider>
          </BrowserRouter>
        </CRMProvider>
      </AppSettingsProvider>
    </QueryClientProvider>
  );
};

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CollegesPage from "./pages/CollegesPage";
import ProgramsPage from "./pages/ProgramsPage";
import AddCollegePage from "./pages/AddCollegePage";
import AddProgramPage from "./pages/AddProgramPage";
import CollegeDetailsPage from "./pages/CollegeDetailsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={<AuthGuard><DashboardPage /></AuthGuard>} />
            <Route path="/dashboard" element={<AuthGuard><DashboardPage /></AuthGuard>} />
            <Route path="/colleges" element={<AuthGuard><CollegesPage /></AuthGuard>} />
            <Route path="/colleges/new" element={<AuthGuard><AddCollegePage /></AuthGuard>} />
            <Route path="/colleges/:id" element={<AuthGuard><CollegeDetailsPage /></AuthGuard>} />
            <Route path="/programs" element={<AuthGuard><ProgramsPage /></AuthGuard>} />
            <Route path="/programs/new" element={<AuthGuard><AddProgramPage /></AuthGuard>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Profile from './pages/Profile';
import ApiAccess from './pages/ApiAccess';
import LiveDiscovery from './pages/LiveDiscovery';
import MarketFit from './pages/MarketFit';
import ConversationalPlanning from './pages/ConversationalPlanning';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Layout>
                    <Projects />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectDetails />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/api-access" element={
                <ProtectedRoute>
                  <Layout>
                    <ApiAccess />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/live-discovery" element={
                <ProtectedRoute>
                  <Layout>
                    <LiveDiscovery />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/conversational-planning" element={
                <ProtectedRoute>
                  <Layout>
                    <ConversationalPlanning />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/market-fit" element={
                <ProtectedRoute>
                  <Layout>
                    <MarketFit />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
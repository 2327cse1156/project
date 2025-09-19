import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BrowsePage } from './pages/BrowsePage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { ListingDetailPage } from './pages/ListingDetailPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/listing/:id" element={<ListingDetailPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-listing"
                element={
                  <ProtectedRoute>
                    <CreateListingPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <h1 className="text-4xl font-bold text-gray-900">404</h1>
                      <p className="text-gray-600">Page not found</p>
                      <button
                        onClick={() => window.history.back()}
                        className="text-blue-600 hover:text-blue-500 font-medium"
                      >
                        Go back
                      </button>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
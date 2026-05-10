import { Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './components/MainLayout'
import NotFound from './components/NotFound'

// Auth Pages
import Login from './pages/Login'
import Register from './pages/Register'
import ForgetPassword from './pages/ForgetPassword'
import ResetPassword from './pages/ResetPassword'

// App Pages
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import TripList from './pages/TripList'
import ItineraryBuilder from './pages/ItineraryBuilder'
import ItineraryView from './pages/ItineraryView'
import BudgetBreakdown from './pages/BudgetBreakdown'
import PackingChecklist from './pages/PackingChecklist'
import TripNotes from './pages/TripNotes'
import ActivitySearch from './pages/ActivitySearch'
import Profile from './pages/Profile'
import Community from './pages/Community'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes inside MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trips" element={<TripList />} />
            <Route path="/trips/create" element={<CreateTrip />} />
            <Route path="/trips/:tripId/itinerary" element={<ItineraryBuilder />} />
            <Route path="/trips/:tripId/itinerary/view" element={<ItineraryView />} />
            <Route path="/trips/:tripId/budget" element={<BudgetBreakdown />} />
            <Route path="/trips/:tripId/checklist" element={<PackingChecklist />} />
            <Route path="/trips/:tripId/notes" element={<TripNotes />} />
            <Route path="/activities" element={<ActivitySearch />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/community" element={<Community />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App

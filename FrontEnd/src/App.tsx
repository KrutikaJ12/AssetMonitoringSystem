import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import SiteManagerDashboard from "./pages/Dashboard/SiteManagerDashboard";
// import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import { RecentAlerts } from "./components/dashboard/RecentAlerts";
import OperatorDashboard from "./pages/Dashboard/OperatorDashboard";
import AssetAllocationTable from "./components/dashboard/AssetAllocationTable";
import AssetTable from "./pages/Assets/AssetTable";
import Reports from "./components/dashboard/Reports";
import ProtectedRoute from "./routes/ProtectedRoute";
import PermissionRoute from "./auth/PermissionRoute";
import ForbiddenPage from "./pages/OtherPage/ForbiddenPage";
import SiteAdmin from "./pages/Sites/SiteAdmin";
import UsersPage from "./pages/Users/UsersPage";
import OperatorsPage from "./pages/Operators/OperatorsPage";


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
         <Route
  path="/"
  element={<Navigate to="/signin" replace />}
/>
          {/* Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/forbidden"
              element={
                <ProtectedRoute>
                  <ForbiddenPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <PermissionRoute permission="DASHBOARD_VIEW">
                    <Home />
                  </PermissionRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/assets"
              element={
                <ProtectedRoute>
                  <PermissionRoute permission="ASSET_VIEW">
                    <AssetTable />
                  </PermissionRoute>
                </ProtectedRoute>
              }
            />
            
             <Route
              path="/admin/sites"
              element={
                <ProtectedRoute>
                  <PermissionRoute permission="SITE_VIEW">
                    <SiteAdmin/>
                  </PermissionRoute>
                </ProtectedRoute>
              }
            />
               <Route
              path="/admin/operators"
              element={
                <ProtectedRoute>
                  <PermissionRoute permission="OPERATOR_VIEW">
                    <OperatorsPage/>
                  </PermissionRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <PermissionRoute permission="USER_VIEW">
                    <UsersPage/>
                  </PermissionRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/alerts"
              element={
                <ProtectedRoute moduleCode="ALERTS">
                  <RecentAlerts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute>
                  <PermissionRoute permission="REPORT_VIEW">
                    <Reports />
                  </PermissionRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <PermissionRoute permission="USER_VIEW">
                    <UserProfiles />
                  </PermissionRoute>
                </ProtectedRoute>
              }
            />

            {/* <Route path="/admin" element={<AdminDashboard />} /> */}
            <Route path="/siteManager" element={<SiteManagerDashboard />} />
            <Route path="/operator" element={<OperatorDashboard />} />
            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

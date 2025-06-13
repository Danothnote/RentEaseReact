import { LoginPage } from "./auth/login/LoginPage";
import { ProfilePage } from "./auth/profile/ProfilePage";
import { SignupPage } from "./auth/signup/SignupPage";
import { Footer } from "./footer/Footer";
import { HomePage } from "./home/HomePage";
import { Navbar } from "./navbar/Navbar";
import { NewFlatPage } from "./newFlat/NewFlatPage";
import { AllFlatsPage } from "./allFlats/AllFlatsPage";
import { Route, Routes } from "react-router";
import { AuthProvider } from "./auth/context/AuthContext";
import { PrivateRouter } from "./router/PrivateRouter";
import { FlatView } from "./flatView/FlatView";
import { MyFlatsPage } from "./myFlats/MyFlatsPage";
import { AdminRouter } from "./router/AdminRouter";
import { AllUsersPage } from "./allUsers/AllUsersPage";
import { UserEditPage } from "./userEdit/UserEditPage";

export const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/*" element={<HomePage />} />
        <Route path="/allFlats" element={<AllFlatsPage />} />
        <Route path="/myFlats" element={<MyFlatsPage />} />
        <Route path="/flat/:flatId" element={<FlatView />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/allUsers"
          element={
            <AdminRouter>
              <AllUsersPage />
            </AdminRouter>
          }
        />
        <Route
          path="/allUsers/:profileId"
          element={
            <AdminRouter>
              <UserEditPage />
            </AdminRouter>
          }
        />
        <Route
          path="/newFlat"
          element={
            <PrivateRouter>
              <NewFlatPage />
            </PrivateRouter>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRouter>
              <ProfilePage />
            </PrivateRouter>
          }
        />
      </Routes>
      <Footer />
    </AuthProvider>
  );
};

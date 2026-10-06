import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/app/page";
import LoginPage from "@/app/login/page";
import AuthCallbackPage from "@/app/auth/callback/page";
import DashboardPage from "@/app/dashboard/page";
import OverviewPage from "@/app/dashboard/overview/page";
import SettingsPage from "@/app/dashboard/settings/page";
import ChatPage from "@/app/chat/[repoId]/page";
import QueryProvider from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
export default function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <ThemeProvider defaultTheme="system">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/overview" element={<OverviewPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/chat/:repoId" element={<ChatPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}

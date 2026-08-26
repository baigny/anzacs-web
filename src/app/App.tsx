import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { ProtectedRoute } from "@/features/auth/admin/ProtectedRoute";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProductsPage from "@/features/products/public/ProductsPage";
import KnowledgePage from "@/features/knowledge/public/KnowledgePage";
import KnowledgeArticlePage from "@/features/knowledge/public/KnowledgeArticlePage";

import LoginPage from "@/features/auth/admin/LoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import AdminProductsListPage from "@/features/products/admin/AdminProductsListPage";
import AdminProductFormPage from "@/features/products/admin/AdminProductFormPage";
import AdminKnowledgeListPage from "@/features/knowledge/admin/AdminKnowledgeListPage";
import AdminKnowledgeFormPage from "@/features/knowledge/admin/AdminKnowledgeFormPage";
import AdminTestimonialsPage from "@/features/testimonials/admin/AdminTestimonialsPage";
import AdminSiteCopyPage from "@/features/site-copy/admin/AdminSiteCopyPage";
import AdminEnquiriesPage from "@/features/enquiries/admin/AdminEnquiriesPage";
import AdminUsersPage from "@/features/auth/admin/AdminUsersPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/knowledge/:slug" element={<KnowledgeArticlePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Admin auth */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin panel (protected) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsListPage />} />
            <Route path="/admin/products/:id" element={<AdminProductFormPage />} />
            <Route path="/admin/knowledge" element={<AdminKnowledgeListPage />} />
            <Route path="/admin/knowledge/:id" element={<AdminKnowledgeFormPage />} />
            <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
            <Route path="/admin/site-copy" element={<AdminSiteCopyPage />} />
            <Route path="/admin/enquiries" element={<AdminEnquiriesPage />} />
          </Route>
        </Route>

        {/* root_admin only */}
        <Route element={<ProtectedRoute requireRole="root_admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/admins" element={<AdminUsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

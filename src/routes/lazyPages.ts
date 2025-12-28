import { lazy } from "react";

export const HomeUserPage = lazy(() => import("../pages/HomeUserPage"));
export const LoginPage = lazy(() => import("../pages/LoginPage"));
export const CreateSetPage = lazy(() => import("../pages/CreateSetPage"));
export const EditSetPage = lazy(() => import("../pages/EditSetPage"));
export const LibraryPage = lazy(() => import("../pages/LibraryPage"));
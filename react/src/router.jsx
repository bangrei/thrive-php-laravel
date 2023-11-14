import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./views/Login";
import Dashboard from './views/Dashboard';
import Users from './views/Users';
import UserForm from './views/UserForm';
import GuestLayout from "./components/GuestLayout";
import DefaultLayout from "./components/DefaultLayout";
import Signup from "./views/Signup";
import ErrorPage from "./views/404";
import Articles from "./views/Articles";
import ArticleForm from './views/ArticleForm';
import Chat from "./views/Chat";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Navigate to="/dashboard" />,
                errorElement: <ErrorPage />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/chat",
                element: <Chat/>
            },
            {
                path: "/articles",
                element: <Articles />,
            },
            {
                path: "/article/new",
                element: <ArticleForm />,
            },
            {
                path: "/article/:id",
                element: <ArticleForm />,
            },
            {
                path: "/users",
                element: <Users />,
            },
            {
                path: "/user/new",
                element: <UserForm />,
            },
            {
                path: "/user/:id",
                element: <UserForm />,
            },
            {
                path: "*",
                element: <ErrorPage />,
            },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/",
                element: <Navigate to="/login" />,
                errorElement: <ErrorPage />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
        ],
    },
]);

export default router;

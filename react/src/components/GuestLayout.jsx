import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestLayout = () => {
    const token = useSelector((state) => state.user.token);
    if (token) return <Navigate to="/dashboard" />;

    return (
        <div className="layout">
            <Outlet />
        </div>
    );
}
export default GuestLayout;

import { useEffect, useState } from "react";
import {
    Link,
    Navigate,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, logout } from "../redux/actions/userAction.js";
import api from "../api";

const DefaultLayout = () => {
    const token = useSelector((state) => state.user.token);
    if (!token) return <Navigate to="/login" />;

    const user = useSelector((state) => state.user.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fold, setFold] = useState(false);

    const location = useLocation();
    const currentPage = location.pathname;

    const onLogout = async (ev) => {
        ev.preventDefault();
        setLoading(true);
        await api.post("/logout")
            .then(({ data }) => {
                setLoading(false);
                if (!data.logout) return;
                dispatch(logout());
                navigate("/login");
            })
            .catch((error) => {
                setLoading(false);
            });
    };

    const loadUser = async () => {
        setLoading(true);
        const data = await api
            .get("/user")
            .then(({ data }) => {
                return data;
            })
            .catch((err) => {
                return err;
            });
        dispatch(setUser({ user: data }));
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }

    useEffect(() => {
        loadUser();
    }, []);
    return (
        <div className="layout">
            <aside className={fold ? "folded" : ""}>
                <div className="title">Thrive App</div>
                <div className="nav">
                    <Link
                        to="/dashboard"
                        className={
                            currentPage == "/dashboard" ? "active" : "no"
                        }
                    >
                        <small className="material-icons-outlined">
                            widgets
                        </small>
                        Dashboard
                    </Link>
                    <Link
                        to="/chat"
                        className={currentPage == "/chat" ? "active" : "no"}
                    >
                        <small className="material-icons-outlined">
                            people_alt
                        </small>
                        Chat
                    </Link>
                    <Link
                        to="/articles"
                        className={currentPage == "/articles" ? "active" : "no"}
                    >
                        <small className="material-icons-outlined">
                            card_membership
                        </small>
                        Articles
                    </Link>
                    {user && user.role == "Super Admin" && (
                        <Link
                            to="/users"
                            className={
                                currentPage.indexOf("/users") > -1
                                    ? "active"
                                    : "no"
                            }
                        >
                            <small className="material-icons-outlined">
                                person_search
                            </small>
                            Users
                        </Link>
                    )}
                </div>
            </aside>
            <div className="content">
                <header className={fold ? "folded" : ""}>
                    <div className="header-left" onClick={() => setFold(!fold)}>
                        <small className="burger material-icons-outlined">
                            menu
                        </small>{" "}
                        Dashboard
                    </div>
                    <div className="user-con">
                        <span>Hi, {user?.name}</span>
                        <a
                            href="#"
                            onClick={(ev) => onLogout(ev)}
                            className="btn"
                        >
                            Logout
                        </a>
                    </div>
                </header>
                <main>{!loading && user && <Outlet />}</main>
            </div>
        </div>
    );
}

export default DefaultLayout;

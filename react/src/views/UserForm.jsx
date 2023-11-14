import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useDispatch } from "react-redux";
import { createUser, updateUser } from "../redux/actions/userAction.js";

export default function UserForm() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        id: null,
        name: "",
        email: "",
        password: "",
        role: "Admin",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState(null);

    const onSubmit = (ev) => {
        ev.preventDefault();
        setErrors(null);
        if (user.id) {
            api.put(`/users/${user.id}`, user)
                .then(({ data }) => {
                    dispatch(updateUser(user));
                    navigate("/users");
                })
                .catch((error) => {
                    const response = error.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            api.post(`/users`, user)
                .then(({ data }) => {
                    dispatch(createUser({ user: user }));
                    navigate("/users");
                })
                .catch((error) => {
                    const response = error.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };
    if (id) {
        useEffect(() => {
            setLoading(true);
            api.get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setUser(data.data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, []);
    }
    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                {user.id && <h1>Update User</h1>}
                {!user.id && <h1>New User</h1>}
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                {!loading && (
                    <form onSubmit={(ev) => onSubmit(ev)}>
                        <input
                            value={user.name}
                            onChange={(ev) =>
                                setUser({ ...user, name: ev.target.value })
                            }
                            type="text"
                            placeholder="Full Name"
                        />
                        <input
                            value={user.email}
                            onChange={(ev) =>
                                setUser({ ...user, email: ev.target.value })
                            }
                            type="email"
                            placeholder="Email Address"
                        />
                        <input
                            value={user.password}
                            onChange={(ev) =>
                                setUser({ ...user, password: ev.target.value })
                            }
                            type="password"
                            placeholder="Password"
                        />
                        <input
                            value={user.password_confirmation}
                            onChange={(ev) =>
                                setUser({
                                    ...user,
                                    password_confirmation: ev.target.value,
                                })
                            }
                            type="password"
                            placeholder="Password Confirmation"
                        />
                        <button className="btn block">Save</button>
                        <Link to="/users" className="btn__default">
                            Cancel
                        </Link>
                    </form>
                )}
            </div>
        </div>
    );
}

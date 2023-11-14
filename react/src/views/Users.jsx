import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserList, removeUser, setUsersPageIndex } from "../redux/actions/userAction.js";

const Users = () => {
    const users = useSelector((state) => state.user.list);
    let pageIndex = useSelector((state) => state.user.pageIndex);
    const perPage = useSelector((state) => state.user.pageRows);
    const [loading, setLoading] = useState(false);

    const [pages, setPages] = useState(0);
    const [startNum, setStartNum] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const dispatch = useDispatch();

    useEffect(() => {
        setLoading(true);
        getUsers(pageIndex);
    }, []);

    const _setPages = (meta) => {
        if (!meta) return;
        if ((meta.last_page || 0) == 0) return;
        let pageNums = meta.last_page;
        setPages(pageNums);
        setTotalPages(meta.total || 0);
        setStartNum(meta.from);
    }

    const goPage = (page) => {
        getUsers(page);
    }

    const getUsers = async (index) => {
        api.get(`/users?page=${index}&limit=${perPage}`)
            .then(({ data }) => {
                setLoading(false);
                dispatch(setUserList(data.data));
                dispatch(setUsersPageIndex({ index: data.meta.current_page }));
                _setPages(data.meta);
            })
            .catch((err) => {
                setLoading(false);
            });
    };

    const onDelete = (u) => {
        if (!window.confirm("Are you sure to delete user?")) return;
        api.delete(`/users/${u.id}`).then(({ data }) => {
            dispatch(removeUser({ id: u.id }));
        });
    };
    return (
        <div className="table-container">
            <div className="table-header">
                <h1>Users</h1>
                <Link to="/user/new" className="btn__new">
                    Add New
                </Link>
            </div>
            <div className="table-content animated fadeInDown">
                <table className="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan={6}>
                                    <span className="loading">Loading...</span>
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {users.map((u, no) => (
                                <tr key={u.id}>
                                    <td>{startNum + no}.</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>{u.created_at}</td>
                                    <td className="btn__group">
                                        <Link
                                            to={"/user/" + u.id}
                                            className="btn__group__edit"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => onDelete(u)}
                                            className="btn__group__delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
                <div className="pages">
                    {users.length > 0 &&
                        Array(pages)
                            .fill()
                            .map((_, i) => {
                                return (
                                    <div
                                        className={`page ${
                                            i + 1 == pageIndex ? "active" : ""
                                        }`}
                                        key={i}
                                        onClick={() => goPage(i + 1)}
                                    >
                                        {i + 1}
                                    </div>
                                );
                            })}
                </div>
            </div>
        </div>
    );
}
export default Users;

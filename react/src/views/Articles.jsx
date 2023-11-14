import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    removeArticle,
    setArticleList,
    setArticlesPageIndex,
} from "../redux/actions/articleAction";

const Articles = () => {
    const articles = useSelector((state) => state.article.list);
    let pageIndex = useSelector((state) => state.article.pageIndex);
    const perPage = useSelector((state) => state.article.pageRows);
    const [loading, setLoading] = useState(false);

    const [pages, setPages] = useState(0);
    const [startNum, setStartNum] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const dispatch = useDispatch();

    useEffect(() => {
        setLoading(true);
        getArticles(pageIndex);
    }, []);

    const _setPages = (meta) => {
        let pageNums = 0;
        let total = 0;
        let from = 0;
        if (meta) {
            if ((meta.last_page || 0) != 0) pageNums = meta.last_page;
            if (meta.total) total = meta.total;
            if (meta.from) from = meta.from;
        }
        
        setPages(pageNums);
        setTotalPages(total);
        setStartNum(from);
    };

    const goPage = (page) => {
        getArticles(page);
    };

    const getArticles = async (index) => {
        const data = await api.get(`/articles?page=${index}&limit=${perPage}`)
            .then(({ data }) => {
                return data;
            })
            .catch((err) => {
                return null;
            });
        setLoading(false);
        if (data) {
            dispatch(setArticleList(data.data || []));
            dispatch(
                setArticlesPageIndex({ index: data.meta.current_page || 1 })
            );
            _setPages(data.meta);
        }
    };

    const onDelete = (u) => {
        if (!window.confirm("Are you sure to delete article?")) return;
        api.delete(`/articles/${u.id}`).then(({ data }) => {
            dispatch(removeArticle({ id: u.id }));
        });
    };
    
    return (
        <div className="table-container">
            <div className="table-header">
                <h1>Articles</h1>
                <Link to="/article/new" className="btn__new">
                    Add New
                </Link>
            </div>
            <div className="table-content animated fadeInDown">
                <table className="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan={5}>
                                    <span className="loading">Loading...</span>
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && articles.length > 0 && (
                        <tbody>
                            {articles?.map((u, no) => (
                                <tr key={u.id}>
                                    <td>{startNum + no}.</td>
                                    <td>{u.name}</td>
                                    <td>{u.description}</td>
                                    <td>{u.created_at}</td>
                                    <td className="btn__group">
                                        <Link
                                            to={"/article/" + u.id}
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
                    {articles?.length > 0 &&
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

export default Articles;

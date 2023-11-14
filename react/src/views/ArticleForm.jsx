import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useDispatch } from "react-redux";
import { createArticle, updateArticle } from "../redux/actions/articleAction";

export default function UserForm() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [article, setArticle] = useState({
        id: null,
        name: "",
        description: "",
        content: "",
    });
    const [errors, setErrors] = useState(null);

    const onSubmit = (ev) => {
        ev.preventDefault();
        setErrors(null);
        if (article.id) {
            api.put(`/articles/${article.id}`, article)
                .then(({ data }) => {
                    if (data.errors) {
                        if (data.errors) return setErrors(data.errors);
                    }
                    if (data.message) {
                        return setErrors({
                            name: [data.message],
                        });
                    }
                    dispatch(updateArticle(article));
                    navigate("/articles");
                })
                .catch((error) => {
                    const response = error.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            api.post(`/articles`, article)
                .then(({ data }) => {
                    if (data.errors) {
                        if (data.errors) return setErrors(data.errors);
                    }
                    if (data.message) {
                        return setErrors({
                            name: [data.message],
                        });
                    }
                    article.id = data.id;
                    dispatch(createArticle({ article: article }));
                    navigate("/articles");
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
            api.get(`/articles/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setArticle(data.data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, []);
    }
    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                {article.id && <h1>Update Article</h1>}
                {!article.id && <h1>New Article</h1>}
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
                            value={article.name}
                            onChange={(ev) =>
                                setArticle({
                                    ...article,
                                    name: ev.target.value,
                                })
                            }
                            type="text"
                            placeholder="Article Name"
                        />
                        <textarea
                            cols="30"
                            rows="3"
                            placeholder="Description"
                            value={article.description}
                            onChange={(ev) =>
                                setArticle({
                                    ...article,
                                    description: ev.target.value,
                                })
                            }
                        />
                        <textarea
                            cols="30"
                            rows="10"
                            placeholder="Content"
                            value={article.content}
                            onChange={(ev) =>
                                setArticle({
                                    ...article,
                                    content: ev.target.value,
                                })
                            }
                        />
                        <button className="btn block">Save</button>
                        <Link to="/articles" className="btn__default">
                            Cancel
                        </Link>
                    </form>
                )}
            </div>
        </div>
    );
}

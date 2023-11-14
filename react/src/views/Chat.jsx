import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";

import { useDispatch } from "react-redux";
import {
    createMessage,
    initMessages,
    setReceiver,
} from "../redux/actions/chatAction";

const Chat = () => {
    const token = useSelector((state) => state.user.token);
    const user = useSelector((state) => state.user.data);
    const messages = useSelector((state) => state.chat.messages);
    const selectedUser = useSelector((state) => state.chat.receiver);

    const [message, setMessage] = useState("");
    const [searchKey, setSearchKey] = useState("");
    const [users, setUsers] = useState([]);

    const [pusher, setPusher] = useState();

    const dispatch = useDispatch();

    const _scrollDown = () => {
        setTimeout(() => {
            let h = document.querySelector(".chat-messages").scrollHeight;
            document.querySelector(".chat-messages").scrollTop = h;
        }, 1000);
    }

    const _addMessage = async (msg) => {
        dispatch(createMessage(msg));
        _scrollDown();
    }

    const _getMessages = async (u) => {
        const data = await api
            .get(`/messages/${user.id}/${u.id}`)
            .then(({ data }) => {
                return data;
            })
            .catch((err) => {
                console.log(err);
                return [];
            });
        dispatch(initMessages(data));
    }

    const _setSelectedUser = (u) => {
        // if (selectedUser && u.id == selectedUser.id) return;
        dispatch(setReceiver(u));
        document.querySelector(".chat-container").classList.remove("show-header");

        const channel = pusher.subscribe(`chat_${user.id}`);
        channel.bind(`message_${user.id}`, (data) => {
            _addMessage(data);
        });

        const channel2 = pusher.subscribe(`chat_${u.id}`);
        channel2.bind(`message_${u.id}`, (data) => {
            _addMessage(data);
        });

        _getMessages(u);
        _scrollDown();
    }

    const _search = async (e) => {
        e.preventDefault();
        if (!searchKey) return;
        await api
            .post("/search-user", { key: searchKey })
            .then(({ data }) => {
                setSearchKey("");
                setUsers(data.users || []);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const goBack = () => {
        document.querySelector('.chat-container').classList.add('show-header');
    }

    useEffect(() => {
        Pusher.logToConsole = true;
        const ps = new Pusher("a785b0d0fc70437365e9", {
            cluster: "ap1",
        });
        setPusher(ps);
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;

        let payload = {
            message: message,
            username: user.id,
            receiver: selectedUser.id
        }

        await api
            .post("/chat", payload)
            .then(({ data }) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
        setMessage("");
    }
    return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="chat-search">
                    <form onSubmit={(ev) => _search(ev)}>
                        <input
                            type="text"
                            value={searchKey}
                            onChange={(e) => setSearchKey(e.target.value)}
                            placeholder="Search..."
                        />
                        <span className="search-icon material-icons-outlined">
                            search
                        </span>
                    </form>
                </div>
                <div className="chat-users">
                    {users &&
                        users
                            .filter((it) => it.id != user.id)
                            .map((u) => (
                                <div
                                    className={`user ${
                                        selectedUser && u.id == selectedUser.id
                                            ? "active"
                                            : ""
                                    }`}
                                    key={u.id}
                                    onClick={() => _setSelectedUser(u)}
                                >
                                    <div className="user-img">
                                        <span className="material-icons">
                                            person
                                        </span>
                                    </div>
                                    <div className="user-block">
                                        <div className="username">{u.name}</div>
                                        <div className="user-desc">
                                            {u.email}
                                        </div>
                                    </div>
                                </div>
                            ))}
                </div>
            </div>
            <div className="chat-body">
                <div className="chat-receiver">
                    {selectedUser && (
                        <div className="user">
                            <div
                                className="user-back-btn material-icons-outlined"
                                onClick={() => goBack()}
                            >
                                arrow_back
                            </div>
                            <div className="user-img">
                                <span className="material-icons">person</span>
                            </div>
                            <div className="user-block">
                                <div className="username">
                                    {selectedUser.name}
                                </div>
                                <div className="user-desc">
                                    {selectedUser.email}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="chat-messages">
                    {messages &&
                        messages
                            .filter((it) => {
                                let rec =
                                    selectedUser.id == it.receiver &&
                                    user.id == it.username;
                                let me =
                                    it.username == selectedUser.id &&
                                    it.receiver == user.id;
                                return rec || me;
                            })
                            .map((item, i) => (
                                <div
                                    className={`message-item ${
                                        item.username == user.id
                                            ? ""
                                            : "receiver"
                                    }`}
                                    key={i}
                                >
                                    <div className="message-time">
                                        {item.created_date_display}{" "}
                                        {item.created_time_display}
                                    </div>
                                    <div className="message-text">
                                        {item.message}
                                    </div>
                                </div>
                            ))}
                </div>
                <form onSubmit={(ev) => onSubmit(ev)}>
                    <input
                        value={message}
                        onChange={(ev) => setMessage(ev.target.value)}
                        type="text"
                        placeholder="Write a message"
                    />
                    <button type="submit" className="btn block">
                        <i className="material-icons-outlined">arrow_forward</i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;

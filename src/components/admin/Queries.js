import styles from "../staff/Queries.module.css";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import SpaceDiv from "../UI/SpaceDiv";
import LoadingSpinner from "../UI/LoadingSpinner";
import {backendUrl} from "../../config/constants";

function Queries() {
    const adminToken = useSelector(state => state.authentication.adminToken);

    const [isLoading, setIsLoading] = useState(false);

    const [list, setList] = useState([]);
    const [selectedQueryId, setSelectedQueryId] = useState("");
    const [message, setMessage] = useState("");

    const fetchData = async () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({adminToken: adminToken}),
        };
        const response = await (await fetch(`${backendUrl}/admin/getQueries`, requestOptions)).json();
        setList(response.body);
    }

    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({adminToken: adminToken}),
            };
            const response = await (await fetch(`${backendUrl}/admin/getQueries`, requestOptions)).json();
            setList(response.body);
        }
        setIsLoading(true);
        fetchData().then(e => setIsLoading(false));
    }, [adminToken]);

    const buttonHandler = async (id) => {
        const resolveQuery = async () => {
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({adminToken: adminToken, queryId: id}),
            };
            await fetch(`${backendUrl}/admin/resolveQuery`, requestOptions);
        }
        resolveQuery().then(() => fetchData());
    }

    const responseHandler = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({adminToken: adminToken, queryId: selectedQueryId, response: message}),
        };
        fetch(`${backendUrl}/admin/sendMessage`, requestOptions).then(() => null);
        setSelectedQueryId("");
        setMessage("");
    }

    if (isLoading) {
        return <>
            <SpaceDiv height={25}/>
            <LoadingSpinner/>
        </>;
    }

    return <>
        <h1 className={styles.mainHeading}>Customer Queries...</h1>
        <table className={`table table-striped table-hover ${styles.tableStyle}`}>
            <thead>
            <tr className={"table-primary"}>
                <th scope={"col"}>Account Number</th>
                <th scope={"col"}>Name</th>
                <th scope={"col"}>Phone</th>
                <th scope={"col"}>Title of the Query</th>
                <th scope={"col"}>Query</th>
                <th>-----</th>
                <th>-----</th>
            </tr>
            </thead>
            <tbody>
            {list.map((item, index) => (
                <tr key={index}>
                    <td>{item.acc_no}</td>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.title}</td>
                    <td>{item.message}</td>
                    <td>
                        <button className={"btn btn-outline-success"} onClick={() => buttonHandler(item._id)}>Mark as
                            Resolved
                        </button>
                    </td>
                    <td>
                        <button className={"btn btn-warning"} data-bs-toggle={"modal"}
                                onClick={() => setSelectedQueryId(item._id)}
                                data-bs-target={"#responseModal"}>Send a Message
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
        <div className={"modal fade"} id={"responseModal"} tabIndex={-1} aria-hidden={true}>
            <div className={"modal-dialog"}>
                <div className={"modal-content"}>
                    <div className={"modal-body"}>
                        <form onSubmit={responseHandler}>
                            <input type={"text"} placeholder={"Enter the Query Response"} className={"form-control"}
                                   required={true} value={message} onChange={event => setMessage(event.target.value)}/>
                            <input type={"submit"} value={"Send"} className={"btn btn-primary"}
                                   data-bs-toggle={message.length === 0 ? "" : "modal"}/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export default Queries;
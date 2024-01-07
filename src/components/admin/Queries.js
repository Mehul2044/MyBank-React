import styles from "./Queries.module.css";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import SpaceDiv from "../UI/SpaceDiv";
import LoadingSpinner from "../UI/LoadingSpinner";
import {backendUrl} from "../../config/constants";

function Queries() {
    const adminToken = useSelector(state => state.authentication.adminToken);

    const [isLoading, setIsLoading] = useState(false);

    const [list, setList] = useState([]);

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
                <th>-----------</th>
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
                        <button className={"btn btn-success"} onClick={() => buttonHandler(item._id)}>Mark as Resolved
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </>;
}

export default Queries;
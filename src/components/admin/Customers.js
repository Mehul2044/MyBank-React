import SpaceDiv from "../UI/SpaceDiv";
import styles from "./Customers.module.css";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {backendUrl} from "../../config/constants";
import LoadingSpinner from "../UI/LoadingSpinner";

function Customers() {
    const adminToken = useSelector(state => state.authentication.adminToken);

    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [accountNumber, setAccountNumber] = useState("");

    const searchHandler = (event) => {
        event.preventDefault();
        setShowUsers(users.filter(user => accountNumber === user._id));
        setAccountNumber("");
    }

    const resetHandler = () => {
        setShowUsers(users);
    }

    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({adminToken: adminToken}),
            };
            const response = await (await fetch(`${backendUrl}/admin/getCustomers`, requestOptions)).json();
            setUsers(response.body);
            setShowUsers(response.body);
        }
        setIsLoading(true);
        fetchData().then(e => setIsLoading(false));
    }, [adminToken]);

    if (isLoading) {
        return <>
            <SpaceDiv height={25}/>
            <LoadingSpinner/>
        </>;
    }

    return <>
        <SpaceDiv height={7}/>
        <h1 className={styles.mainHeading}>Account Holder List...</h1>
        <form style={{marginLeft: "5rem", marginTop: "3rem"}} onSubmit={searchHandler}>
            <input type={"text"} required={true} className={"form-control"} style={{width: "30%", display: "inline"}}
                   value={accountNumber} onChange={event => setAccountNumber(event.target.value.trim())}
                   placeholder={"Enter Account Number"}/>
            <button type={"submit"} className={`btn btn-outline-success ${styles.searchButton}`}>Search</button>
            <button className={`btn btn-warning ${styles.searchButton}`} type={"button"} onClick={resetHandler}>Reset</button>
        </form>
        <table className={`table table-striped table-hover ${styles.tableStyle}`}>
            <thead>
            <tr className={"table-primary"}>
                <th scope={"col"}>#</th>
                <th scope={"col"}>Name</th>
                <th scope={"col"}>Account Number</th>
                <th scope={"col"}>Email</th>
                <th scope={"col"}>Phone</th>
            </tr>
            </thead>
            <tbody>
            {showUsers.map((user, index) => (
                <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>{user._id}</td>
                    <td>{user.eMail}</td>
                    <td>{user.phone}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </>;
}

export default Customers;
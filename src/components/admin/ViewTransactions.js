import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {backendUrl} from "../../config/constants";
import SpaceDiv from "../UI/SpaceDiv";
import LoadingSpinner from "../UI/LoadingSpinner";
import styles from "./Transactions.module.css";

function ViewTransactions() {
    const adminToken = useSelector(state => state.authentication.adminToken);

    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({adminToken: adminToken}),
            };
            const response = await (await fetch(`${backendUrl}/admin/getTransactions`, requestOptions)).json();
            setList(response.body);
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

    const reversedList = [...list].reverse();

    return <>
        <SpaceDiv height={7}/>
        <h1 className={styles.mainHeading}>Transactions Occurring in the Bank</h1>
        <SpaceDiv height={2}/>
        <table className={`table table-striped table-hover ${styles.tableStyle}`}>
            <thead>
            <tr className={"table-primary"}>
                <th scope={"col"}>#</th>
                <th scope={"col"}>Sender A/C</th>
                <th scope={"col"}>Receiver A/C</th>
                <th scope={"col"}>Amount</th>
                <th scope={"col"}>Date(dd/mm/yyyy)</th>
                <th scope={"col"}>Time(12-hour)</th>
            </tr>
            </thead>
            <tbody className={"table-group-divider"}>
            {reversedList.map((item, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.sender_acc_no}</td>
                    <td>{item.recipient}</td>
                    <td>{item.amount}</td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </>;
}

export default ViewTransactions;
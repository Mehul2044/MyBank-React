import styles from "../staff/AccountOpening.module.css";
import {useEffect, useState} from "react";
import SpaceDiv from "../UI/SpaceDiv";
import LoadingSpinner from "../UI/LoadingSpinner";
import {useSelector} from "react-redux";
import {backendUrl} from "../../config/constants";

function AccountOpening() {
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
            const response = await (await fetch(`${backendUrl}/admin/getForms`, requestOptions)).json();
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

    if (list.length === 0) {
        return <>
            <h1 className={styles.mainHeading}>Account Opening Forms...</h1>
            <h4 className={styles.mainHeading}>No form to show...</h4>
        </>;
    }

    return <>
        <h1 className={styles.mainHeading}>Account Opening Forms...</h1>
        <table className={`table table-striped table-hover ${styles.tableStyle}`}>
            <thead>
            <tr className={"table-primary"}>
                <th scope={"col"}>Name</th>
                <th scope={"col"}>Email</th>
                <th scope={"col"}>Phone</th>
                <th scope={"col"}>Account Opening Form</th>
            </tr>
            </thead>
            <tbody>
            {list.map((item, index) => (
                <tr key={index}>
                    <td>{`${item.first_name} ${item.last_name}`}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td><a target={"_blank"} href={item.formPath} rel="noreferrer">Link</a></td>
                </tr>
            ))}
            </tbody>
        </table>
    </>;
}

export default AccountOpening;
import {Navigate, Route, Routes} from "react-router-dom";
import HomePage from "../components/user/HomePage";
import AboutUs from "../components/user/AboutUs";
import ContactUs from "../components/user/ContactUs";
import TermsConditions from "../components/user/TermsConditions";
import AfterLoginUserMain from "../screens/AfterLoginUserMain";
import BeforeLoginUserHome from "../screens/BeforeLoginUserHome";
import AfterLoginAdmin from "../screens/AfterLoginAdmin";
import PageNotFound from "../screens/PageNotFound";
import {useSelector} from "react-redux";
import BeforeLoginAdmin from "../screens/BeforeLoginAdmin";
import LoginPage from "../components/user/LoginPage";
import Dashboard from "../components/user/Dashboard";
import DashboardAdmin from "../components/admin/DashboardAdmin";
import Registration from "../components/user/Registration";
import UserProfile from "../components/user/UserProfile";
import Transfer from "../components/user/Transfer";
import Loan from "../components/user/Loan";
import AccountOpening from "../components/admin/AccountOpening";
import Customers from "../components/admin/Customers";
import Queries from "../components/admin/Queries";

function Router() {
    const isUserLogin = useSelector(state => state.authentication.isUserLogin);
    const isAdminLogin = useSelector(state => state.authentication.isAdminLogin);

    const homeComponentRender = () => {
        if (isUserLogin) return <Navigate to={"/main"} replace={true}/>;
        if (isAdminLogin) return <Navigate to={"/admin/main"} replace={true}/>;
        return <BeforeLoginUserHome/>;
    }

    return <Routes>
        <Route path={"/"} element={homeComponentRender()}>
            <Route path={"login"} element={<LoginPage/>}/>
            <Route path={"registration"} element={<Registration/>}/>
            <Route path={"home"} element={<HomePage/>}/>
            <Route path={"about-us"} element={<AboutUs/>}/>
            <Route path={"contact"} element={<ContactUs/>}/>
            <Route path={"terms-conditions"} element={<TermsConditions/>}/>
        </Route>
        <Route path={"/main"} element={<AfterLoginUserMain/>}>
            <Route path={"dashboard"} element={<Dashboard/>}/>
            <Route path={"user-profile"} element={<UserProfile/>}/>
            <Route path={"transfer"} element={<Transfer/>}/>
            <Route path={"loan"} element={<Loan/>}/>
            <Route path={"about-us"} element={<AboutUs/>}/>
            <Route path={"contact"} element={<ContactUs/>}/>
            <Route path={"terms-conditions"} element={<TermsConditions/>}/>
        </Route>
        <Route path={"/admin"} element={<BeforeLoginAdmin/>}/>
        <Route path={"/admin/main"} element={<AfterLoginAdmin/>}>
            <Route path={"dashboard"} element={<DashboardAdmin/>}/>
            <Route path={"account_requests"} element={<AccountOpening/>}/>
            <Route path={"customers"} element={<Customers/>}/>
            <Route path={"view_queries"} element={<Queries/>}/>
        </Route>
        <Route path={"*"} element={<PageNotFound/>}/>
    </Routes>;
}

export default Router;
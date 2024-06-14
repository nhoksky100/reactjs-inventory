import React, { Component, Fragment } from 'react';
import { Route, Routes, } from 'react-router-dom';
import FormViewCustomer from '../Component/Views/FormViewCustomer';
import LoginCustomer from '../Component/LoginSignUp/LoginCustomer';
import PasswordRetrieval from '../Component/LoginSignUp/PasswordRetrieval';
import FormChangePassword from '../Component/LoginSignUp/FormChangePassword';
import NotPage404 from '../Component/NotPage404';
// import ScrollToTop from './ScrollToTop';

class RouterUrl extends Component {
    render() {
     
        return (
            <Fragment>
                <Routes>
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/"} element={<FormViewCustomer  />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/warehouse"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/create-warehouse"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/warehouse-list"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/into-warehouse-list"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/transfer-warehouse-export"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/purchase"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/purchase/document"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/purchase/request-approved"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/purchase/request-all"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/purchase/into-warehouse"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/purchase/add-document"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/supplier"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/add-supplier"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/member"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/add-member"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/list-account"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/add-account"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/request"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/category/items-list"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/add-itemlist"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/profile-account"} element={<FormViewCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/login"} element={<LoginCustomer />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/login/password-retrieval"} element={<PasswordRetrieval />} />
                    <Route path={process.env.REACT_APP_BACKEND_URL+"/new-password"} element={<FormChangePassword />} />
                    <Route path="*" element={<NotPage404 />} />
                </Routes>
                {/* <ScrollToTop /> */}
            </Fragment>
        );
    }
}

export default RouterUrl;

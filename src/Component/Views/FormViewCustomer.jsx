import React, { useState, useEffect, useRef, Fragment } from 'react';
import Sidebar from '../SideBar/SidebarLeft';
import HeaderTopProfile from '../Header/HeaderTopProfile';
import { toast } from 'react-toastify';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import bcrypt from 'bcryptjs';

import Warehouse from '../Content/Warehouse/Warehouse';
import Member from '../Content/Member/Member';
import AddMember from '../Content/Member/AddMember';
import ItemList from '../Content/ItemList/ItemList';
import AddItemList from '../Content/ItemList/AddItemList';
import AddAccount from '../Content/Member/AddAccount';
import ListAccount from '../Content/Member/ListAccount';
import PurchaseRequestNotApprove from '../Content/Purchase/PurchaseRequestNotApprove';
import PurchaseRequestListAll from '../Content/Purchase/PurchaseRequestListAll';
import PurchaseRequestListApproved from '../Content/Purchase/PurchaseRequestListApproved';
import Supplier from '../Content/Supplier/Supplier';
import AddSupplier from '../Content/Supplier/AddSupplier';
import PurchaseIntoWarehouse from '../Content/Purchase/PurchaseIntoWarehouse';
import AddDocument from '../Content/Purchase/AddDocument';
import Document from '../Content/Purchase/Document';
import AddCreateWarehouse from '../Content/ItemList/AddCreateWarehouse';
import CreateWarehouseAreaList from '../Content/ItemList/CreateWarehouseAreaList';
import IntoWarehouseList from '../Content/Warehouse/IntoWarehouseList';
import ContentOverView from '../Content/OverView/ContentOverView';
import Request from '../Content/Request/Request';
import TransferExportForm from '../Content/Warehouse/TransferExportForm';
import ProfileForm from '../Header/ProfileHistory/ProfileForm';

import {
    permissionStore,
    memberNameStore,
    departmentStore,
    isUpdateSettingStore
} from '../../StoreRcd';

const getDataImageProfile = () => axios.get(process.env.REACT_APP_BACKEND_URL+'/imageFile').then((res) => res.data);
const getdataListAccount = () => axios.get(process.env.REACT_APP_BACKEND_URL+'/getAccount').then((res) => res.data);
const getdataMember = () => axios.get(process.env.REACT_APP_BACKEND_URL+'/getMember').then((res) => res.data);

const FormAccountCustomer = () => {
    const [height, setHeight] = useState('auto');
    const [isLogin, setIsLogin] = useState(null);
    const [imageProfile, setImageProfile] = useState('');
    const [tokenObj, setTokenObj] = useState({});
    const [username, setUsername] = useState('');
    const [permission, setPermission] = useState('');
    const [dataAccount, setDataAccount] = useState([]);
    const [dataMember, setDataMember] = useState([]);
    const [department, setDepartment] = useState('');
    const [id, setId] = useState('');
    const [dataLoaded, setDataLoaded] = useState(false);
    const isMounted = useRef(true);



    function FormViewPathName() {
        const location = useLocation();
        const [pathname, setPathname] = useState(location.pathname);

        useEffect(() => {
            setPathname(location.pathname);
        }, [location.pathname]);

        return pathname;
    }
    const dispatch = useDispatch();
    const imageProfileState = useSelector((state) => state.allReducer.imageProfile);
    const isUpdateSetting = useSelector((state) => state.allReducer.isUpdateSetting);
    const permissionState = useSelector((state) => state.allReducer.permission);
    const departmentState = useSelector((state) => state.allReducer.department);
    const memberNameState = useSelector((state) => state.allReducer.memberName);

    useEffect(() => {
        updateHeight();
        dataImageProfile();
        getData();

        window.addEventListener('resize', handleResize);

        return () => {
            isMounted.current = false;
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (isUpdateSetting) {
            dataImageProfile();
            dispatch(isUpdateSettingStore(false)); // Thay đổi trạng thái của isUpdateSetting trong Redux store
        }
    }, [isUpdateSetting]);

    useEffect(() => {
        if (imageProfileState && imageProfileState !== imageProfile) {
            setImageProfile(imageProfileState);
        }
    }, [imageProfileState]);


    const handleResize = () => {
        updateHeight();
    };

    const updateHeight = () => {
        if (window.innerHeight > 690) {
            if (isMounted.current) {
                setHeight('auto');
            }
        } else {
            if (isMounted.current) {
                setHeight('600px');
            }
        }
    };

    const getData = () => {
        isMounted.current = true;
        getdataListAccount().then((res) => {
            if (res && isMounted.current) {
                setDataAccount(res);
                setDataLoaded(true);
                isBcrypt(res);
            }
        });
        getdataMember().then((res) => {
            const tokenObj = getCookie('loginObject') || '';
            if (res && tokenObj) {
                res.forEach((value) => {
                    if (value.memberCode === tokenObj.codeToken.accountCode) {
                        const department = value.memberDepartment;
                        const memberName = value.memberName;
                        if (isMounted.current) {
                            setDepartment(department);
                            setDataLoaded(true);
                            dispatch(departmentStore(department)); // Thay department bằng giá trị cần gửi đi
                            dispatch(memberNameStore(memberName)); // Thay memberName bằng giá trị cần gửi đi
                        }
                    }
                });
            }
        });
    };

    const isBcrypt = async (dataAccount) => {
        const tokenObj = getCookie('loginObject') || '';
        let permission = '';

        if (dataAccount && tokenObj) {
            for (let value of dataAccount) {
                if (tokenObj.codeToken.id === value.id) {
                    const isPermission = await bcrypt.compare(value.accountPermission, tokenObj.codeToken.accountPermission);
                    if (isPermission) {
                        permission = value.accountPermission;
                        dispatch(permissionStore(permission)); // Thay permission bằng giá trị cần gửi đi
                        break;
                    }
                }
            }
        }
        setPermission(permission);
        setDataLoaded(true);
    };

    const dataImageProfile = () => {
        const tokenObj = getCookie('loginObject') || '';
        if (tokenObj) {
            getDataImageProfile().then((res) => {
                res.forEach((value) => {
                    if (tokenObj.codeToken.id === value.id) {
                        if (isMounted.current) {
                            setImageProfile(value.image);
                        }
                        return;
                    }
                });
            });
        }
    };



    const pathUrl = FormViewPathName() || '';

    const showFormProfile = (tokenObj) => {
        console.log(pathUrl ,'pathUrl');
        if (!dataLoaded) {
            return <div className='loader'></div>;
        } else {
            return (
                <Fragment>
                    <Sidebar tokenObj={tokenObj} />
                    <section id="content">
                        <HeaderTopProfile pathUrl={pathUrl} tokenObj={tokenObj} imageProfile={imageProfile} />
                        <main>
                            {isShowForm(tokenObj)}
                        </main>
                    </section>
                </Fragment>
            );
        }
    };

    const isToast = () => {
        if (dataLoaded) {
            window.history.back();
            toast(<div className="advertise"><i className="fa fa-minus-circle" aria-hidden="true" /><i>Quyền hạn không đúng!</i></div>);
        }
        return null;
    };

    const isShowForm = (tokenObj) => {
        console.log(permission ,'permission');
        if (pathUrl && typeof pathUrl === 'string' && dataLoaded && permission) {
            console.log(pathUrl ,'pathUrl');
            switch (pathUrl) {
                case '/':
                    return <ContentOverView tokenObj={tokenObj} />;
                case process.env.REACT_APP_BACKEND_URL+'/warehouse':
                    if (permission === 'Lãnh đạo' || permission === 'Thành viên kho' || (permission === 'Trưởng phòng' && departmentState === 'Kế toán')) {
                        return <Warehouse tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/into-warehouse-list':
                    if (permission === 'Lãnh đạo' || permission === 'Thành viên kho' || (permission === 'Trưởng phòng' && departmentState === 'Kế toán')) {
                        return <IntoWarehouseList tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/transfer-warehouse-export':
                    if (permission === 'Lãnh đạo' || permission === 'Thành viên kho' || (permission === 'Trưởng phòng' && departmentState === 'Kế toán')) {
                        return <TransferExportForm tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/create-warehouse':
                    if (permission === 'Lãnh đạo' || permission === 'Admin') {
                        return <AddCreateWarehouse tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/warehouse-list':
                    if (permission === 'Lãnh đạo' || permission === 'Admin' || (permission === 'Trưởng phòng' && departmentState === 'Kế toán') || permission === 'Thành viên kho') {
                        return <CreateWarehouseAreaList tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/purchase':
                    if (permission === 'Lãnh đạo' || permission === 'Admin' || (permission === 'Trưởng phòng' && departmentState === 'Kế toán')) {
                        return <PurchaseRequestNotApprove tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/purchase-approved':
                    if (permission === 'Lãnh đạo' || permission === 'Admin' || (permission === 'Trưởng phòng' && departmentState === 'Kế toán')) {
                        return <PurchaseRequestListApproved tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/purchase-all':
                    if (permission === 'Lãnh đạo' || permission === 'Admin' || (permission === 'Trưởng phòng' && departmentState === 'Kế toán')) {
                        return <PurchaseRequestListAll tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/purchase-into-warehouse':
                    if (permission === 'Lãnh đạo' || permission === 'Admin' || (permission === 'Trưởng phòng' && departmentState === 'Kế toán') || permission === 'Thành viên kho') {
                        return <PurchaseIntoWarehouse tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/document':
                    if (permission === 'Lãnh đạo' || permission === 'Admin') {
                        return <Document tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/add-document':
                    if (permission === 'Lãnh đạo' || permission === 'Admin') {
                        return <AddDocument tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/supplier':
                    if (permission === 'Lãnh đạo' || permission === 'Admin' || permission === 'Thành viên kho') {
                        return <Supplier tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/add-supplier':
                    if (permission === 'Lãnh đạo' || permission === 'Admin' || permission === 'Thành viên kho') {
                        return <AddSupplier tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/member':
                    if (permission === 'Lãnh đạo' || permission === 'Admin') {
                        return <Member tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/add-member':
                    if (permission === 'Lãnh đạo' || permission === 'Admin') {
                        return <AddMember tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/category/items-list':
                    if (permission === 'Lãnh đạo' || permission === 'Admin' || permission === 'Thành viên kho' || permission === 'Nhân viên' || (permission === 'Trưởng phòng' && departmentState === 'Kế toán')) {
                        return <ItemList tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/add-item-list':
                    if (permission === 'Lãnh đạo' || permission === 'Admin') {
                        return <AddItemList tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/add-account':
                    if (permission === 'Lãnh đạo' || permission === 'Admin') {
                        return <AddAccount tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }
                case process.env.REACT_APP_BACKEND_URL+'/list-account':
                    if (permission === 'Lãnh đạo' || permission === 'Admin' || (permission === 'Trưởng phòng' && departmentState === 'Kế toán')) {
                        return <ListAccount tokenObj={tokenObj} />;
                    } else {
                        return isToast();
                    }

                case process.env.REACT_APP_BACKEND_URL+'/request':
                    return <Request pathUrl={pathUrl} tokenObj={tokenObj} />;
                case process.env.REACT_APP_BACKEND_URL+'/profile-account':
                    return <ProfileForm tokenObj={tokenObj} imageProfile={imageProfile} />;
                default:
                    break;
            }
        }
        return null;
    };

    const getCookie = (name) => {
        const cookies = new Cookies();
        return cookies.get(name);
    };

    const tokenObjCookie = getCookie('loginObject');
    if (tokenObjCookie) {
        return showFormProfile(tokenObjCookie.codeToken);
    } else {
        return <Navigate to="/login" replace={true} />;
    }
};

export default FormAccountCustomer;

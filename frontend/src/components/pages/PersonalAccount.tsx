import {FC, useContext, useEffect, useState} from "react";
import {Context, PStore} from "../../main.tsx";
import CustomButton from "../ui/CustomButton.tsx";
import {useNavigate} from "react-router-dom";
import {routers, RoutesNames} from "../routers/Router.ts";
import $api from "../../http";
import CustomerAccount from "./Account/Customer/CustomerAccount.tsx";
import AdminAccount from "./Account/Admin/AdminAccount.tsx";
import EmployeeAccount from "./Account/Employee/EmployeeAccount.tsx";

interface Who {
    isStaff: boolean,
    isEmployee: boolean,
    isCustomer: boolean,
}

const PersonalAccount: FC = () => {
    const {store} = useContext<PStore>(Context);
    const navigate = useNavigate();
    const path = routers.get(RoutesNames.Home)?.path;

    const [roles, setRoles] = useState<Who>({} as Who);

    useEffect(() => {
        $api.get<Who>("/user/who").then(response => {
            setRoles(response.data)
        })
    }, []);

    return (
        <>
            <div
                className="d-flex flex-row d-flex justify-content-between ms-4 me-4 mt-4 pb-4 border-bottom">
                <div>
                    <div className="">{roles.isCustomer && "Вы заказчик"}</div>
                    <div className="">{roles.isStaff && "Вы администратор"}</div>
                    <div className="">{roles.isEmployee && "Вы работник"}</div>
                </div>
                <div className="">
                    <CustomButton
                        onClick={() => {
                            store.logout();
                            path && navigate(path);
                        }}
                    >
                        logout
                    </CustomButton>
                </div>
            </div>
            {roles.isStaff && <AdminAccount/>}
            {roles.isEmployee && <EmployeeAccount/>}
            {roles.isCustomer && <CustomerAccount/>}
        </>
    );
}

export default PersonalAccount;
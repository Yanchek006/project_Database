import {FC} from "react";
import Home from "../pages/Home.tsx";
import Login from "../pages/Login.tsx";
import Register from "../pages/Register.tsx";
import PersonalAccount from "../pages/PersonalAccount.tsx";
import DevelopmentPage from "../pages/Account/Employee/DevelopmentPage.tsx";
export interface IRoute {
    path: string,
    name: string
    component: FC,
    alwaysVisible: boolean,
    authVisible?: boolean,
}

export enum RoutesNames {
    Home = 'home',
    Login = 'login',
    Register = 'register',
    PersonalAccount = 'account',
    Development = 'development',
}

export const routers: Map<string, IRoute> = new Map<string, IRoute>()
    .set(RoutesNames.Home,
        {path: '/', name: RoutesNames.Home, component: Home, alwaysVisible: true}
    )
    .set(RoutesNames.Login,
        {path: '/login', name: RoutesNames.Login, component: Login, alwaysVisible: false, authVisible: false}
    )
    .set(RoutesNames.Register,
        {path: '/register', name: RoutesNames.Register, component: Register, alwaysVisible: false, authVisible: false}
    )
    .set(RoutesNames.PersonalAccount,
        {path: '/account', name: RoutesNames.PersonalAccount, component: PersonalAccount, alwaysVisible: false, authVisible: true}
    )
    .set(RoutesNames.Development,
        {path: '/development/:id', name: RoutesNames.Development, component: DevelopmentPage, alwaysVisible: false, authVisible: false}
    )

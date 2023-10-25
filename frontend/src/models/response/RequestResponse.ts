import {PriceListResponse} from "./PriceListResponse.ts";

export interface State {
    id: number,
    name: string,
}

export interface User {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
}

export interface Customer {
    user: User,
    bank_account: string,
}

export interface Employee {
    id: number,
    salary: number,
    user: User,

}

export interface RequestResponse {
    id: number,
    state: State,
    customer: Customer,
    manager: Employee,
    description: string,
    create_time: string,
    price_list: PriceListResponse,

}
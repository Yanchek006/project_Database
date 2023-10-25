import {IAccess, IRegisterCustomer, IUser} from "../models";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService.ts";
import axios, {AxiosError} from "axios";
import {API_URL} from "../http";
import TokenService from "../services/TokenService.ts";
import {ResponsePosition} from "../components/pages/Account/Admin/forms/CreatePositionFrom.tsx";
import {ResponseEmployee} from "../components/pages/Account/Admin/shows/ShowEmployee.tsx";
import {ResponseLevelPosition} from "../components/pages/Account/Admin/shows/ShowLevelPosition.tsx";
import {ResponseDepartment} from "../components/pages/Account/Admin/shows/ShowDepartment.tsx";
import {ResponsePriceList} from "../components/pages/Account/Admin/shows/ShowPriceList.tsx";
import {ResponseState} from "../components/pages/Account/Admin/shows/ShowState.tsx";
import {ResponseDevelopment} from "../components/pages/Account/Employee/tables/DevelopmentTable.tsx";
import {ResponseDocumentation} from "../components/pages/Account/Employee/DevelopmentPage.tsx";
import {RequestResponse} from "../models/response/RequestResponse.ts";

interface Errors {
    login: any[],
    register: any[],
}

interface Entity {
    id: number,
}

export function parse_errors(data: Object): any[] {
    const errors = [];
    for (const [key, value] of Object.entries(data)) {
        if (value.constructor === Array || typeof value === "string") {
            errors.push(`${key}: ${value}`)
        } else {
            errors.push(...parse_errors(value));
        }
    }
    return errors;
}


export default class Store {
    isAuth = false;
    errors: Errors = {
        login: [],
        register: [],
    };
    isLoading: boolean = false;

    positions: ResponsePosition[] = [];
    levelPositions: ResponseLevelPosition[] = [];
    departments: ResponseDepartment[] = [];
    priceLists: ResponsePriceList[] = [];
    states: ResponseState[] = [];
    employees: ResponseEmployee[] = [];
    youDevelopments: ResponseDevelopment[] = [];
    notYouDevelopments: ResponseDevelopment[] = [];

    youDocumentations: ResponseDocumentation[] = [];
    notYouDocumentations: ResponseDocumentation[] = [];

    requests: RequestResponse[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    removeEntityById(array: Entity[], id: number): void {
        const indexToRemove = array.findIndex(department => department.id === id);

        if (indexToRemove !== -1) {
            array.splice(indexToRemove, 1);
        }
    }

    setEntityById(array: Entity[], id: number, entity: Entity): void {
        const index = array.findIndex(department => department.id === id);

        if (index !== -1) {
            array[index] = entity;
        }
    }

    getEntityById(array: Entity[], id: number) {
        const index = array.findIndex(department => department.id === id);
        if (index !== -1) {
            return  array[index];
        }
    }

    setRequests(requests: RequestResponse[]){
        this.requests = requests;
    }

    addRequests(request: RequestResponse) {
        this.requests.push(request);
    }

    setYouDocumentations(documentations: ResponseDocumentation[]){
        this.youDocumentations = documentations;
    }

    addYouDocumentation(documentation: ResponseDocumentation) {
        this.youDocumentations.push(documentation);
    }

    setNotYouDocumentations(documentations: ResponseDocumentation[]){
        this.notYouDocumentations = documentations;
    }

    addNotYouDocumentation(documentation: ResponseDocumentation) {
        this.notYouDocumentations.push(documentation);
    }

    setYouDevelopments(developments: ResponseDevelopment[]){
        this.youDevelopments = developments;
    }

    addYouDevelopment(developments: ResponseDevelopment) {
        this.youDevelopments.push(developments);
    }

    setNotYouDevelopments(developments: ResponseDevelopment[]){
        this.notYouDevelopments = developments;
    }

    addNotYouDevelopment(developments: ResponseDevelopment) {
        this.notYouDevelopments.push(developments);
    }

    setPositions(positions: ResponsePosition[]){
        this.positions = positions;
    }

    addPosition(position: ResponsePosition) {
        this.positions.push(position);
    }

    setEmployees(employees: ResponseEmployee[]){
        this.employees = employees;
    }

    addEmployee(employee: ResponseEmployee) {
        this.employees.push(employee);
    }

    setStates(states: ResponseState[]){
        this.states = states;
    }

    addState(state: ResponseState) {
        this.states.push(state);
    }

    setPriceLists(priceLists: ResponsePriceList[]){
        this.priceLists = priceLists;
    }

    addPriceList(priceList: ResponsePriceList) {
        this.priceLists.push(priceList);
    }

    setDepartments(departments: ResponseDepartment[]){
        this.departments = departments;
    }

    addDepartment(department: ResponseDepartment) {
        this.departments.push(department);
    }


    setLevelPositions(levelPositions: ResponseLevelPosition[]){
        this.levelPositions = levelPositions;
    }

    addLevelPosition(levelPositions: ResponseLevelPosition) {
        this.levelPositions.push(levelPositions);
    }

    setAuth(isAuth: boolean) {
        this.isAuth = isAuth;
    }

    setErrors(errors: Errors) {
        this.errors = errors;
    }

    clearErrors() {
        this.errors = {
            login: [],
            register: [],
        };
    }

    setIsLoading(isLoading: boolean): void {
        this.isLoading = isLoading;
    }

    logout() {
        TokenService.cleatTokensFromLocalStorage();
        this.setAuth(false);
    }

    async login(user: IUser) {
        try {
            this.setIsLoading(true);
            this.clearErrors();
            const response = await AuthService.login(user);
            TokenService.saveTokensToLocalStorage(response.data)
            this.setAuth(true);
        } catch (exception) {
            this.setErrors({
                login: parse_errors((exception as AxiosError).response?.data as object),
                register: [],
            });
            throw exception;
        } finally {
            this.setIsLoading(false);
        }
    }

    async register(customer: IRegisterCustomer) {
        try {
            this.setIsLoading(true);
            this.clearErrors();
            await AuthService.register(customer);
            await this.login({username: customer.user.username, password: customer.user.password});
        } catch (exception) {
            this.setErrors({
                register: parse_errors((exception as AxiosError).response?.data as object),
                login: [],
            });
            throw exception;
        } finally {
            this.setIsLoading(false);
        }
    }



    async checkAuth() {
        try {
            this.setIsLoading(true);
            const response = await axios.post<IAccess>(
                `${API_URL}/token/refresh/`,
                {
                    refresh: TokenService.loadTokensFromLocalStorage().refresh,
                },
                {
                    withCredentials: true,
                }
            );
            TokenService.saveAccessTokenToLocalStorage(response.data.access);
            this.setAuth(true);
        } catch (exception) {
        } finally {
            this.setIsLoading(false);
        }
    }
}
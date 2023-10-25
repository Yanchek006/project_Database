import {FC, useContext, useState} from "react";
import CustomButton from "../../../../ui/CustomButton.tsx";
import {IRegisterUser} from "../../../../../models";
import {Context, PStore} from "../../../../../main.tsx";
import Spinner from "../../../../ux/Spinner.tsx";
import Dropdown, {Item} from "../../../../ui/Dropdown.tsx";
import {observer} from "mobx-react-lite";
import $api from "../../../../../http";
import {parse_errors} from "../../../../../store/store.ts";
import {ResponseEmployee} from "../shows/ShowEmployee.tsx";

export interface IRegisterEmployee {
    user: IRegisterUser,
    departament: number,
    position: number,
    level_position: number,
    salary: number,
}


const CreateEmployeeForm: FC = () => {
    const {store} = useContext<PStore>(Context);

    const [department, setDepartment] = useState<Item>({id: -1, name: 'please choice'});
    const [position, setPosition] = useState<Item>({id: -1, name: 'please choice'});
    const [levelPosition, setLevelPosition] = useState<Item>({id: -1, name: 'please choice'});


    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any[]>([]);


    const [employee, setEmployee] = useState<IRegisterEmployee>(
        {
            user: {
                username: '',
                first_name: '',
                last_name: '',
                email: '',
                password: '',
            },
            departament: department.id,
            position: position.id,
            level_position: levelPosition.id,
            salary: -1,
        },
    )


    const createEmployee = () => {
        setIsLoading(true);
        employee.departament = department.id;
        employee.position = position.id;
        employee.level_position = levelPosition.id;
        $api.post<ResponseEmployee>("/employee/create/", employee)
            .then((response) => {
                store.addEmployee(response.data);
                setEmployee({
                        user: {
                            username: '',
                            first_name: '',
                            last_name: '',
                            email: '',
                            password: '',
                        },
                        departament: department.id,
                        position: position.id,
                        level_position: levelPosition.id,
                        salary: -1,

                    },
                );
                setDepartment({id: -1, name: 'please choice'});
                setPosition({id: -1, name: 'please choice'});
                setLevelPosition({id: -1, name: 'please choice'});
                setErrors([]);
            })
            .catch((error) => {
                setErrors(parse_errors(error.response.data));
            })
            .finally(() => setIsLoading(false));
    }
    return (
        <>
            <>
                <form className="p-4 m-auto" style={{maxWidth: 500}}>
                    <div
                        hidden={errors.length === 0}>
                        {errors.map(error =>
                            <div
                                className="alert alert-danger"
                                role="alert"
                                key={error}
                            >
                                {error}
                            </div>
                        )}
                    </div>
                    <label className="form-label mb">Choice department</label>
                    <div className="mb-3">
                        <Dropdown
                            data={store.departments}
                            choiceItem={department}
                            setChoiceItem={setDepartment}
                        />
                    </div>
                    <label className="form-label mb">Choice position</label>
                    <div className="mb-3">
                        <Dropdown
                            data={store.positions}
                            choiceItem={position}
                            setChoiceItem={setPosition}
                        />
                    </div>
                    <label className="form-label mb">Choice level position</label>
                    <div className="mb-3">
                        <Dropdown
                            data={store.levelPositions}
                            choiceItem={levelPosition}
                            setChoiceItem={setLevelPosition}
                        />
                    </div>
                    <label className="form-label">Username</label>
                    <div className="input-group mb-1">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="username"
                            value={employee.user.username}
                            onChange={
                                event =>
                                    setEmployee({...employee, user: {...employee.user, username: event.target.value}})
                            }
                        />
                    </div>
                    <label className="form-label">Email</label>
                    <div className="input-group mb-1">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="email"
                            value={employee.user.email}
                            onChange={
                                event =>
                                    setEmployee({...employee, user: {...employee.user, email: event.target.value}})
                            }
                        />
                    </div>
                    <label className="form-label">First name</label>
                    <div className="input-group mb-1">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Jonh"
                            value={employee.user.first_name}
                            onChange={
                                event =>
                                    setEmployee({...employee, user: {...employee.user, first_name: event.target.value}})
                            }
                        />
                    </div>
                    <label className="form-label">Last name</label>
                    <div className="input-group mb-1">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Rosso"
                            value={employee.user.last_name}
                            onChange={
                                event =>
                                    setEmployee({...employee, user: {...employee.user, last_name: event.target.value}})
                            }
                        />
                    </div>
                    <label className="form-label">Salary</label>
                    <div className="input-group mb-1">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="25000"
                            onChange={
                                event =>
                                    setEmployee({...employee, salary: Number(event.target.value)})
                            }
                        />
                    </div>
                    <label className="form-label">Password</label>
                    <div className="input-group mb-1">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="25000"
                            value={employee.user.password}
                            onChange={
                                event =>
                                    setEmployee({...employee, user: {...employee.user, password: event.target.value}})
                            }
                        />
                    </div>
                    <label className="form-label">Repeat password</label>
                    <div className="input-group mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="password"
                            value={password}
                            onChange={
                                event =>
                                    setPassword(event.target.value)
                            }
                        />
                    </div>
                    <CustomButton
                        onClick={() => {
                            if (password !== employee.user.password) {
                                if (!errors.includes('Passwords dont match',)) {
                                    setErrors([...errors, 'Passwords dont match']);
                                }
                            } else {
                                createEmployee();
                            }
                        }}
                    >
                        {isLoading ? <Spinner/> : "create"}
                    </CustomButton>
                </form>
            </>
        </>
    );
}


export default observer(CreateEmployeeForm);
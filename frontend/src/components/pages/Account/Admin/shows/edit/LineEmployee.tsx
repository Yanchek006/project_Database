import {FC, useContext, useState} from "react";
import {ResponseEmployee} from "../ShowEmployee.tsx";
import {Context, PStore} from "../../../../../../main.tsx";
import Spinner from "../../../../../ux/Spinner.tsx";
import Dropdown, {Item} from "../../../../../ui/Dropdown.tsx";
import $api from "../../../../../../http";

interface Props {
    deleteFunction: (id: number) => void,
    item: ResponseEmployee,
    isLoadingDelete: boolean,
}

interface EditUser {
    username: string,
    first_name: string,
    last_name: string,
    email: string,
}

interface EditEmployee {
    user: EditUser,
    departament: number,
    position: number,
    level_position: number,
    salary: number,
}

const LineEmployee: FC<Props> = ({deleteFunction, isLoadingDelete, item}) => {
    const {store} = useContext<PStore>(Context);
    const [isEdit, setIsEdit] = useState(false);
    const [newItem, setNewItem] = useState<ResponseEmployee>(item);
    const [isLoading, setIsLoading] = useState(false);

    const [department, setDepartment] = useState<Item>(item.departament);
    const [position, setPosition] = useState<Item>(item.position);
    const [levelPosition, setLevelPosition] = useState<Item>(item.level_position);

    const editEmployee = (id: number) => {
        let employee: EditEmployee | any = {
            user: newItem.user,
            departament: department.id,
            position: position.id,
            level_position: levelPosition.id,
            salary: Number(newItem.salary),
        };

        if  (employee.user.username === item.user.username) {
            delete employee.user.username;
        }

        setIsLoading(true);
        $api.put<ResponseEmployee>(`/employee/${id}/`, employee)
            .then((response) => {
                store.setEntityById(store.employees, id, response.data);
                setNewItem(response.data);
                setIsEdit(false);
            })
            .catch(() => {
                setNewItem(item);
                setDepartment(item.departament);
                setPosition(item.position);
                setLevelPosition(item.level_position);
            })
            .finally(() => setIsLoading(false));
    }
    return (
        <>
            <th scope="row">{item.id}</th>
            <td>
                {isEdit ?
                    <input
                        disabled={!isEdit}
                        className="form-control text-nowrap"
                        value={newItem.user.username}
                        onChange={
                            event =>
                                setNewItem({...newItem, user: {...newItem.user, username: event.target.value}})
                        }
                    />
                    :
                    <div className="form-control bg-secondary-subtle text-nowrap">
                        {newItem.user.username}
                    </div>
                }
            </td>
            <td>
                {isEdit ?
                    <input
                        disabled={!isEdit}
                        className="form-control text-nowrap"
                        value={newItem.user.first_name}
                        onChange={
                            event =>
                                setNewItem({...newItem, user: {...newItem.user, first_name: event.target.value}})
                        }
                    />
                    :
                    <div className="form-control bg-secondary-subtle text-nowrap">
                        {newItem.user.first_name}
                    </div>
                }

            </td>
            <td>
                {isEdit ?
                    <input
                        disabled={!isEdit}
                        className="form-control text-nowrap"
                        value={newItem.user.last_name}
                        onChange={
                            event =>
                                setNewItem({...newItem, user: {...newItem.user, last_name: event.target.value}})
                        }
                    />
                    :
                    <div className="form-control bg-secondary-subtle text-nowrap">
                        {newItem.user.last_name}
                    </div>
                }
            </td>
            <td>
                {isEdit ?
                    <input
                        disabled={!isEdit}
                        className="form-control text-nowrap"
                        value={newItem.user.email}
                        onChange={
                            event =>
                                setNewItem({...newItem, user: {...newItem.user, email: event.target.value}})
                        }
                    />
                    :
                    <div className="form-control bg-secondary-subtle text-nowrap">
                        {newItem.user.email}
                    </div>
                }
            </td>
            <td>
                {isEdit ?
                    <Dropdown
                        data={store.departments}
                        choiceItem={department}
                        setChoiceItem={setDepartment}
                    />
                    :
                    <div className="form-control bg-secondary-subtle text-nowrap">
                        {newItem.departament.name}
                    </div>
                }
            </td>
            <td>
                {
                    !isEdit &&
                    <div className="form-control bg-secondary-subtle text-nowrap">
                        {newItem.departament.address}
                    </div>
                }
            </td>
            <td>
                {isEdit ?
                    <Dropdown
                        data={store.positions}
                        choiceItem={position}
                        setChoiceItem={setPosition}
                    />
                    :
                    <div className="form-control bg-secondary-subtle text-nowrap">
                        {newItem.position.name}
                    </div>
                }
            </td>
            <td>
                {isEdit ?
                    <Dropdown
                        data={store.levelPositions}
                        choiceItem={levelPosition}
                        setChoiceItem={setLevelPosition}
                    />
                    :
                    <div className="form-control bg-secondary-subtle text-nowrap">
                        {newItem.level_position.name}
                    </div>
                }
            </td>
            <td>
                {
                    !isEdit &&
                    <div className="form-control bg-secondary-subtle text-nowrap">
                        {newItem.level_position.coefficient_salary}
                    </div>
                }
            </td>
            <td>
                {isEdit ?
                    <input
                        disabled={!isEdit}
                        className="form-control text-nowrap"
                        value={newItem.salary}
                        type="number"
                        onChange={
                            event =>
                                setNewItem({...newItem, salary: event.target.value})
                        }
                    />
                    :
                    <div className="form-control bg-secondary-subtle text-nowrap">
                        {newItem.salary}
                    </div>
                }
            </td>
            <td>
                {!isEdit &&
                    <div
                        className="form-control bg-secondary-subtle text-nowrap"

                    >
                        {Number(newItem.level_position.coefficient_salary) * Number(newItem.salary)}
                    </div>
                }
            </td>

            <td>
                <div className="btn btn-danger text-nowrap" onClick={() => deleteFunction(item.id)}>
                    {isLoadingDelete ? <Spinner/> :
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                             fill="currentColor" className="bi bi-trash mb-1" viewBox="0 0 16 16">
                            <path
                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                            <path
                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                        </svg>}
                </div>
            </td>
            <td>
                <div className={isEdit ? "btn btn-primary text-nowrap" : "btn btn-success text-nowrap"} onClick={() => {
                    if (isEdit) {
                        editEmployee(item.id);
                    }

                    setIsEdit(!isEdit);
                }}>
                    {isEdit ? isLoading ? <Spinner/> : "save" :
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                             fill="currentColor" className="bi bi-pencil-square mb-1"
                             viewBox="0 0 16 16">
                            <path
                                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd"
                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>}
                </div>
            </td>
        </>
    );
}

export default LineEmployee;
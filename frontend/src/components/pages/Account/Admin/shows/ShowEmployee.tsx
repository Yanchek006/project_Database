import {FC, useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {User} from "../../../../../models/response/RequestResponse.ts";
import {ResponsePosition} from "../forms/CreatePositionFrom.tsx";
import {ResponseDepartment} from "./ShowDepartment.tsx";
import {ResponseLevelPosition} from "./ShowLevelPosition.tsx";
import {Context, PStore} from "../../../../../main.tsx";
import $api from "../../../../../http";
import Spinner from "../../../../ux/Spinner.tsx";
import LineEmployee from "./edit/LineEmployee.tsx";

export interface ResponseEmployee {
    id: number,
    user: User
    departament: ResponseDepartment,
    position: ResponsePosition,
    level_position: ResponseLevelPosition,
    salary: string,
}

const ShowEmployee: FC = () => {
    const {store} = useContext<PStore>(Context);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        $api.get<ResponseEmployee[]>("/employee/")
            .then(response => store.setEmployees(response.data))
            .finally(() => setIsLoading(false));
    }, []);

    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const deleteEmployee = (id: number) => {
        setIsLoadingDelete(true);
        $api.delete(`/employee/${id}/`)
            .then(() => {
                store.removeEntityById(store.employees, id);
            })
            .finally(() => setIsLoadingDelete(false));
    }

    return (
        <>
            <div className="table-responsive ms-4 me-4">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th className="text-nowrap" scope="col">Id</th>
                        <th className="text-nowrap" scope="col">Username</th>
                        <th className="text-nowrap" scope="col">First name</th>
                        <th className="text-nowrap" scope="col">Last name</th>
                        <th className="text-nowrap" scope="col">Email</th>
                        <th className="text-nowrap" scope="col">Department name</th>
                        <th className="text-nowrap" scope="col">Department address</th>
                        <th className="text-nowrap" scope="col">Position</th>
                        <th className="text-nowrap" scope="col">Level position</th>
                        <th className="text-nowrap" scope="col">Level position coefficient</th>
                        <th className="text-nowrap" scope="col">Salary</th>
                        <th className="text-nowrap" scope="col">Finish salary</th>
                        <th className="text-nowrap" scope="col">delete</th>
                        <th className="text-nowrap" scope="col">edit</th>
                    </tr>
                    </thead>

                    {!isLoading && <tbody>

                    {store.employees.map((item) => {
                        return (
                            <tr key={item.id}>
                                <LineEmployee deleteFunction={deleteEmployee} item={item}
                                              isLoadingDelete={isLoadingDelete}/>
                            </tr>
                        )
                    })}

                    </tbody>
                    }
                </table>
                {isLoading &&
                    <div className="text-center">
                        <Spinner/>
                    </div>
                }
            </div>
        </>
    );
}

export default observer(ShowEmployee);
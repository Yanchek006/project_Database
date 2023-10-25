import {FC, useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {Context, PStore} from "../../../../../main.tsx";
import $api from "../../../../../http";
import Spinner from "../../../../ux/Spinner.tsx";
import LineDepartment from "./edit/LineDepartmnet.tsx";

export interface ResponseDepartment {
    id: number,
    name: string,
    address: string,
}

const ShowDepartment: FC = () => {
    const {store} = useContext<PStore>(Context);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        $api.get<ResponseDepartment[]>("/department/")
            .then(response => store.setDepartments(response.data))
            .finally(() => setIsLoading(false));
    }, []);

    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const deleteDepartment = (id: number) => {
        setIsLoadingDelete(true)
        $api.delete(`/department/${id}/`)
            .then(() => {
                store.removeEntityById(store.departments, id);
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
                        <th className="text-nowrap" scope="col">Name</th>
                        <th className="text-nowrap" scope="col">Address</th>
                        <th className="text-nowrap" scope="col">delete</th>
                        <th className="text-nowrap" scope="col">edit</th>
                    </tr>
                    </thead>

                    {!isLoading && <tbody>

                    {store.departments.map((item) => {
                        return (
                            <tr key={item.id}>
                                <LineDepartment
                                    deleteFunction={deleteDepartment}
                                    item={item}
                                    isLoadingDelete={isLoadingDelete}
                                />
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

export default observer(ShowDepartment);
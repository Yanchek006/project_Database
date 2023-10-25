import {FC, useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {Context, PStore} from "../../../../../main.tsx";
import $api from "../../../../../http";
import Spinner from "../../../../ux/Spinner.tsx";
import LineState from "./edit/LineState.tsx";

export interface ResponseState {
    id: number,
    name: string,
}

const ShowState: FC = () => {
    const {store} = useContext<PStore>(Context);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        $api.get<ResponseState[]>("/state/")
            .then(response => store.setStates(response.data))
            .finally(() => setIsLoading(false));
    }, []);

    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const deleteState = (id: number) => {
        setIsLoadingDelete(true);
        $api.delete(`/state/${id}/`)
            .then(() => {
                store.removeEntityById(store.states, id);
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
                        <th className="text-nowrap" scope="col">delete</th>
                        <th className="text-nowrap" scope="col">edit</th>
                    </tr>
                    </thead>

                    {!isLoading && <tbody>

                    {store.states.map((item) => {
                        return (
                            <tr key={item.id}>
                                <LineState
                                    item={item}
                                    deleteFunction={deleteState}
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

export default observer(ShowState);
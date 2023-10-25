import {FC, useContext, useEffect, useState} from "react";
import {ResponsePosition} from "../forms/CreatePositionFrom.tsx";
import $api from "../../../../../http";
import Spinner from "../../../../ux/Spinner.tsx";
import {observer} from "mobx-react-lite";
import {Context, PStore} from "../../../../../main.tsx";
import LinePosition from "./edit/LinePosition.tsx";

const ShowPosition: FC = () => {
    const {store} = useContext<PStore>(Context);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        $api.get<ResponsePosition[]>("/position/")
            .then(response => store.setPositions(response.data))
            .finally(() => setIsLoading(false));
    }, []);

    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const deletePosition = (id: number) => {
        setIsLoadingDelete(true);
        $api.delete(`/position/${id}/`)
            .then(() => {
                store.removeEntityById(store.positions, id);
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

                    {store.positions.map((position) => {
                        return (
                            <tr key={position.id}>
                                <LinePosition deleteFunction={deletePosition} item={position}
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

export default observer(ShowPosition);
import {FC, useContext, useEffect, useState} from "react";
import {RequestResponse} from "../../../../../models/response/RequestResponse.ts";
import Spinner from "../../../../ux/Spinner.tsx";
import $api from "../../../../../http";
import LineRequest from "./lines/LineRequest.tsx";
import {ResponseState} from "../../Admin/shows/ShowState.tsx";
import {observer} from "mobx-react-lite";
import {Context, PStore} from "../../../../../main.tsx";

const RequestTable: FC = () => {
    const {store} = useContext<PStore>(Context);
    const [states, setStates] = useState<ResponseState[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        $api.get<RequestResponse[]>("/request/")
            .then(response => {
                store.setRequests(response.data);
            })
            .finally(() => setIsLoading(false));

        $api.get<ResponseState[]>("/state/")
            .then(response => {
                setStates(response.data);
            })

    }, []);

    return (
        <>
            {isLoading ?
                <div className="text-center">
                    <Spinner/>
                </div> :
                <>
                    {store.requests.length !== 0 &&
                        <div className="table-responsive ms-4 me-4">
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th className="text-nowrap" scope="col">№</th>
                                    <th className="text-nowrap" scope="col">customer</th>
                                    <th className="text-nowrap" scope="col">description</th>
                                    <th className="text-nowrap" scope="col">start time</th>
                                    <th className="text-nowrap" scope="col">state</th>
                                    <th className="text-nowrap" scope="col">action</th>
                                </tr>
                                </thead>

                                <tbody>
                                {
                                    store.requests.map((request, index) =>
                                        <tr key={request.id}>
                                            <LineRequest
                                                data={states}
                                                request={request}
                                                index={index}
                                            />
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    }
                </>
            }
        </>
    );
}

export default observer(RequestTable);
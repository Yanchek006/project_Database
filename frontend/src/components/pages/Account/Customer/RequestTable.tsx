import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {RequestResponse} from "../../../../models/response/RequestResponse.ts";
import $api from "../../../../http";
import Spinner from "../../../ux/Spinner.tsx";
import {formattedDate} from "../../../../utils";

interface Props {
    requests: RequestResponse[],
    setRequests: Dispatch<SetStateAction<RequestResponse[]>>,
}

const RequestTable: FC<Props> = ({requests, setRequests}) => {
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        $api.get<RequestResponse[]>("/request/")
            .then(response => {
                setRequests(response.data);
            })
            .finally(() => setIsLoading(false))
    }, []);
    return (
        <>
            <div className="ms-4 me-4 pt-2 text-center border-top">
                YOU REQUESTS
            </div>

            <div className="table-responsive ms-4 me-4">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th className="text-nowrap" scope="col">№</th>
                        <th className="text-nowrap" scope="col">Manager FCs</th>
                        <th className="text-nowrap" scope="col">Manager email</th>
                        <th className="text-nowrap" scope="col">Date create</th>
                        <th className="text-nowrap" scope="col">Description</th>
                        <th className="text-nowrap" scope="col">Price list</th>
                        <th className="text-nowrap" scope="col">Status</th>
                    </tr>
                    </thead>

                    {!isLoading && <tbody>

                    {requests.map((request, index) => {
                        const dateObject = new Date(request.create_time);
                        return (
                            <tr key={request.id}>
                                <th scope="row">{index + 1}</th>
                                <td className="text-nowrap">{`${request.manager.user.first_name} ${request.manager.user.last_name[0]}.`}</td>
                                <td className="text-nowrap">{request.manager.user.email}</td>
                                <td className="text-nowrap">{formattedDate(dateObject)}</td>
                                <td className="text-nowrap">{`${request.description.slice(0, 40)}...`}</td>
                                <td className="text-nowrap">{`${request.price_list.name} ${request.price_list.price}`}</td>
                                <td className="text-nowrap">{request.state.name}</td>
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

export default RequestTable;
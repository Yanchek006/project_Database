import {FC, useContext, useState} from "react";
import {RequestResponse} from "../../../../../../models/response/RequestResponse.ts";
import {formattedDate} from "../../../../../../utils";
import Dropdown, {Item} from "../../../../../ui/Dropdown.tsx";
import $api from "../../../../../../http";
import {Context, PStore} from "../../../../../../main.tsx";
import Spinner from "../../../../../ux/Spinner.tsx";

interface Props {
    request: RequestResponse,
    index: number,
    data: Item[],
}

const LineRequest: FC<Props> = ({request, index, data}) => {
    const {store} = useContext<PStore>(Context);
    const [isEdit, setIsEdit] = useState(false);
    const [item, setItem] = useState<Item>(request.state);
    const [isLoading, setIsLoading] = useState(false);

    const edit = () => {
        setIsLoading(true);
        $api.put<RequestResponse>(`/request/state/${request.id}/`, {
            state: item.id,
        }).then(response => {
            store.setEntityById(store.requests, request.id, response.data);
        }).finally(() => {
            setIsLoading(false);
            setIsEdit(false);
        });
    }

    return (
        <>
            <th scope="row">{index + 1}</th>
            <td>
                <div className="form-control bg-secondary-subtle text-nowrap">
                    {`${request.customer.user.first_name} ${request.customer.user.last_name}`}
                </div>
            </td>
            <td>
                <div className="form-control bg-secondary-subtle text-nowrap">
                    {request.description}
                </div>
            </td>
            <td>
                <div className="form-control bg-secondary-subtle text-nowrap">
                    {formattedDate(new Date(request.create_time))}
                </div>
            </td>
            <td>
                {isEdit ?
                    <Dropdown
                        data={data}
                        choiceItem={item}
                        setChoiceItem={setItem}
                    />
                    :
                    <div className="form-control bg-secondary-subtle text-nowrap">
                        {request.state.name}
                    </div>
                }
            </td>
            <td>
                <div
                    className={isEdit ? "btn btn-success" : "btn btn-primary"}
                    onClick={() => !isLoading && setIsEdit(!isEdit)}
                >
                    {isEdit ? <div
                        onClick={() => edit()}
                    >
                        {isLoading ? <Spinner/> : "save"}
                    </div> : "edit" }
                </div>
            </td>
        </>
    );
}

export default LineRequest;
import {FC, useEffect, useState} from "react";
import CustomButton from "../../../ui/CustomButton.tsx";
import Dropdown, {Item} from "../../../ui/Dropdown.tsx";
import $api from "../../../../http";
import {PriceListResponse} from "../../../../models/response/PriceListResponse.ts";
import RequestTable from "./RequestTable.tsx";
import {RequestResponse} from "../../../../models/response/RequestResponse.ts";
import Spinner from "../../../ux/Spinner.tsx";
import {parse_errors} from "../../../../store/store.ts";

const CustomerAccount: FC = () => {
    const [items, setItems] = useState<Item[]>([{
        name: "choice item",
        id: -1,
    }]);
    const [item, setItem] = useState<Item>(items[0]);
    const [requests, setRequests] = useState<RequestResponse[]>([]);
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        $api.get<PriceListResponse[]>("/priceList/")
            .then(response => {
                const data: Item[] = [];
                for (let item of response.data) {
                    data.push({name: `${item.name} ${item.price}`, id: item.id});
                }
                setItems(data);
            });
    }, []);

    const [errors, setErrors] = useState<any[]>([])

    const createRequest = () => {
        if (item.id !== -1) {
            setIsLoading(true);
            $api.post<RequestResponse>("/request/create/", {
                description: description,
                price_list: item.id,
            })
                .then(response => {
                    setRequests([...requests, response.data]);
                    setErrors([]);
                    setDescription("");
                })
                .catch(error =>
                        setErrors(parse_errors(error.response.data))
                )
                .finally(() => setIsLoading(false));
        } else {
            setErrors([...errors, 'Price list: require'])
        }
    };


    return (
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
                <label className="form-label mb">Choice from price list</label>
                <div className="mb-3">
                    <Dropdown data={items} choiceItem={item} setChoiceItem={setItem}/>
                </div>
                <label className="form-label">Description you request</label>
                <div className="input-group mb-3">
                    <textarea
                        onChange={event => setDescription(event.target.value)}
                        value={description}
                        className="form-control"
                        placeholder="I am looking to create a website for my business, and I am seeking a professional web development service to help bring my vision to life."
                    />
                </div>
                <CustomButton
                    onClick={() => createRequest()}
                >
                    {isLoading ? <Spinner/> : 'create'}
                </CustomButton>
            </form>

            <RequestTable requests={requests} setRequests={setRequests}/>
        </>
    );
}

export default CustomerAccount;
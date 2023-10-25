import {FC, useContext, useState} from "react";
import CustomButton from "../../../../ui/CustomButton.tsx";
import Spinner from "../../../../ux/Spinner.tsx";
import {Context, PStore} from "../../../../../main.tsx";
import $api from "../../../../../http";
import {parse_errors} from "../../../../../store/store.ts";
import {ResponsePriceList} from "../shows/ShowPriceList.tsx";

export interface CreatePriceList{
    name: string,
    price: number,
}
const CretePriceListForm: FC = () => {
    const {store} = useContext<PStore>(Context);
    const [priceList, setPriceList] = useState<CreatePriceList>({
        name: "",
        price: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any[]>([]);

    const createPriceList = () => {
        setIsLoading(true);
        $api.post<ResponsePriceList>("/priceList/create/", priceList)
            .then((response) => {
                store.addPriceList(response.data);
                setPriceList({name: "", price: 0});
                setErrors([]);
            })
            .catch((error) => {
                setErrors(parse_errors(error.response.data));
            })
            .finally(() => setIsLoading(false));
    }
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
                <label className="form-label">Name for price list</label>
                <div className="input-group mb-3">
                    <input
                        value={priceList.name}
                        onChange={event => setPriceList({...priceList, name: event.target.value})}
                        type="text"
                        className="form-control"
                        placeholder="Defualt web-site contains bakend & frontend"
                    />
                </div>

                <label className="form-label">Price for price list</label>
                <div className="input-group mb-3">
                    <input
                        // TODO
                        onChange={event => setPriceList({...priceList, price: Number(event.target.value)})}
                        type="number"
                        className="form-control"
                        placeholder="50000"
                        min={15000}
                    />
                </div>
                <CustomButton
                    onClick={() => createPriceList()}
                >
                    {isLoading ? <Spinner/> : "create"}
                </CustomButton>
            </form>
        </>
    );
}

export default CretePriceListForm;
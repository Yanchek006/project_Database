import {FC, useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {Context, PStore} from "../../../../../main.tsx";
import $api from "../../../../../http";
import Spinner from "../../../../ux/Spinner.tsx";
import LinePriceList from "./edit/LinePriceList.tsx";

export interface ResponsePriceList {
    id: number,
    name: string,
    price: string,
}

const ShowPriceList: FC = () => {
    const {store} = useContext<PStore>(Context);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        $api.get<ResponsePriceList[]>("/priceList/")
            .then(response => store.setPriceLists(response.data))
            .finally(() => setIsLoading(false));
    }, []);

    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const deletePriceList = (id: number) => {
        setIsLoadingDelete(true);
        $api.delete(`/priceList/${id}/`)
            .then(() => {
                store.removeEntityById(store.priceLists, id);
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
                        <th className="text-nowrap" scope="col">Price</th>
                        <th className="text-nowrap" scope="col">delete</th>
                        <th className="text-nowrap" scope="col">edit</th>
                    </tr>
                    </thead>

                    {!isLoading && <tbody>

                    {store.priceLists.map((item) => {
                        return (
                            <tr key={item.id}>
                                <LinePriceList deleteFunction={deletePriceList} item={item}
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

export default observer(ShowPriceList);
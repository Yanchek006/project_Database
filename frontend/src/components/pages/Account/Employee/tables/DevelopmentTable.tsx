import {FC, ReactNode, useContext, useEffect, useState} from "react";
import $api from "../../../../../http";
import {ResponseState} from "../../Admin/shows/ShowState.tsx";
import Spinner from "../../../../ux/Spinner.tsx";
import LineDevelopment from "./lines/LineDevelopment.tsx";
import {Context, PStore} from "../../../../../main.tsx";
import {observer} from "mobx-react-lite";

interface ResponseRequestForDevelopment {
    id: number,
    description: string,
    create_time: string,
    state: number,
    price_list: number,
    customer: number,
    manager: number,
}

export interface ResponseDevelopment {
    id: number,
    employees: number[],
    start_time: string,
    last_change: string,
    state: ResponseState,
    request: ResponseRequestForDevelopment
}

interface Props {
    my?: boolean,
    title: string,
    children: ReactNode,
    action: (id: number) => void,
}

const DevelopmentTable: FC<Props> = ({my, title, children, action}) => {
    const {store} = useContext<PStore>(Context);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        $api.get<ResponseDevelopment[]>("/development/", {
            params: {
                my: my ? "true" : "false",
            }
        })
            .then(response => {
                if (my) {
                    store.setYouDevelopments(response.data);
                } else {
                    store.setNotYouDevelopments(response.data);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    const getDevelopments = () => {
        if (my) {
            return store.youDevelopments;
        } else {
            return store.notYouDevelopments;
        }
    }

    const developments = getDevelopments();

    return (
        <>
            <div className="text-center mt-4">
                {title} {developments.length === 0 && "is empty"}
            </div>

            {developments.length !== 0 &&
                <div className="table-responsive ms-4 me-4">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th className="text-nowrap" scope="col">№</th>
                            <th className="text-nowrap" scope="col">description</th>
                            <th className="text-nowrap" scope="col">start time</th>
                            <th className="text-nowrap" scope="col">state</th>
                            <th className="text-nowrap" scope="col">action</th>
                        </tr>
                        </thead>

                        {!isLoading &&
                            <tbody>
                            {
                                developments.map((development, index) =>
                                    <tr key={development.id}>
                                        <LineDevelopment
                                            development={development}
                                            index={index}
                                            children={children}
                                            action={action}
                                        />
                                    </tr>
                                )
                            }
                            </tbody>
                        }
                    </table>
                    {isLoading &&
                        <div className="text-center">
                            <Spinner/>
                        </div>
                    }
                </div>
            }
        </>
    );
}

export default observer(DevelopmentTable);
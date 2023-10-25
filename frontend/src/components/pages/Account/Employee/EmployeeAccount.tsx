import {FC, useContext, useState} from "react";
import DevelopmentTable, {ResponseDevelopment} from "./tables/DevelopmentTable.tsx";
import {Context, PStore} from "../../../../main.tsx";
import $api from "../../../../http";
import Spinner from "../../../ux/Spinner.tsx";
import {useNavigate} from "react-router-dom";
import RequestTable from "./tables/RequestTable.tsx";

const EmployeeAccount: FC = () => {
    const {store} = useContext<PStore>(Context);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <DevelopmentTable
                my={false}
                title={"DEVELOPMENTS"}
                action={(id: number) => {
                    setIsLoading(true);
                    $api.post<ResponseDevelopment>("/development/attach/employee/", {id: id})
                        .then((response) => {
                            store.removeEntityById(store.notYouDevelopments, id);
                            store.addYouDevelopment(response.data);
                        })
                        .finally(() => setIsLoading(false));
                }}
            >
                <div className="btn btn-success">{isLoading ? <Spinner/> : "join"}</div>
            </DevelopmentTable>
            <DevelopmentTable
                my={true}
                title={"You are a member of developments"}
                action={(id: number) => navigate(`/development/${id}`)}
            >
                <div className="btn btn-primary">view</div>
            </DevelopmentTable>

            <RequestTable/>
        </>
    );
}

export default EmployeeAccount;
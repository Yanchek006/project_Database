import {FC, useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import $api from "../../../../http";
import {Context, PStore} from "../../../../main.tsx";
import Spinner from "../../../ux/Spinner.tsx";
import {formattedDate} from "../../../../utils";
import {ResponseState} from "../Admin/shows/ShowState.tsx";
import {ResponseEmployee} from "../Admin/shows/ShowEmployee.tsx";
import EmployeeTable from "./tables/EmployeeTable.tsx";
import DocumentationTable from "./tables/DocumentationTable.tsx";
import {ModalWindow} from "../../../ui/ModalWindow.tsx";
import DocumentationForm from "./forms/DocumentationForm.tsx";


export interface ResponseDocumentation {
    id: number,
    state: ResponseState,
    create_time: string,
    last_change: string,
    text: string,
    development: number,
    employees: ResponseEmployee[],
}

export interface SmallRequest {
    id: number,
    description: string,
    create_time: string,
    state: number,
    price_list: number,
    customer: number,
    manager: number,
}

export interface FullResponseDevelopment {
    id: number,
    state: ResponseState,
    request: SmallRequest,
    employees: ResponseEmployee[],
    documentations: ResponseDocumentation[],
    start_time: string,
    last_change: string,
    my_documentations?: number[],
}


const DevelopmentPage: FC = () => {
    const navigate = useNavigate();
    const {store} = useContext<PStore>(Context);
    const {id} = useParams();
    const [development, setDevelopment] = useState<FullResponseDevelopment | undefined>(undefined);
    const [isLoadingLeave, setIsLoadingLeave] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const [isLoadingJoin, setIsLoadingJoin] = useState(false);
    const [isLoadingLeaveDocumentation, setIsLoadingLeaveDocumentation] = useState(false);

    const [modalWindow, setModalWindow] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        $api.get<FullResponseDevelopment>(`/development/${id}`, {
            params: {
                my: 'true',
            }
        })
            .then(response => {
                setDevelopment(response.data);
                store.setNotYouDocumentations(response.data.documentations);
                store.setYouDocumentations([]);
                if (response.data.my_documentations) {
                    for (const id of response.data.my_documentations) {
                        const documentation = store.getEntityById(store.notYouDocumentations, id);
                        if (documentation) {
                            store.addYouDocumentation(documentation as ResponseDocumentation);
                            store.removeEntityById(store.notYouDocumentations, id);
                        }
                    }
                }
            })
            .finally(() => setIsLoading(false))
    }, []);

    const leave = () => {
        if (development === undefined) {
            return;
        }

        setIsLoadingLeave(true);
        $api.post("/development/leave/employee/", {
            id: development.id
        })
            .then(response => {
                store.removeEntityById(store.youDevelopments, development.id);
                store.addNotYouDevelopment(response.data);
                navigate(-1);
            })
            .finally(() => setIsLoadingLeave(false));
    }

    const joinDocumentation = (id: number) => {
        setIsLoadingJoin(true);
        $api.post<ResponseDocumentation>("/documentation/attach/employee/", {
            id: id,
        }).then(response => {
            store.removeEntityById(store.notYouDocumentations, id);
            store.addYouDocumentation(response.data);
        }).finally(() => setIsLoadingJoin(false))
    }

    const leaveDocumentation = (id: number) => {
        setIsLoadingLeaveDocumentation(true);
        $api.post<ResponseDocumentation>("/documentation/leave/employee/", {
            id: id,
        }).then(response => {
            store.removeEntityById(store.youDocumentations, id);
            store.addNotYouDocumentation(response.data);
        }).finally(() => setIsLoadingLeaveDocumentation(false))
    }

    if (isLoading || development === undefined) {
        return (
            <div className="text-center">
                <Spinner/>
            </div>
        );
    }

    return (
        <>

            <div className="table-responsive ms-4 me-4 mt-4">
                <table className="m-auto">
                    <tbody>
                    <tr>
                        <td className="pe-2">
                            <div className="form-control bg-secondary-subtle text-nowrap">
                                {development.request.description}
                            </div>
                        </td>
                        <td className="pe-2">
                            <div className="form-control bg-secondary-subtle text-nowrap">
                                {formattedDate(new Date(development.last_change))}
                            </div>
                        </td>
                        <td className="pe-2">
                            <div className="form-control bg-secondary-subtle text-nowrap">
                                {development.state.name}
                            </div>
                        </td>
                        <td className="pe-2">
                            <div className="btn btn-success d-flex align-items-center"
                                 onClick={() => setModalWindow(true)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16" height="16"
                                    fill="currentColor"
                                    className="bi bi-plus-square-fill mt-1 me-2"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
                                </svg>
                                <div>
                                    documentation
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="btn btn-danger" onClick={() => leave()}>
                                {isLoadingLeave ? <Spinner/> : "leave"}
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <EmployeeTable employees={development.employees}/>
            {store.notYouDocumentations.length !== 0 &&
                <DocumentationTable
                    documentations={store.notYouDocumentations}
                    title="Not you documentation"
                    action={joinDocumentation}
                    isEdit={false}
                >
                    <div
                        className={"btn btn-success"}
                    >
                        {isLoadingJoin ? <Spinner/> : "join"}
                    </div>
                </DocumentationTable>
            }
            {store.youDocumentations.length !== 0 &&
                <DocumentationTable
                    documentations={store.youDocumentations}
                    title="You documentation"
                    action={leaveDocumentation}
                    isEdit={true}
                >
                    <div
                        className={"btn btn-danger"}
                    >
                        {isLoadingLeaveDocumentation ? <Spinner/> : "leave"}
                    </div>
                </DocumentationTable>
            }
            <ModalWindow active={modalWindow} setActive={setModalWindow}>
                <DocumentationForm
                    development={Number(id)}
                />
            </ModalWindow>
        </>
    );
}

export default DevelopmentPage;
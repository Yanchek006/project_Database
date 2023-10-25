import {FC, ReactNode, useContext, useState} from "react";
import {ResponseDocumentation} from "../DevelopmentPage.tsx";
import LineDocumentation from "./lines/LineDocumentation.tsx";
import {ModalWindow} from "../../../../ui/ModalWindow.tsx";
import {observer} from "mobx-react-lite";
import $api from "../../../../../http";
import {Context, PStore} from "../../../../../main.tsx";
import Spinner from "../../../../ux/Spinner.tsx";

interface Props {
    title: string,
    documentations: ResponseDocumentation[],
    children: ReactNode,
    action: (id: number) => void,
    isEdit: boolean,
}

interface Response {
    text: string,
}

const DocumentationTable: FC<Props> = ({title, documentations, children, action, isEdit}) => {
    const [documentation, setDocumentation] = useState(documentations[0]);
    const [modalShow, setModalShow] = useState(false);
    const {store} = useContext<PStore>(Context);
    const [isLoading, setIsLoading] = useState(false);

    const updateDocumentation = (id: number) => {
        setIsLoading(true);
        $api.put<Response>(`/documentation/${id}/`, {
            text: documentation.text,
        }).then(response => {
            store.setEntityById(store.youDocumentations, id, {
                ...documentation,
                text: response.data.text
            } as ResponseDocumentation);
        }).finally(() => setIsLoading(false));
    }

    return (
        <>
            <div className="text-center mt-4">
                {title}
            </div>

            <div className="table-responsive ms-4 me-4">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th className="text-nowrap" scope="col">№</th>
                        <th className="text-nowrap" scope="col">state</th>
                        <th className="text-nowrap" scope="col">last change</th>
                        <th className="text-nowrap" scope="col">text</th>
                        <th className="text-nowrap" scope="col">show</th>
                        <th className="text-nowrap" scope="col">action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {documentations.map((documentation, index) =>
                        <tr key={documentation.id}>
                            <LineDocumentation
                                documentation={documentation}
                                index={index}
                                setDocumentation={setDocumentation}
                                setModal={setModalShow}
                                children={children}
                                action={action}
                            />
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <ModalWindow active={modalShow} setActive={setModalShow}>
                {isEdit ?
                    <div className="form-group m-4" style={{width: "70vw"}}>
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows={10}
                            value={documentation.text}
                            onChange={event => setDocumentation({...documentation, text: event.target.value})}
                        >
                        </textarea>
                        <div
                            className="btn btn-success mt-4"
                            onClick={() => updateDocumentation(documentation.id)}
                        >
                            {isLoading ? <Spinner/> : "edit"}
                        </div>
                    </div>
                    :
                    <div className="m-4">
                        {documentation.text}
                    </div>
                }
            </ModalWindow>
        </>
    );
}

export default observer(DocumentationTable);
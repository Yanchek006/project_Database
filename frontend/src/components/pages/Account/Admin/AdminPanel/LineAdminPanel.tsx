import {FC, ReactNode, useState} from "react";
import {ModalWindow} from "../../../../ui/ModalWindow.tsx";

export interface PropsLineAdminPanel {
    createFrom: ReactNode,
    showForm: ReactNode,
    description: string,
    name: string,
}

const LineAdminPanel: FC<PropsLineAdminPanel> = ({createFrom, showForm, description, name}) => {
    const [create, setCreate] = useState(false);
    const [show, setShow] = useState(false);

    return (
        <>
            <tr>
                <td className="text-nowrap">{name}</td>
                <td className="text-nowrap">{description}</td>
                <td>
                    <div className="btn btn-success text-nowrap" onClick={() => setCreate(true)}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16" height="16"
                            fill="currentColor"
                            className="bi bi-plus-square-fill mb-1"
                            viewBox="0 0 16 16">
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
                        </svg>
                    </div>
                </td>
                <td>
                    <div className="btn btn-primary text-nowrap" onClick={() => setShow(true)}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16" height="16"
                            fill="currentColor"
                            className="bi bi-eye mb-1"
                            viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                        </svg>
                    </div>
                </td>
            </tr>
            <>
                <ModalWindow active={create} setActive={setCreate}>
                    {createFrom}
                </ModalWindow>
                <ModalWindow active={show} setActive={setShow}>
                    {showForm}
                </ModalWindow>
            </>
        </>
    );
}

export default LineAdminPanel;
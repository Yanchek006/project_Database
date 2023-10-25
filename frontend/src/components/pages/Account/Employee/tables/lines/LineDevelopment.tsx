import {FC, ReactNode} from "react";
import {ResponseDevelopment} from "../DevelopmentTable.tsx";
import {formattedDate} from "../../../../../../utils";

interface Props {
    development: ResponseDevelopment,
    index: number,
    children: ReactNode,
    action: (id: number) => void,
}

const LineDevelopment: FC<Props> = ({development, index, children, action}) => {

    return (
        <>
            <th scope="row">{index + 1}</th>
            <td>
                <div className="form-control bg-secondary-subtle text-nowrap">
                    {development.request.description}
                </div>
            </td>
            <td>
                <div className="form-control bg-secondary-subtle text-nowrap">
                    {formattedDate(new Date(development.start_time))}
                </div>
            </td>
            <td>
                <div className="form-control bg-secondary-subtle text-nowrap">
                    {development.state.name}
                </div>
            </td>
            <td>
                <div onClick={() => action(development.id)}>
                    {children}
                </div>
            </td>
        </>
    );
}

export default LineDevelopment;
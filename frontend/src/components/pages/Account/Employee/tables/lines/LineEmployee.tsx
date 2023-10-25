import {FC} from "react";
import {ResponseEmployee} from "../../../Admin/shows/ShowEmployee.tsx";

interface Props {
    employee: ResponseEmployee,
    index: number,
}
const LineEmployee: FC<Props> = ({employee, index}) => {
    return (
        <>
            <th scope="row">
                <div className="">
                    {index + 1}
                </div>
            </th>
            <td>
                <div className="text-nowrap">
                    {employee.user.username}
                </div>
            </td>
            <td>
                <div className="text-nowrap">
                    {employee.user.first_name}
                </div>
            </td>
            <td>
                <div className="text-nowrap">
                    {employee.user.last_name}
                </div>
            </td>
            <td>
                <div className="text-nowrap">
                    {employee.user.email}
                </div>
            </td>
        </>
    );
}

export default LineEmployee;
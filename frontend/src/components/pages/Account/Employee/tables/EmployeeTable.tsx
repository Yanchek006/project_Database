import {FC} from "react";
import {ResponseEmployee} from "../../Admin/shows/ShowEmployee.tsx";
import LineEmployee from "./lines/LineEmployee.tsx";

interface Props {
    employees: ResponseEmployee[],
}

const EmployeeTable: FC<Props> = ({employees}) => {
    return (
        <>
            <div className="text-center mt-4">
                Employees
            </div>

            <div className="table-responsive ms-4 me-4">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th className="text-nowrap" scope="col">№</th>
                        <th className="text-nowrap" scope="col">username</th>
                        <th className="text-nowrap" scope="col">first name</th>
                        <th className="text-nowrap" scope="col">last name</th>
                        <th className="text-nowrap" scope="col">email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((employee, index) =>
                        <tr key={employee.id}>
                            <LineEmployee employee={employee} index={index}/>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default EmployeeTable;
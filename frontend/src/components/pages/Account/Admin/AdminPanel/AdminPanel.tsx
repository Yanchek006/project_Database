import {FC} from "react";
import LineAdminPanel, {PropsLineAdminPanel} from "./LineAdminPanel.tsx";
import CreateStateForm from "../forms/CreateStateForm.tsx";
import CretePriceListForm from "../forms/CretePriceListForm.tsx";
import CreatePositionFrom from "../forms/CreatePositionFrom.tsx";
import CreateDepartmentFrom from "../forms/CreateDepartmentFrom.tsx";
import CreateLevelPositionFrom from "../forms/CreateLevelPositionFrom.tsx";
import CreateEmployeeForm from "../forms/CreateEmployeeForm.tsx";
import ShowState from "../shows/ShowState.tsx";
import ShowPriceList from "../shows/ShowPriceList.tsx";
import ShowPosition from "../shows/ShowPosition.tsx";
import ShowDepartment from "../shows/ShowDepartment.tsx";
import ShowLevelPosition from "../shows/ShowLevelPosition.tsx";
import ShowEmployee from "../shows/ShowEmployee.tsx";

const data: PropsLineAdminPanel[] = [
    {
        name: "State",
        description: "state contain only name",
        createFrom: <CreateStateForm/>,
        showForm: <ShowState/>
    },
    {
        name: "Price list",
        description: "state contain only name",
        createFrom: <CretePriceListForm/>,
        showForm: <ShowPriceList/>
    },
    {
        name: "Position",
        description: "state contain only name",
        createFrom: <CreatePositionFrom/>,
        showForm: <ShowPosition/>
    },
    {
        name: "Department",
        description: "state contain only name",
        createFrom: <CreateDepartmentFrom/>,
        showForm: <ShowDepartment/>
    },
    {
        name: "Level position",
        description: "state contain only name",
        createFrom: <CreateLevelPositionFrom/>,
        showForm: <ShowLevelPosition/>
    },
    {
        name: "Employee",
        description: "state contain only name",
        createFrom: <CreateEmployeeForm/>,
        showForm: <ShowEmployee/>
    },
]

const AdminPanel: FC = () => {
    return (
        <>
            <div className="text-center mt-4">
                ADMIN PANEL
            </div>

            <div className="table-responsive ms-4 me-4">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th className="text-nowrap" scope="col">name</th>
                        <th className="text-nowrap" scope="col">description</th>
                        <th className="text-nowrap" scope="col">create</th>
                        <th className="text-nowrap" scope="col">show</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(line => <LineAdminPanel
                            key={line.name}
                            name={line.name}
                            description={line.description}
                            createFrom={line.createFrom}
                            showForm={line.showForm}
                        />
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AdminPanel;
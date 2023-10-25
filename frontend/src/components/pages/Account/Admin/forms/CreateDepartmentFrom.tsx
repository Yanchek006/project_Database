import {FC, useContext, useState} from "react";
import CustomButton from "../../../../ui/CustomButton.tsx";
import {Context, PStore} from "../../../../../main.tsx";
import $api from "../../../../../http";
import {parse_errors} from "../../../../../store/store.ts";
import {ResponseDepartment} from "../shows/ShowDepartment.tsx";
import Spinner from "../../../../ux/Spinner.tsx";

export interface CreateDepartment {
    name: string,
    address: string,
}

const CreateDepartmentFrom: FC = () => {
    const {store} = useContext<PStore>(Context);
    const [department, setDepartment] = useState<CreateDepartment>({
        name: "",
        address: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any[]>([]);

    const createDepartment = () => {
        setIsLoading(true);
        $api.post<ResponseDepartment>("/department/create/", department)
            .then((response) => {
                store.addDepartment(response.data);
                setDepartment({name: "", address: ""});
                setErrors([]);
            })
            .catch((error) => {
                setErrors(parse_errors(error.response.data));
            })
            .finally(() => setIsLoading(false));
    }
    return (
        <>
            <form className="p-4 m-auto" style={{maxWidth: 500}}>
                <div
                    hidden={errors.length === 0}>
                    {errors.map(error =>
                        <div
                            className="alert alert-danger"
                            role="alert"
                            key={error}
                        >
                            {error}
                        </div>
                    )}
                </div>
                <label className="form-label">Name department</label>
                <div className="input-group mb-3">
                    <input
                        value={department.name}
                        onChange={event => setDepartment({...department, name: event.target.value})}
                        type="text"
                        className="form-control"
                        placeholder="Developer"
                    />
                </div>

                <label className="form-label">Address department</label>
                <div className="input-group mb-3">
                    <input
                        value={department.address}
                        onChange={event => setDepartment({...department, address: event.target.value})}
                        type="text"
                        className="form-control"
                        placeholder="Moscow street kostyakova 1/5"
                    />
                </div>
                <CustomButton
                    onClick={() => createDepartment()}
                >
                    {isLoading ? <Spinner/> : "create"}
                </CustomButton>
            </form>
        </>
    );
}


export default CreateDepartmentFrom;
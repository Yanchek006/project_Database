import {FC, useContext, useState} from "react";
import CustomButton from "../../../../ui/CustomButton.tsx";
import Spinner from "../../../../ux/Spinner.tsx";
import {Context, PStore} from "../../../../../main.tsx";
import $api from "../../../../../http";
import {parse_errors} from "../../../../../store/store.ts";
import {ResponseLevelPosition} from "../shows/ShowLevelPosition.tsx";

export interface CreateLevelPosition {
    name: string,
    coefficient_salary: number,
}

const CreateLevelPositionFrom: FC = () => {
    const {store} = useContext<PStore>(Context);
    const [levelPosition, setLevelPosition] = useState<CreateLevelPosition>({
        name: "",
        coefficient_salary: 0.0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any[]>([]);

    const createLevelPosition = () => {
        setIsLoading(true);
        $api.post<ResponseLevelPosition>("/levelPosition/create/", levelPosition)
            .then((response) => {
                store.addLevelPosition(response.data);
                setLevelPosition({name: "", coefficient_salary: 0.0});
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
                <label className="form-label">Name level position</label>
                <div className="input-group mb-3">
                    <input
                        value={levelPosition.name}
                        onChange={event => setLevelPosition({...levelPosition, name: event.target.value})}
                        type="text"
                        className="form-control"
                        placeholder="senior"
                    />
                </div>

                <label className="form-label">Coefficient salary</label>
                <div className="input-group mb-3">
                    <input
                        // TODO
                        onChange={event => setLevelPosition({...levelPosition, coefficient_salary: Number(event.target.value)})}
                        type="number"
                        className="form-control"
                        placeholder="1.8"
                        step={0.1}
                        min={0}
                        max={3}
                    />
                </div>
                <CustomButton
                    onClick={() => createLevelPosition()}
                >
                    {isLoading ? <Spinner/> : "create"}
                </CustomButton>
            </form>
        </>
    );
}


export default CreateLevelPositionFrom;
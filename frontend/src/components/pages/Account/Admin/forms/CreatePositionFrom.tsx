import {FC, useContext, useState} from "react";
import CustomButton from "../../../../ui/CustomButton.tsx";
import $api from "../../../../../http";
import Spinner from "../../../../ux/Spinner.tsx";
import {parse_errors} from "../../../../../store/store.ts";
import {Context, PStore} from "../../../../../main.tsx";

export interface CreatePosition {
    name: string,
}

export interface ResponsePosition extends CreatePosition {
    id: number,
}

const CreatePositionFrom: FC = () => {
    const {store} = useContext<PStore>(Context);
    const [position, setPosition] = useState<CreatePosition>({
        name: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any[]>([]);
    const createPosition = () => {
        setIsLoading(true);
        $api.post<ResponsePosition>("/position/create/", position)
            .then((response) => {
                store.addPosition(response.data);
                setPosition({name: ""});
                setErrors([]);
            })
            .catch((error) => {
                setErrors(parse_errors(error.response.data));
            })
            .finally(() => setIsLoading(false))
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
                <label className="form-label">Name position</label>
                <div className="input-group mb-3">
                    <input
                        value={position.name}
                        onChange={event => setPosition({name: event.target.value})}
                        type="text"
                        className="form-control"
                        placeholder="Manager"
                    />
                </div>
                <CustomButton
                    onClick={() => createPosition()}
                >
                    {isLoading ? <Spinner/> : "create"}
                </CustomButton>
            </form>
        </>
    );
}


export default CreatePositionFrom;
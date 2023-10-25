import {FC, useContext, useState} from "react";
import CustomButton from "../../../../ui/CustomButton.tsx";
import Spinner from "../../../../ux/Spinner.tsx";
import {Context, PStore} from "../../../../../main.tsx";
import $api from "../../../../../http";
import {parse_errors} from "../../../../../store/store.ts";
import {ResponseState} from "../shows/ShowState.tsx";

export interface CreateState {
    name: string,
}


const CreateStateForm: FC = () => {
    const {store} = useContext<PStore>(Context);
    const [state, setState] = useState<CreateState>({
        name: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any[]>([]);

    const createState = () => {
        setIsLoading(true);
        $api.post<ResponseState>("/state/create/", state)
            .then((response) => {
                store.addState(response.data);
                setState({name: ""});
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
                <label className="form-label">Name for state</label>
                <div className="input-group mb-3">
                    <input
                        value={state.name}
                        onChange={event => setState({name: event.target.value})}
                        className="form-control"
                        placeholder="create"
                    />
                </div>
                <CustomButton
                    onClick={() => createState()}
                >
                    {isLoading ? <Spinner/> : "create"}
                </CustomButton>
            </form>
        </>
    );
}

export default CreateStateForm;
import {FC, useContext, useState} from "react";
import CustomButton from "../../../../ui/CustomButton.tsx";
import $api from "../../../../../http";
import Spinner from "../../../../ux/Spinner.tsx";
import {ResponseDocumentation} from "../DevelopmentPage.tsx";
import {Context, PStore} from "../../../../../main.tsx";
import {parse_errors} from "../../../../../store/store.ts";

interface Props {
    development: number,
}

const DocumentationForm: FC<Props> = ({development}) => {
    const {store} = useContext<PStore>(Context);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any[]>([]);
    const [text, setText] = useState("")

    const createDocumentation = () => {
        setIsLoading(true);
        $api.post<ResponseDocumentation>("/documentation/create/", {
            development: development,
            text: text,
        })
            .then(response => {
                store.addYouDocumentation(response.data);
                setText("");
                setErrors([]);
            })
            .catch(error => {
                setErrors(parse_errors(error.response.data));
            })
            .finally(() => setIsLoading(false))
    };

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
                <label className="form-label">You documentation</label>
                <textarea
                    className="form-control mb-4"
                    id="exampleFormControlTextarea1"
                    rows={10}
                    value={text}
                    onChange={event => setText(event.target.value)}
                />
                <CustomButton
                    onClick={() => createDocumentation()}
                >
                    {isLoading ? <Spinner/> : "create"}
                </CustomButton>
            </form>
        </>
    );
}

export default DocumentationForm;
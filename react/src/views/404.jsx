import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();
    return (
        <div className="flex flex-col p-8 h-full w-full items-center justify-center">
            <h1 className="text-slate-400 text-xl">Opps..</h1>
            <p className="text-slate-600 text-2xl">
                { error ? error.statusText || error.message : "Not Found..."}
            </p>
        </div>
    );
};

export default ErrorPage;

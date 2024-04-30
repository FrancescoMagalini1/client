import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";
import { Link } from "react-router-dom";

useRouteError;

function Error() {
  let error = useRouteError();
  console.error(error);

  return (
    <div id="error">
      <Link to="/">
        <ArrowLeftIcon />
      </Link>
      <div className="message">
        <h1>An error has occured</h1>
        <h3>
          {isRouteErrorResponse(error)
            ? error.data || error.statusText
            : "Unknown error"}
        </h3>
      </div>
    </div>
  );
}

export default Error;

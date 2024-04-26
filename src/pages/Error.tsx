import { useRouteError, isRouteErrorResponse } from "react-router-dom";

useRouteError;

function Error() {
  let error = useRouteError();
  console.error(error);

  return (
    <div id="error">
      <h1>An error has occured</h1>
      <h3>
        {isRouteErrorResponse(error)
          ? error.data || error.statusText
          : "Unknown error"}
      </h3>
    </div>
  );
}

export default Error;

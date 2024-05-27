import "../assets/styles/components/confirmation-modal.css";

type inputProps = {
  show: boolean;
  message?: string;
  yesCallback?: () => void;
  noCallback?: () => void;
};

function ConfirmationModal({
  show = true,
  message = "",
  yesCallback,
  noCallback,
}: inputProps) {
  return (
    <div id="confirmation-modal" className={show ? "show" : ""}>
      <div className="content">
        <h3>Attention</h3>
        <p>{message}</p>
        <div className="buttons">
          <button
            className="delete"
            onClick={() => (noCallback ? noCallback() : null)}
          >
            No
          </button>
          <button onClick={() => (yesCallback ? yesCallback() : null)}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;

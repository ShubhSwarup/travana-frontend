import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { clearGlobalError } from "../features/ui/uiSlice";
import { useNavigate } from "react-router-dom";

export default function GlobalErrorModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector((state: RootState) => state.ui.error);

  if (!error?.message) return null;

  const { message, showCloseButton } = error;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-base-100 p-6 rounded-xl shadow-lg w-[90%] max-w-md border border-base-300">
        <h3 className="text-lg font-bold text-error">
          Oops! Something went wrong
        </h3>
        <p className="mt-4 text-base text-base-content">{message}</p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            className="btn btn-primary"
            onClick={() => {
              dispatch(clearGlobalError());
              navigate("/");
            }}
          >
            Go to Home
          </button>
          {showCloseButton && (
            <button
              className="btn btn-outline"
              onClick={() => dispatch(clearGlobalError())}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

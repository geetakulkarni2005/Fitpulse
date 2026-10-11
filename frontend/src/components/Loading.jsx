import { LoaderCircle } from "lucide-react";

function Loading({ message = "Loading..." }) {
  return (
    <div className="loading-state">
      <LoaderCircle
        className="loading-spinner"
        size={24}
      />

      <span>{message}</span>
    </div>
  );
}

export default Loading;
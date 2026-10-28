
import { LoaderCircle } from "lucide-react";

type LoadingProps = {
  message?: string;
};

export default function Loading({
  message = "Loading...",
}: LoadingProps) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 py-10 text-gray-600"
    >
      <LoaderCircle className="animate-spin text-orange-500" size={24} />
      <span>{message}</span>
    </div>
  );
}

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Props = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  total,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div
      className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
        rounded-md
        bg-white
        p-4
        shadow-sm
      "
    >
      {/* INFO */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-gray-500">
            Total
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-900">
            {total}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Pages
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-900">
            {totalPages}
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">
        {/* PREVIOUS */}
        <button
          disabled={page <= 1}
          onClick={() =>
            onPageChange(page - 1)
          }
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-md
            bg-white
            px-4
            py-2
            text-blue-800
            font-medium
            transition-all
            duration-200
            hover:bg-blue-50
            hover:shadow-md
            active:scale-[0.98]
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          <ChevronLeft
            className="w-4 h-4"
            strokeWidth={2}
          />

          <span className="text-sm">
            Prev
          </span>
        </button>

        {/* CURRENT */}
        <div
          className="
            min-w-[72px]
            rounded-md
            bg-gradient-to-br
            from-blue-900
            via-blue-800
            to-indigo-900
            px-4
            py-2
            text-center
            shadow-sm
          "
        >
          <p className="text-xs text-blue-100">
            Page
          </p>

          <p className="mt-1 text-sm font-bold text-white">
            {page}
          </p>
        </div>

        {/* NEXT */}
        <button
          disabled={page >= totalPages}
          onClick={() =>
            onPageChange(page + 1)
          }
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-md
            bg-gradient-to-br
            from-blue-900
            via-blue-800
            to-indigo-900
            px-4
            py-2
            text-white
            font-medium
            shadow-sm
            transition-all
            duration-200
            hover:shadow-md
            hover:brightness-110
            active:scale-[0.98]
            disabled:opacity-40
            disabled:pointer-events-none
          "
        >
          <span className="text-sm">
            Next
          </span>

          <ChevronRight
            className="w-4 h-4"
            strokeWidth={2}
          />
        </button>
      </div>
    </div>
  );
}
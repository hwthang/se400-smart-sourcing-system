import type { ReactNode } from "react";

import { ChevronRight } from "lucide-react";

type Props = {
  title: string;
  children: ReactNode;
  description?: string;
  action?: ReactNode;
};

export default function Section({
  title,
  children,
  description,
  action,
}: Props) {
  return (
    <section
      className="
        border
        border-gray-200
        rounded-md
        bg-white
        shadow-sm
        overflow-hidden
      "
    >
      {/* HEADER */}
      <div
        className="
          border-b
          border-gray-200
          px-6
          py-4
          bg-gradient-to-br
          from-white
          to-blue-50/40
        "
      >
        <div className="flex items-center justify-between gap-4">
          {/* LEFT */}
          <div className="flex items-start gap-3">
            <div
              className="
                mt-1
                w-2
                h-2
                rounded-full
                bg-blue-800
                shrink-0
              "
            />

            <div className="text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">
                  {title}
                </h2>

                <ChevronRight
                  className="w-4 h-4 text-gray-500"
                  strokeWidth={2}
                />
              </div>

              {description && (
                <p className="text-sm text-gray-500 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT ACTION */}
          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col gap-4">
        {children}
      </div>
    </section>
  );
}
// components/QuotationDataSection.tsx

type Props = {
  data: any;
};

const QuotationDataSection = ({
  data,
}: Props) => {
  return (
    <div
      className="
        rounded-md
        bg-white
        p-6
        shadow-sm
      "
    >
      <h2 className="text-lg font-semibold text-gray-900">
        Quotation Data
      </h2>

      <pre
        className="
          mt-4
          overflow-auto
          rounded-md
          bg-blue-50/40
          p-4
          text-sm
          text-gray-900
        "
      >
        {JSON.stringify(
          data,
          null,
          2,
        )}
      </pre>
    </div>
  );
};

export default QuotationDataSection;
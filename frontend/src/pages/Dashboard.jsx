import { useState } from "react";
import UploadForm from "../components/UploadForm";
import ValidationErrors from "../components/ValidationErrors";
import SummaryCard from "../components/SummaryCard";
import GenericTable from "../components/GenericTable";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);

  const isValidUpload =
    data &&
    !errors &&
    data.preview &&
    Object.keys(data.preview).length > 0;

  return (
    <div className="container">
      <h1>Data Processing Dashboard</h1>
      {console.log("DATA:", data)};
      {console.log("ERRORS:", errors)};
      {console.log("SUMMARY:", data?.result?.summary)};

      <UploadForm setData={setData} setErrors={setErrors} />

      <ValidationErrors errors={errors} />

      {isValidUpload &&
        Object.entries(data.preview).map(([key, value]) => (
          <GenericTable
            key={key}
            title={`Preview - ${key}`}
            data={value}
          />
        ))}


      {data?.result?.summary && !errors && (
        <>
          <h3>Summary</h3>
          <SummaryCard summary={data.result.summary} />
        </>
      )}

      {data?.result &&
        !errors &&
        Object.entries(data.result).map(([key, value]) => {
          if (!Array.isArray(value)) return null;

          return (
            <GenericTable
              key={key}
              title={key}
              data={value}
            />
          );
        })}
    </div>
  );
};

export default Dashboard;
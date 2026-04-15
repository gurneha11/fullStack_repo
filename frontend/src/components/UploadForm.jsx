import { useState, useEffect } from "react";
import { uploadFiles } from "../services/api";

const FILE_FIELDS = ["existing", "new", "sales"];

const UploadForm = ({ setData, setErrors }) => {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const file = e.target.files?.[0] || null;

    setFiles(prev => ({
      ...prev,
      [e.target.name]: file
    }));

    setErrors(null);
  };

  useEffect(() => {
    const allPresent = FILE_FIELDS.every(f => files[f]);

    if (!allPresent) {
      setData(null);
    }
  }, [files, setData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missing = FILE_FIELDS.filter(field => !files[field]);

    if (missing.length > 0) {
      setErrors({
        message: `Missing files: ${missing.join(", ")}`
      });

      setData(null);

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      FILE_FIELDS.forEach(field => {
        formData.append(field, files[field]);
      });

      const res = await uploadFiles(formData);

      setData(res);
      setErrors(null);

    } catch (err) {
      setErrors(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const isReady = FILE_FIELDS.every(field => files[field]);

  return (
    <form onSubmit={handleSubmit}>
      {FILE_FIELDS.map(field => (
        <div key={field}>
          <label>{field.toUpperCase()} FILE:</label>
          <input
            type="file"
            name={field}
            onChange={handleChange}
          />
        </div>
      ))}

      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Submit"}
      </button>
    </form>
  );
};

export default UploadForm;
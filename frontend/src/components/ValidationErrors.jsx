const ValidationErrors = ({ errors }) => {
  if (!errors) return null;

  if (errors.message && !errors.validation) {
    return (
      <div className="error">
        <h3>Error</h3>
        <p>{errors.message}</p>
      </div>
    );
  }

  const validation = errors.validation;

  if (!validation) return null;

  return (
    <div className="error">
      <h3>Validation Errors</h3>

      {Object.entries(validation).map(([type, list]) => {
        if (!list?.length) return null;

        return (
          <div key={type}>
            <h4>{type}</h4>
            <ul>
              {list.map((err, i) => (
                <li key={i}>
                  Row {err.row || "-"} | {err.field || "-"} → {err.message}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default ValidationErrors;
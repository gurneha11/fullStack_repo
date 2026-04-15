const SummaryCard = ({ summary }) => {
    console.log("summary",summary);
  if (!summary) return null;


  return (
    <div className="summary">
      <h3>Summary</h3>
      {console.log("summary in render",summary)};
      {Object.entries(summary).map(([key, value]) => (
        <p key={key}>
          {key}: {value}
        </p>
      ))}
    </div>
  );
};

export default SummaryCard;
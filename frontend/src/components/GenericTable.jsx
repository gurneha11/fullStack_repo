const GenericTable = ({
    title,
    data = [],
    excludeColumns = [],
    emptyMessage = "No data available"
}) => {
    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div>
                {title && <h3>{title}</h3>}
                <p>{emptyMessage}</p>
            </div>
        );
    }

    console.log("data", data)

    const columns = Object.keys(data[0]).filter(
        col =>
            !excludeColumns.includes(col) &&
            !col.startsWith("__EMPTY")
    );

    return (
        <div className="table-container">
            {title && <h3>{title}</h3>}

            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        {/* {console.log("columns",columns)} */}
                        {columns.map(col => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {/* {console.log("data",data)} */}
                    {data.map((row, i) => (
                        <tr key={i}>
                            {columns.map(col => (
                                <td key={col}>{renderCell(row[col])}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const renderCell = (value) => {
    if (value === null || value === undefined) return "";

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
};

export default GenericTable;
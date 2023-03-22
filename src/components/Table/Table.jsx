import "./Table.scss";

function Table({ data, config, keyFn }) {
  const renderedHeaders = config.map((columnConfig) => {
    return (
      <th className="" key={columnConfig.label}>
        {columnConfig.label}
      </th>
    );
  });

  const renderedRows = data.map((rowData) => {
    const renderedCells = config.map((column) => {
      return (
        <td className="" key={column.label}>
          {column.render(rowData)}
        </td>
      );
    });

    return (
      <tr className="table-body-row" key={keyFn(rowData)}>
        {renderedCells}
      </tr>
    );
  });

  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-head">
          <tr className="table-head-row">{renderedHeaders}</tr>
        </thead>
        <tbody className="table-body">{renderedRows}</tbody>
      </table>
    </div>
  );
}

export default Table;

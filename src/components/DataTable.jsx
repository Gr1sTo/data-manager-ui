import { ui } from "../styles/ui";

export default function DataTable({ rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div className={ui.table.wrapper}>
        <div className={ui.table.scroll}>
          <div className={ui.table.tdMuted}>Немає даних для відображення</div>
        </div>
      </div>
    );
  }

  const columns = [
    ...new Set(
      rows.flatMap((row) => Object.keys(row))
    ),
  ];

  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return "—";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  };

  return (
    <div className={ui.table.wrapper}>
      <div className={ui.table.scroll}>
        <table className={ui.table.table}>
          <thead className={ui.table.thead}>
            <tr>
              {columns.map((column) => (
                <th key={column} className={ui.table.th}>
                  {column}
                </th>
              ))}

              <th className={ui.table.th}>Дії</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id ?? index} className={ui.table.tr}>
                {columns.map((column) => (
                  <td
                    key={column}
                    className={
                      column === "id" ? ui.table.tdStrong : ui.table.td
                    }
                  >
                    {renderValue(row[column])}
                  </td>
                ))}

                <td className={ui.table.td}>
                  <div className={ui.table.actions}>
                    <button className={ui.button.tiny}>Переглянути</button>
                    <button className={ui.button.tiny}>Редагувати</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
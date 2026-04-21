import { ui } from "../styles/ui";

export default function DataTable({ rows }) {
  return (
    <div className={ui.table.wrapper}>
      <div className={ui.table.scroll}>
        <table className={ui.table.table}>
          <thead className={ui.table.thead}>
            <tr>
              <th className={ui.table.th}>ID</th>
              <th className={ui.table.th}>Назва</th>
              <th className={ui.table.th}>Тип</th>
              <th className={ui.table.th}>Статус</th>
              <th className={ui.table.th}>Оновлено</th>
              <th className={ui.table.th}>Дії</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={ui.table.tr}>
                <td className={ui.table.tdStrong}>{row.id}</td>
                <td className={ui.table.td}>{row.name}</td>
                <td className={ui.table.td}>{row.type}</td>
                <td className={ui.table.td}>
                  <span className={ui.table.badge}>{row.status}</span>
                </td>
                <td className={ui.table.tdMuted}>{row.updated}</td>
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
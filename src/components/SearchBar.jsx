import { ui } from "../styles/ui";

export default function SearchBar() {
  return (
    <div className={ui.search.outer}>
      <div className={ui.search.panel}>
        <div className={ui.search.row}>
          <div className="flex-1">
            <div className={ui.search.inputWrap}>
              <span className={ui.search.icon}>🔍</span>
              <input
                className={ui.search.input}
                placeholder="Пошук по назві, типу, статусу або даті..."
                readOnly
              />
              <button className={ui.button.subtle}>Очистити</button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className={ui.button.primary}>Додати</button>
            <button className={ui.button.secondary}>Фільтр</button>
          </div>
        </div>
      </div>
    </div>
  );
}
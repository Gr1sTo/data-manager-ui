import { useEffect, useRef, useState } from "react";
import DataTypeDropdown from "./components/DataTypeDropdown";
import UserMenu from "./components/UserMenu";
import SearchBar from "./components/SearchBar";
import DataTable from "./components/DataTable";
import StatsCards from "./components/StatsCards";
import { dataTypeOptions, tableRows } from "./data/mockData";
import { ui } from "./styles/ui";

export default function App() {
  const [dataType, setDataType] = useState("Реляційні дані");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const dataMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }

      if (dataMenuRef.current && !dataMenuRef.current.contains(event.target)) {
        setIsDataMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={ui.layout.page}>
      <div className={ui.layout.appShell}>
        <header className={ui.layout.header}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className={ui.text.pageTitle}>
                Графічний інтерфейс користувача керування даними
              </h1>
            </div>

            <div className="flex flex-wrap items-start gap-3">
              <DataTypeDropdown
                dataType={dataType}
                isOpen={isDataMenuOpen}
                setIsOpen={setIsDataMenuOpen}
                setDataType={setDataType}
                options={dataTypeOptions}
                dropdownRef={dataMenuRef}
              />

              <UserMenu
                isOpen={isUserMenuOpen}
                setIsOpen={setIsUserMenuOpen}
                menuRef={userMenuRef}
                userName="Nazary"
                role="Адміністратор"
              />
            </div>
          </div>
        </header>

        <SearchBar />

        <main className={ui.layout.section}>
          <div className={ui.layout.contentPanel}>
            <div className={ui.misc.topRow}>
              <div>
                <h2 className={ui.text.sectionTitle}>
                  Область відображення даних
                </h2>
                <p className={ui.text.muted}>
                  Тут будуть показуватися таблиці, JSON-структури або файлові
                  об’єкти залежно від обраного режиму
                </p>
              </div>

              <div className={ui.misc.controls}>
                <button className={ui.button.small}>Таблиця</button>
                <button className={ui.button.small}>Картки</button>
              </div>
            </div>

            <div className={ui.misc.currentModeRow}>
              <div className={ui.text.infoText}>
                Поточний режим:{" "}
                <span className={ui.text.infoStrong}>{dataType}</span>
              </div>
            </div>

            <DataTable rows={tableRows} />
            <StatsCards dataType={dataType} />
          </div>
        </main>
      </div>
    </div>
  );
}
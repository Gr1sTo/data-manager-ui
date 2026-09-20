import { useEffect, useRef, useState } from "react";
import DataTypeDropdown from "./components/DataTypeDropdown";
import UserMenu from "./components/UserMenu";
import SearchBar from "./components/SearchBar";
import DataTable from "./components/DataTable";
import StatsCards from "./components/StatsCards";
import { dataTypeOptions } from "./data/mockData";
import { ui } from "./styles/ui";
import { getDataByType } from "./api/dataApi";

export default function App() {
  const [dataType, setDataType] = useState("relational");
  const currentDataTypeLabel =
  dataTypeOptions.find((item) => item.value === dataType)?.label ?? dataType;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const dataMenuRef = useRef(null);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = data.filter((row) =>
  Object.values(row).some((value) =>
    String(value).toLowerCase().includes(searchQuery.toLowerCase())
  )
);

  useEffect(() => {
    async function loadData() {
      const apiType = dataType;

      try {
        setIsLoading(true);
        setError(null);

        const result = await getDataByType(apiType);
        setData(result);
      } catch (error) {
        console.error(error);
        setError("Не вдалося завантажити дані");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [dataType]);

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

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

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
                <span className={ui.text.infoStrong}>{currentDataTypeLabel}</span>
              </div>
            </div>

            {isLoading && (
              <div className={ui.text.muted}>
                Завантаження даних...
              </div>
            )}

            {error && (
              <div className={ui.text.muted}>
                {error}
              </div>
            )}

            {!isLoading && !error && (
              <DataTable rows={filteredData} />
            )}
            <StatsCards dataType={currentDataTypeLabel} />
          </div>
        </main>
      </div>
    </div>
  );
}
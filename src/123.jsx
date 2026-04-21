import { useEffect, useRef, useState } from "react";

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

  const tableRows = [
    {
      id: "USR-001",
      name: "Anna Kovalenko",
      type: "Реляційні дані",
      status: "Активний",
      updated: "2026-04-12",
    },
    {
      id: "USR-002",
      name: "Orders Archive",
      type: "Файли",
      status: "Синхронізовано",
      updated: "2026-04-11",
    },
    {
      id: "USR-003",
      name: "Products JSON",
      type: "NoSQL",
      status: "Чернетка",
      updated: "2026-04-10",
    },
    {
      id: "USR-004",
      name: "Client Records",
      type: "Реляційні дані",
      status: "Активний",
      updated: "2026-04-09",
    },
    {
      id: "USR-005",
      name: "Invoices Folder",
      type: "Файли",
      status: "Оновлено",
      updated: "2026-04-08",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 p-6 text-neutral-800">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border-4 border-black bg-white shadow-2xl">
        <div className="border-b border-neutral-200 bg-neutral-50 px-8 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Графічний інтерфейс користувача керування даними
              </h1>
            </div>

            <div className="flex flex-wrap items-start gap-3">
              <div ref={dataMenuRef} className="relative min-w-[260px]">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Тип даних
                </label>

                <button
                  onClick={() => setIsDataMenuOpen(!isDataMenuOpen)}
                  className="flex w-full items-center justify-between rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-neutral-100"
                >
                  {dataType}
                  <span className="text-neutral-400">▾</span>
                </button>

                {isDataMenuOpen && (
                  <div className="absolute left-0 top-[110%] w-full rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
                    {[
                      "Реляційні дані",
                      "Документоорієнтовані дані",
                      "Файли",
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setDataType(item);
                          setIsDataMenuOpen(false);
                        }}
                        className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-neutral-100"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div ref={userMenuRef}className="relative">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Користувач
                </label>

                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex w-[260px] items-center justify-between rounded-2xl border border-neutral-300 bg-white px-3 py-2 shadow-sm hover:bg-neutral-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold">
                      NR
                    </div>

                    <div className="text-left">
                      <div className="text-sm font-medium">Nazary</div>
                      <div className="text-xs text-neutral-500">
                        Адміністратор
                      </div>
                    </div>
                  </div>

                  <span className="text-neutral-400">▾</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 top-[110%] w-[260px] rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
                    <button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-neutral-100">
                      Профіль
                    </button>
                    <button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-neutral-100">
                      Налаштування
                    </button>
                    <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                      Вийти
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pt-6">
          <div className="rounded-[24px] border-2 border-orange-400 bg-orange-50 px-5 py-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-white px-4 py-3">
                  <span className="text-lg">🔍</span>
                  <input
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Пошук по назві, типу, статусу або даті..."
                    readOnly
                  />
                  <button className="rounded-xl bg-neutral-100 px-3 py-1 text-xs text-neutral-500">
                    Очистити
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:bg-black">
                  Додати
                </button>

                <button className="rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-neutral-100">
                  Фільтр
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="rounded-[28px] border-4 border-sky-200 bg-sky-50/40 p-6 shadow-inner">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Область відображення даних
                </h2>
                <p className="text-sm text-neutral-500">
                  Тут будуть показуватися таблиці, JSON-структури або файлові
                  об’єкти залежно від обраного режиму
                </p>
              </div>

              <div className="flex gap-2">
                <button className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm">
                  Таблиця
                </button>
                <button className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm">
                  Картки
                </button>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                Поточний режим:{" "}
                <span className="font-semibold text-neutral-800">
                  {dataType}
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-neutral-100 text-neutral-600">
                    <tr>
                      <th className="px-5 py-4 font-semibold">ID</th>
                      <th className="px-5 py-4 font-semibold">Назва</th>
                      <th className="px-5 py-4 font-semibold">Тип</th>
                      <th className="px-5 py-4 font-semibold">Статус</th>
                      <th className="px-5 py-4 font-semibold">Оновлено</th>
                      <th className="px-5 py-4 font-semibold">Дії</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tableRows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t border-neutral-100 hover:bg-neutral-50"
                      >
                        <td className="px-5 py-4 font-medium">{row.id}</td>
                        <td className="px-5 py-4">{row.name}</td>
                        <td className="px-5 py-4">{row.type}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                            {row.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-neutral-500">
                          {row.updated}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-100">
                              Переглянути
                            </button>
                            <button className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-100">
                              Редагувати
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="text-sm text-neutral-500">Активний режим</div>
                <div className="mt-1 text-lg font-semibold">{dataType}</div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="text-sm text-neutral-500">Знайдено записів</div>
                <div className="mt-1 text-lg font-semibold">245</div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="text-sm text-neutral-500">Стан підключення</div>
                <div className="mt-1 text-lg font-semibold">Підключено</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

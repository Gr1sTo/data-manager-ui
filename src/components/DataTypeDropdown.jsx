import { ui } from "../styles/ui";

export default function DataTypeDropdown({
  dataType,
  isOpen,
  setIsOpen,
  setDataType,
  options,
  dropdownRef,
}) {
  return (
    <div ref={dropdownRef} className={ui.dropdown.wrapper}>
      <label className={ui.text.label}>Тип даних</label>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={ui.dropdown.trigger}
      >
        {dataType}
        <span className={ui.dropdown.chevron}>▾</span>
      </button>

      {isOpen && (
        <div className={ui.dropdown.menu}>
          {options.map((item) => (
            <button
              key={item}
              onClick={() => {
                setDataType(item);
                setIsOpen(false);
              }}
              className={ui.dropdown.menuItem}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
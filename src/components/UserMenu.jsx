import { ui } from "../styles/ui";

export default function UserMenu({
  isOpen,
  setIsOpen,
  menuRef,
  userName = "Nazary",
  role = "Адміністратор",
}) {
  return (
    <div ref={menuRef} className={ui.dropdown.userWrapper}>
      <label className={ui.text.label}>Користувач</label>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={ui.dropdown.userTrigger}
      >
        <div className={ui.user.triggerContent}>
          <div className={ui.user.avatar}>NR</div>

          <div className={ui.user.userText}>
            <div className={ui.user.userName}>{userName}</div>
            <div className={ui.user.userRole}>{role}</div>
          </div>
        </div>

        <span className={ui.dropdown.chevron}>▾</span>
      </button>

      {isOpen && (
        <div className={ui.dropdown.userMenu}>
          <button className={ui.dropdown.menuItem}>Профіль</button>
          <button className={ui.dropdown.menuItem}>Налаштування</button>
          <button className={ui.dropdown.menuItemDanger}>Вийти</button>
        </div>
      )}
    </div>
  );
}
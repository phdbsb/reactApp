import { MdOutlineEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import styles from "./style.module.css";
import { useEffect, useRef } from "react";

interface ContextMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const ContextMenu = ({ onEdit, onDelete, onClose }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className={styles["context-menu"]}
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={styles["menu-item1"]}
        onClick={() => {
          onEdit();
          onClose();
        }}
      >
        <MdOutlineEdit className={styles["menu-icon"]} />
        <span>Edit</span>
      </div>
      <div
        className={styles["menu-item2"]}
        onClick={() => {
          onDelete();
          onClose();
        }}
      >
        <FaRegTrashAlt className={styles["menu-icon"]} />
        <span>Remove</span>
      </div>
    </div>
  );
};

export default ContextMenu;

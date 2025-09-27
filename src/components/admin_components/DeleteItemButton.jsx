import { useState } from "react";
import DeleteConfirmation from "./DeleteConfirmation";
import styles from "../../pages/admin_pages/EditableDashboard.module.css";

export default function DeleteItemButton({ uid, type, lang, onDeleted }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/${lang}/${type}/${uid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onDeleted(uid); // remove from UI
      } else {
        alert("Deletion failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Deletion failed, check console");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className={styles.deleteButtonWrapper}>
      <button
        className={`${styles.btn} ${styles.btnDanger}`}
        onClick={handleDeleteClick}
      >
        Delete {type}
      </button>

      {showConfirm && (
        <DeleteConfirmation
          type={type}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

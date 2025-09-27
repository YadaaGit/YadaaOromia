import { useState } from "react";
import DeleteConfirmation from "./DeleteConfirmation";
import styles from "../../pages/admin_pages/EditableDashboard.module.css";

export default function DeleteItemButton({ uid, type, lang, onDeleted }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  const handleDeleteClick = () => {
    if (loading) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!uid || !type) {
      alert("Cannot delete: missing UID or type");
      setShowConfirm(false);
      return;
    }

    if (loading) return; // prevent double submit
    setLoading(true);

    try {
      const resourceMap = {
        Program: "programs",
        Course: "courses",
        Module: "modules",
      };

      const resource = resourceMap[type];
      if (!resource) throw new Error("Unknown resource type: " + type);

      const res = await fetch(`${API_BASE}/api/${lang}/${resource}/${uid}`, {
        method: "DELETE",
      });

      // Ignore 404 errors: already deleted
      if (!res.ok && res.status !== 404) {
        const text = await res.text();
        throw new Error(`Server responded with status ${res.status}: ${text}`);
      }

      let data = {};
      try {
        data = await res.json();
      } catch {
        // Backend might return empty body (204), treat as success
        data = { success: true };
      }

      // Treat 404 as success if item already deleted
      if (data.success || res.status === 404) {
        onDeleted(uid); // remove from UI
      } else {
        alert("Deletion failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Deletion error:", err);
      alert("Deletion failed: network or server error");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className={styles.deleteButtonWrapper}>
      <button
        className={`${styles.btn} ${styles.btnDanger}`}
        onClick={handleDeleteClick}
        disabled={loading}
      >
        {loading ? `Deleting ${type}...` : `Delete ${type}`}
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

import styles from "./LayoutNotes.module.css";

export default function FilterLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>{sidebar ?? null}</aside>
      <main className={styles.notesWrapper}>{children}</main>
    </div>
  );
}

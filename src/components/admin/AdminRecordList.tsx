import type {
  FirestoreDoc,
} from "@/components/admin/types";

type AdminRecordListProps = {
  title: string;
  items: FirestoreDoc[];
  fields: string[];
};

export function AdminRecordList({
  title,
  items,
  fields,
}: AdminRecordListProps) {
  return (
    <article className="admin-list">
      <h2>{title}</h2>

      {items.length === 0 ? (
        <p>No records yet.</p>
      ) : null}

      {items
        .slice(0, 8)
        .map((item) => (
          <div
            className="admin-row"
            key={item.id}
          >
            <strong>
              {item.id.slice(0, 8)}
            </strong>

            {fields.map((field) => (
              <span key={field}>
                {String(
                  item[field] ?? "-"
                )}
              </span>
            ))}
          </div>
        ))}
    </article>
  );
}
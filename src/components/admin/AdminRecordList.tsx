"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from "lucide-react";

import type {
  FirestoreDoc,
} from "@/components/admin/types";

type AdminRecordListProps = {
  title: string;
  items: FirestoreDoc[];
  fields: string[];
};

type RecordSortOption =
  | "newest"
  | "oldest"
  | "a-z"
  | "z-a";

const INITIAL_VISIBLE_COUNT = 8;

export function AdminRecordList({
  title,
  items,
  fields,
}: AdminRecordListProps) {
  const [
    selectedRecord,
    setSelectedRecord,
  ] =
    useState<FirestoreDoc | null>(
      null
    );

  const [showAll, setShowAll] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [sortBy, setSortBy] =
    useState<RecordSortOption>(
      "newest"
    );

  const filteredItems =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      const filtered =
        items.filter((item) => {
          if (!search) {
            return true;
          }

          return Object.values(item)
            .map((value) =>
              formatValue(value)
            )
            .join(" ")
            .toLowerCase()
            .includes(search);
        });

      return [...filtered].sort(
        (first, second) => {
          const firstTime =
            getTimestamp(
              first.createdAt
            );

          const secondTime =
            getTimestamp(
              second.createdAt
            );

          const firstText =
            getPrimaryText(
              first,
              fields
            );

          const secondText =
            getPrimaryText(
              second,
              fields
            );

          if (sortBy === "oldest") {
            return (
              firstTime - secondTime
            );
          }

          if (sortBy === "a-z") {
            return firstText.localeCompare(
              secondText
            );
          }

          if (sortBy === "z-a") {
            return secondText.localeCompare(
              firstText
            );
          }

          return (
            secondTime - firstTime
          );
        }
      );
    }, [
      items,
      fields,
      searchTerm,
      sortBy,
    ]);

  const displayedItems =
    showAll
      ? filteredItems
      : filteredItems.slice(
          0,
          INITIAL_VISIBLE_COUNT
        );

  useEffect(() => {
    setShowAll(false);
  }, [searchTerm, sortBy]);

  return (
    <>
      <article className="admin-list">
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                marginBottom: 4,
              }}
            >
              {title}
            </h2>

            <small
              style={{
                color:
                  "var(--muted)",
              }}
            >
              {filteredItems.length} of{" "}
              {items.length} records
            </small>
          </div>
        </div>

        {items.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) minmax(160px, 220px)",
              gap: 12,
              marginTop: 18,
              marginBottom: 18,
            }}
          >
            <label
              style={{
                position:
                  "relative",
              }}
            >
              <span
                style={{
                  position:
                    "absolute",
                  left: 13,
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  color:
                    "var(--muted)",
                  pointerEvents:
                    "none",
                  display: "grid",
                }}
              >
                <Search size={17} />
              </span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder={`Search ${title.toLowerCase()}`}
                style={{
                  paddingLeft: 40,
                }}
              />
            </label>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target
                    .value as RecordSortOption
                )
              }
              aria-label={`Sort ${title}`}
            >
              <option value="newest">
                Newest first
              </option>

              <option value="oldest">
                Oldest first
              </option>

              <option value="a-z">
                A–Z
              </option>

              <option value="z-a">
                Z–A
              </option>
            </select>
          </div>
        ) : null}

        {items.length === 0 ? (
          <p>No records yet.</p>
        ) : null}

        {items.length > 0 &&
        filteredItems.length === 0 ? (
          <p>
            No records match your
            search.
          </p>
        ) : null}

        {displayedItems.map(
          (item) => (
            <button
              type="button"
              className="admin-row"
              key={item.id}
              onClick={() =>
                setSelectedRecord(item)
              }
              style={{
                width: "100%",
                display: "flex",
                flexDirection:
                  "column",
                alignItems:
                  "stretch",
                gap: 8,
                cursor: "pointer",
                textAlign: "left",
                color: "inherit",
                font: "inherit",
              }}
            >
              <strong>
                {getPrimaryText(
                  item,
                  fields
                ) || item.id.slice(0, 8)}
              </strong>

              {fields.map(
                (field) => (
                  <span key={field}>
                    <strong>
                      {formatFieldName(
                        field
                      )}
                      :
                    </strong>{" "}
                    <span
                      style={{
                        display:
                          "inline",
                        overflowWrap:
                          "anywhere",
                      }}
                    >
                      {truncateText(
                        formatValue(
                          item[field]
                        ),
                        150
                      )}
                    </span>
                  </span>
                )
              )}

              {item.createdAt ? (
                <small
                  style={{
                    color:
                      "var(--muted)",
                  }}
                >
                  {formatDate(
                    item.createdAt
                  )}
                </small>
              ) : null}

              <small
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                Click to view complete
                details.
              </small>
            </button>
          )
        )}

        {filteredItems.length >
          INITIAL_VISIBLE_COUNT ||
        showAll ? (
          <button
            type="button"
            className="button secondary"
            onClick={() =>
              setShowAll(
                (current) =>
                  !current
              )
            }
            style={{
              width: "100%",
              marginTop: 14,
            }}
          >
            {showAll ? (
              <>
                <ChevronUp
                  size={18}
                />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown
                  size={18}
                />
                Show All (
                {filteredItems.length})
              </>
            )}
          </button>
        ) : null}
      </article>

      {selectedRecord ? (
        <RecordDetailsModal
          title={title}
          record={selectedRecord}
          onClose={() =>
            setSelectedRecord(null)
          }
        />
      ) : null}
    </>
  );
}

function RecordDetailsModal({
  title,
  record,
  onClose,
}: {
  title: string;
  record: FirestoreDoc;
  onClose: () => void;
}) {
  const entries =
    Object.entries(record).sort(
      ([firstKey], [secondKey]) => {
        if (firstKey === "id") {
          return -1;
        }

        if (secondKey === "id") {
          return 1;
        }

        return firstKey.localeCompare(
          secondKey
        );
      }
    );

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "grid",
        placeItems: "center",
        padding: 18,
        background:
          "rgba(0,0,0,0.78)",
        backdropFilter:
          "blur(8px)",
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-details-title"
        className="panel"
        onClick={(event) =>
          event.stopPropagation()
        }
        style={{
          position: "relative",
          width:
            "min(850px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 28,
        }}
      >
        <button
          type="button"
          className="icon-link"
          aria-label="Close record details"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
          }}
        >
          <X size={18} />
        </button>

        <h2 id="record-details-title">
          {title} Details
        </h2>

        {entries.map(
          ([key, value]) => (
            <div
              key={key}
              style={{
                padding: "14px 0",
                borderBottom:
                  "1px solid var(--line)",
              }}
            >
              <strong
                style={{
                  display: "block",
                  marginBottom: 7,
                }}
              >
                {formatFieldName(
                  key
                )}
              </strong>

              <div
                style={{
                  whiteSpace:
                    "pre-wrap",
                  overflowWrap:
                    "anywhere",
                  lineHeight: 1.65,
                }}
              >
                {isDateField(key)
                  ? formatDate(value)
                  : formatDetailedValue(
                      value
                    )}
              </div>
            </div>
          )
        )}

        <button
          type="button"
          className="button secondary"
          onClick={onClose}
          style={{
            marginTop: 22,
          }}
        >
          Close
        </button>
      </section>
    </div>
  );
}

function getPrimaryText(
  item: FirestoreDoc,
  fields: string[]
) {
  const preferredFields = [
    "name",
    "fullName",
    "email",
    "company",
    "subject",
    ...fields,
  ];

  for (const field of preferredFields) {
    const value = item[field];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "";
}

function formatFieldName(
  field: string
) {
  return field
    .replace(
      /([a-z])([A-Z])/g,
      "$1 $2"
    )
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatValue(
  value: unknown
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  const date =
    convertToDate(value);

  if (date) {
    return formatDate(date);
  }

  if (
    typeof value === "object"
  ) {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

function formatDetailedValue(
  value: unknown
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  const date =
    convertToDate(value);

  if (date) {
    return formatDate(date);
  }

  if (
    typeof value === "object"
  ) {
    try {
      return (
        <pre
          style={{
            margin: 0,
            whiteSpace:
              "pre-wrap",
            overflowWrap:
              "anywhere",
            font: "inherit",
          }}
        >
          {JSON.stringify(
            value,
            null,
            2
          )}
        </pre>
      );
    } catch {
      return String(value);
    }
  }

  return String(value);
}

function truncateText(
  value: string,
  maximumLength: number
) {
  if (
    value.length <= maximumLength
  ) {
    return value;
  }

  return `${value.slice(
    0,
    maximumLength
  )}…`;
}

function isDateField(
  key: string
) {
  const normalized =
    key.toLowerCase();

  return (
    normalized.endsWith("at") ||
    normalized.includes("date") ||
    normalized.includes("time")
  );
}

function getTimestamp(
  value: unknown
) {
  const date =
    convertToDate(value);

  return date
    ? date.getTime()
    : 0;
}

function formatDate(
  value: unknown
) {
  const date =
    value instanceof Date
      ? value
      : convertToDate(value);

  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }
  ).format(date);
}

function convertToDate(
  value: unknown
): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(
      value.getTime()
    )
      ? null
      : value;
  }

  if (
    value &&
    typeof value === "object" &&
    "toDate" in value
  ) {
    const timestamp = value as {
      toDate?: unknown;
    };

    if (
      typeof timestamp.toDate ===
      "function"
    ) {
      const date =
        timestamp.toDate();

      return date instanceof Date
        ? date
        : null;
    }
  }

  if (
    typeof value === "number"
  ) {
    const date =
      new Date(value);

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date;
  }

  return null;
}
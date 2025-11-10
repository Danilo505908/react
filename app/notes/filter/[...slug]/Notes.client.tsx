"use client";

import React, { useState } from "react";
import Link from "next/link";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes, NormalizedNotesResponse } from "@/lib/api";
import styles from "../../NotesPage.module.css";

interface NotesClientProps {
  initialTag: string;
}

const PER_PAGE = 12;

export default function NotesClient({ initialTag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);

  const { data, isLoading, isError } = useQuery<NormalizedNotesResponse>({
    queryKey: ["notes", initialTag, page, PER_PAGE, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch,
        tag: initialTag === "all" ? undefined : initialTag,
      }),
    staleTime: 1000 * 60,
  });

  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        {/* ✅ Тепер замість модалки — посилання */}
        <Link href="/notes/action/create" className={styles.button}>
          Create note +
        </Link>
      </header>

      <main>
        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Error loading notes.</p>}
        {data && <NoteList notes={data.data} />}
      </main>
    </div>
  );
}

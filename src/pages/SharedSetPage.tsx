import React, { useMemo, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSharedSets } from "@/hooks/useSharedSet";
import { useAuthStore } from "@/store/auth.store";
import { PaginationSmart } from "@/components/common/Pagination";
import { groupSetsByDate } from "@/utils/dateUtils";
import LibraryItem from "@/components/set/LibraryItem";

export default function SharedSetsPage() {
  const [page, setPage] = useState(1);
  const user = useAuthStore((s) => s.user);

  const { loading, sets, total, removeSet } = useSharedSets(user?.id, page);

  const groupedSets = useMemo(() => groupSetsByDate(sets), [sets]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderSetItem = (set: any) => {
    return (
      <LibraryItem
        key={set.id}
        item={{
          ...set,
          card_count: set.card_count ?? set.cardCount ?? 0,
          username: set.ownerName || "Unknown Author",
        }}
        onDeleteSuccess={(id) => {
          removeSet(id);
          if (sets.length <= 1 && page > 1) {
            setPage(page - 1);
          }
        }}
      />
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 space-y-4">
      <header className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Shared with me</h1>

        <Tabs value="flashcard" className="w-full">
          <TabsContent
            value="flashcard"
            className="mt-8 space-y-10 outline-none"
          >
            {loading && sets.length === 0 ? (
              <div className="py-20 text-center text-slate-500 animate-pulse">
                Fetching shared sets...
              </div>
            ) : (
              <div className="space-y-10">
                {groupedSets.today.length > 0 && (
                  <Section title="Today">
                    {groupedSets.today.map(renderSetItem)}
                  </Section>
                )}
                {groupedSets.yesterday.length > 0 && (
                  <Section title="Yesterday">
                    {groupedSets.yesterday.map(renderSetItem)}
                  </Section>
                )}
                {groupedSets.others.length > 0 && (
                  <Section title="Previous">
                    {groupedSets.others.map(renderSetItem)}
                  </Section>
                )}

                {!loading && sets.length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed rounded-2xl border-slate-100">
                    <p className="text-slate-400 font-medium">
                      No one has shared anything with you yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {total > 10 && (
              <div className="mt-12 flex justify-center">
                <PaginationSmart
                  page={page}
                  total={total}
                  pageSize={10}
                  onChange={setPage}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </header>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </h2>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 gap-4">{children}</div>
    </section>
  );
}

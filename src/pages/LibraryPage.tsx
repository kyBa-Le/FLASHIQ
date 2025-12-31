import React, { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { Search, ArrowRightIcon, Folder } from "lucide-react";
import { useUserSets } from "@/hooks/useUserSet";
import { useAuthStore } from "@/store/auth.store";
import { PaginationSmart } from "@/components/common/Pagination";
import { groupSetsByDate } from "@/utils/dateUtils";
import { useSetStore } from "@/store/set.store";
import LibraryItem from "@/components/set/LibraryItem";
import { InputSet } from "@/components/common/InputSet";

type LibraryTab = "flashcard" | "folder";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<LibraryTab>("flashcard");
  const [page, setPage] = useState(1);
  const user = useAuthStore((s) => s.user);

  const { loading } = useUserSets(user?.id, page);
  const { sets, total, removeSet } = useSetStore();

  const folders = [
    { id: 1, title: "TOEIC", totalSets: 5 },
    { id: 2, title: "IELTS", totalSets: 8 },
    { id: 3, title: "GRE", totalSets: 12 },
  ];

  const groupedSets = useMemo(() => groupSetsByDate(sets), [sets]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderSetItem = (set: any) => {
    const displayCount = set.cardCount ?? 0;
    return (
      <LibraryItem
        key={set.id}
        item={{
          ...set,
          card_count: displayCount,
          username: user?.username ?? "You",
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
        <h1 className="text-2xl font-bold tracking-tight">Your Library</h1>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as LibraryTab)}
          className="w-full"
        >
          <TabsList className="flex bg-transparent border-b rounded-none w-full justify-start h-auto p-0 gap-6">
            <TabsTrigger
              value="flashcard"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-2 py-3 text-sm font-semibold transition-all shadow-none"
            >
              Flashcard
            </TabsTrigger>
            <TabsTrigger
              value="folder"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-2 py-3 text-sm font-semibold transition-all shadow-none"
            >
              Folder
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-200 transition-colors"
            >
              Recent <ArrowRightIcon className="ml-2 h-4 w-4" />
            </button>

            <div className="relative w-full sm:w-72 lg:w-80">
              <InputSet
                placeholder={
                  activeTab === "flashcard"
                    ? "Search flashcards..."
                    : "Search folders..."
                }
                className="w-full pl-4 pr-10 bg-white border-slate-200 focus-visible:ring-primary shadow-none"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <TabsContent
            value="flashcard"
            className="mt-8 space-y-10 outline-none border-none"
          >
            {loading && sets.length === 0 ? (
              <div className="py-20">
                <p className="animate-pulse text-slate-500">
                  Fetching your sets...
                </p>
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
                      No sets found in your library.
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

          <TabsContent value="folder" className="mt-8 outline-none border-none">
            <div className="grid grid-cols-1 gap-4">
              {folders.map((folder) => (
                <NavLink key={folder.id} to={`/folder/${folder.id}`}>
                  <Card className="hover:bg-muted/50 transition cursor-pointer p-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Folder className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900">
                          {folder.title}
                        </p>
                        <p className="text-sm text-slate-500 font-medium">
                          {folder.totalSets} sets
                        </p>
                      </div>
                    </div>
                  </Card>
                </NavLink>
              ))}
            </div>
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
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">
          {title}
        </h2>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 gap-4">{children}</div>
    </section>
  );
}

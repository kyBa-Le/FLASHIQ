import React, { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ListItemContent } from "@/components/card-content/ListItemContent";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, ArrowRightIcon, Folder } from "lucide-react";
import { useUserSets } from "@/hooks/useUserSet";
import { useAuthStore } from "@/store/auth.store";
import { PaginationSmart } from "@/components/common/Pagination";
import { groupSetsByDate } from "@/utils/dateUtils";
import { useSetStore } from "@/store/set.store";

type LibraryTab = "flashcard" | "folder";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<LibraryTab>("flashcard");
  const [page, setPage] = useState(1);
  const user = useAuthStore((s) => s.user);

  const { loading } = useUserSets(user?.id, page);

  const { sets, total, countsCache } = useSetStore();

  const folders = [
    { id: 1, title: "TOEIC", totalSets: 5 },
    { id: 2, title: "IELTS", totalSets: 8 },
    { id: 3, title: "GRE", totalSets: 12 },
  ];

  const groupedSets = useMemo(() => groupSetsByDate(sets), [sets]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderSetItem = (set: any) => {
    const displayCount = countsCache[set.id] ?? set.cardCount ?? 0;
    return (
      <LibraryItem
        key={set.id}
        item={{
          ...set,
          card_count: displayCount,
          username: user?.username ?? "You",
        }}
      />
    );
  };

  return (
    <div className="w-full max-w-[70vw] px-[4vw] py-[3vh] space-y-[4vh]">
      <header className="space-y-[3vh]">
        <h1 className="text-xl font-semibold">Your Library</h1>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as LibraryTab)}
          className="bg-none"
        >
          <TabsList className="flex gap-[1.5vw] bg-none border-b rounded-none w-full justify-start h-auto p-0">
            <TabsTrigger
              value="flashcard"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4 py-2"
            >
              Flashcard
            </TabsTrigger>
            <TabsTrigger
              value="folder"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4 py-2"
            >
              Folder
            </TabsTrigger>
          </TabsList>

          <div className="mt-[3vh] flex items-center justify-between gap-[2vw]">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-secondary px-3 py-1 text-sm text-white hover:opacity-90"
            >
              Recent <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>

            <div className="relative w-[18vw] min-w-[220px]">
              <Input
                placeholder={
                  activeTab === "flashcard"
                    ? "Search flashcards"
                    : "Search folders"
                }
                className="w-full pr-9 rounded-md"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <TabsContent
            value="flashcard"
            className="mt-6 space-y-8 outline-none"
          >
            {loading && sets.length === 0 ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-8">
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
                  <p className="text-center text-muted-foreground py-10">
                    No sets found.
                  </p>
                )}
              </div>
            )}

            <PaginationSmart
              page={page}
              total={total}
              pageSize={10}
              onChange={setPage}
            />
          </TabsContent>

          <TabsContent
            value="folder"
            className="mt-[4vh] space-y-[2vh] outline-none"
          >
            {folders.map((folder) => (
              <NavLink key={folder.id} to={`/folder/${folder.id}`}>
                <Card
                  variant="flashcard"
                  className="mb-2 p-4 hover:bg-muted transition"
                >
                  <div className="flex items-center gap-3">
                    <Folder className="h-5 w-5 text-primary" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{folder.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {folder.totalSets} sets
                      </p>
                    </div>
                  </div>
                </Card>
              </NavLink>
            ))}
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
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </h2>
        <div className="flex-1 h-px bg-border/60" />
      </div>
      <ul className="space-y-2">{children}</ul>
    </section>
  );
}

function LibraryItem({
  item,
}: {
  item: {
    id: string;
    title: string;
    card_count: number;
    username: string;
  };
}) {
  const navigate = useNavigate();

  return (
    <li>
      <Card
        variant="flashcard"
        className="hover:bg-muted/50 transition cursor-pointer p-4"
        onClick={() => navigate(`/sets/${item.id}/view`)}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <ListItemContent
              title={item.title}
              meta={`${item.card_count} terms | ${item.username}`}
            />
          </div>
        </div>
      </Card>
    </li>
  );
}

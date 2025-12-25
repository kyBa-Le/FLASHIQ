import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ListItemContent } from "@/components/card-content/ListItemContent";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, ArrowRightIcon, Folder, Pencil } from "lucide-react";

type LibraryTab = "flashcard" | "folder";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = React.useState<LibraryTab>("flashcard");

  const today = [
    { id: 1, title: "Animals", word_count: 10, username: "Cong Doan" },
    {
      id: 2,
      title: "Introduction to IT",
      word_count: 10,
      username: "Cong Doan",
    },
  ];

  const yesterday = [
    { id: 3, title: "Animals", word_count: 10, username: "Cong Doan" },
    {
      id: 4,
      title: "Introduction to IT",
      word_count: 10,
      username: "Cong Doan",
    },
  ];

  const folders = [
    { id: 1, title: "TOEIC", totalSets: 5 },
    { id: 2, title: "IELTS", totalSets: 8 },
    { id: 3, title: "GRE", totalSets: 12 },
  ];
  return (
    <div className="w-full max-w-[70vw] px-[4vw] py-[3vh] space-y-[4vh]">
      <header className="space-y-[3vh]">
        <h1 className="text-xl font-semibold">Your Library</h1>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as LibraryTab)}
          className="border-b bg-none"
        >
          <TabsList className="flex gap-[1.5vw] bg-none">
            <TabsTrigger value="flashcard">Flashcard</TabsTrigger>
            <TabsTrigger value="folder">Folder</TabsTrigger>
          </TabsList>

          <div className="mt-[3vh] flex items-center justify-between gap-[2vw]">
            <button className="inline-flex items-center rounded-md bg-secondary px-3 py-1 text-sm text-white">
              Recent <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>

            <div className="relative w-[18vw] min-w-[220px]">
              <Input
                placeholder={
                  activeTab === "flashcard"
                    ? "Search flashcards"
                    : "Search folders"
                }
                className="w-full pr-9 rounded-md "
              />
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <TabsContent value="flashcard" className="mt-[4vh] space-y-[4vh] ">
            <Section title="Today">
              {today.map((item) => (
                <LibraryItem key={item.id} item={item} />
              ))}
            </Section>

            <Section title="Yesterday">
              {yesterday.map((item) => (
                <LibraryItem key={item.id} item={item} />
              ))}
            </Section>
          </TabsContent>

          <TabsContent value="folder" className="mt-[4vh] space-[2vh]">
            {folders.map((folder) => (
              <NavLink key={folder.id} to={`/folder/${folder.id}`}>
                <Card variant="flashcard" className="mb-2">
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
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        <div className="flex-1 h-px bg-border" />
      </div>
      <ul className="space-y-2">{children}</ul>
    </section>
  );
}

function LibraryItem({
  item,
}: {
  item: {
    id: number;
    title: string;
    word_count: number;
    username: string;
  };
}) {
  const navigate = useNavigate();

  const handleEdit = (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    e.preventDefault(); // chặn NavLink
    e.stopPropagation();
    navigate(`/sets/${item.id}/edit`);
  };

  return (
    <li>
      <NavLink to={`/card/${item.id}`} className="group block relative">
        <Card variant="flashcard">
          <div className="flex items-center justify-between gap-3">
            <ListItemContent
              title={item.title}
              meta={`${item.word_count} words | ${item.username}`}
            />
            <button
              onClick={handleEdit}
              className="
    flex items-center justify-center
    h-8 w-8
    rounded-md
    text-muted-foreground
    hover:bg-muted
    hover:text-primary
  "
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        </Card>
      </NavLink>
    </li>
  );
}

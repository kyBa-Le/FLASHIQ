import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ListItemContent } from "@/components/card-content/ListItemContent";
import { NavLink } from "react-router-dom";
import { Search, ArrowRightIcon, Folder } from "lucide-react";
import React from "react";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = React.useState("flashcard");

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
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Your Library</h1>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="border-b"
        >
          <TabsList>
            <TabsTrigger
              value="flashcard"
              className="border-b-2 px-4 py-2 data-[state=active]:border-primary data-[state=active]:font-medium"
            >
              Flashcard
            </TabsTrigger>
            <TabsTrigger
              value="folder"
              className="border-b-2 px-4 py-2 data-[state=active]:border-primary data-[state=active]:font-medium"
            >
              Folder
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-between gap-4 mt-6">
            <button className="inline-flex items-center rounded-md bg-secondary text-white px-3 py-1 text-sm">
              Recent <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>

            <div className="relative w-64">
              <Input
                placeholder={
                  activeTab === "flashcard"
                    ? "Search Flashcard"
                    : "Search Folder"
                }
                className="border bg-white rounded-md px-3 py-2 text-sm w-full"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <TabsContent value="flashcard" className="space-y-8 mt-6">
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

          <TabsContent value="folder" className="space-y-4 mt-6">
            {folders.map((folder) => (
              <NavLink
                key={folder.id}
                to={`/folder/${folder.id}`}
                className="block"
              >
                <Card variant="flashcard">
                  <div className="flex items-center gap-3">
                    <Folder className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{folder.title}</p>
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
      </div>
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
  item: { id: number; title: string; word_count: number; username: string };
}) {
  return (
    <li>
      <NavLink to={`/card/${item.id}`} className="block">
        <Card variant="flashcard">
          <ListItemContent
            title={item.title}
            meta={`${item.word_count} words | ${item.username}`}
          />
        </Card>
      </NavLink>
    </li>
  );
}

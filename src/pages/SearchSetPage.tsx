import SearchItem from "@/components/set/SearchItem";
import { useSearchParams } from "react-router-dom";
import { useSearchSets } from "@/hooks/useSearchSet"; 

export const SearchSetPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { sets, loading } = useSearchSets(query);

  return (
    <div className="w-full bg-[#00000] min-h-screen p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-slate-900">
          {query ? `Result for "${query}"` : "Search Sets"}
        </h1>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4 border-slate-200">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              All sets ({sets.length})
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <p className="col-span-full text-center py-20 text-slate-400 animate-pulse font-medium">
                Loading...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sets.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sets.map((item: any) => (
                  <SearchItem key={item.id} item={item} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed">
                  <p className="text-slate-400">No results found for "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
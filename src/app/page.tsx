import { getHeroCovers } from "@/lib/get-hero-covers";
import { HeroWrapper } from "./_components/hero-wrapper";

export default async function HomePage() {
  const covers = await getHeroCovers();

  return (
    <main className="flex-1">
      <div className="w-full h-screen overflow-hidden relative">
        <HeroWrapper covers={covers} />
      </div>
    </main>
  );
}

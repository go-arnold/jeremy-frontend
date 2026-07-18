import { fetchEmissions, fetchLiveEmission } from "@/lib/services/emissions";
import EmissionsPageClient from "./EmissionsPageClient";
import type { EmissionCard, EmissionDetail } from "@/types/emissions";

async function getInitialData() {
  let emissions: EmissionCard[] = [];
  let hasMore = false;
  let live: EmissionDetail | null = null;

  try {
    const [data, liveEmission] = await Promise.all([
      fetchEmissions(1),
      fetchLiveEmission(),
    ]);
    emissions = data.results;
    hasMore = !!data.next;
    live = liveEmission;
  } catch (error) {
    console.error("Failed to fetch emissions:", error);
  }

  return { emissions, hasMore, live };
}

export default async function EmissionsPage() {
  const { emissions, hasMore, live } = await getInitialData();

  return (
    <EmissionsPageClient
      initialEmissions={emissions}
      initialHasMore={hasMore}
      initialLive={live}
    />
  );
}

<script lang="ts">
  import type { PageProps } from "./$types";
  import WorkflowRunCard from "$lib/components/WorkflowRunCard.svelte";
  import HeaderMetrics from "$lib/components/HeaderMetrics.svelte";

  let { data }: PageProps = $props();

  const runs = data.history.sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  const totalRuns = runs.length;
  const lastRanAt = runs[0] ? new Date(runs[0].timestamp) : undefined;
</script>

<div class="p-4 md:p-8">
  <div class="w-full flex flex-col justify-center items-center">
    <h1 class="scroll-m-20 text-balance text-4xl font-extrabold tracking-tight">
      Workflow Dashboard
    </h1>
    <p class="text-muted-foreground leading-7 [&:not(:first-child)]:mt-6">
      SN Stock Level Retrieval Workflow Metrics
    </p>

    <div class="flex flex-col md:flex-row gap-4 py-4">
      <HeaderMetrics {lastRanAt} {totalRuns} />
    </div>
  </div>
  <div>
    <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">History</h4>
    <div class="flex flex-col gap-4 py-4">
      {#each runs.reverse() as run, index}
        <WorkflowRunCard {run} id={totalRuns - index} />
      {:else}
        <div class="w-full min-h-50 flex justify-center items-center">
          <p>No runs yet</p>
        </div>
      {/each}
    </div>
  </div>
</div>

<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Activity, Clock } from "@lucide/svelte";

  interface Props {
    lastRanAt?: Date;
    totalRuns: number;
  }

  let { lastRanAt, totalRuns }: Props = $props();
</script>

<Card.Root class="min-w-xs">
  <Card.Header class="flex flex-row items-center justify-between space-y-0">
    <Card.Title class="text-sm font-medium">Total Runs</Card.Title>
    <Activity />
  </Card.Header>
  <Card.Content>
    <div class="text-2xl font-bold pb-2">{totalRuns}</div>
    <p class="text-xs text-muted-foreground">
      {"Workflow executions recorded"}
    </p>
  </Card.Content>
</Card.Root>
<Card.Root class="min-w-xs">
  <Card.Header class="flex flex-row items-center justify-between space-y-0">
    <Card.Title class="text-sm font-medium">Most Recent Run</Card.Title>
    <Clock />
  </Card.Header>
  <Card.Content>
    <div class="text-2xl font-bold pb-2 min-w-xs">
      {lastRanAt?.toLocaleDateString() ?? "No runs yet"}
    </div>
    <p class="text-xs text-muted-foreground">
      {lastRanAt
        ? `${Math.floor((Date.now() - lastRanAt.getTime()) / (1000 * 60 * 60))} hour(s) ago`
        : "No runs yet"}
    </p>
  </Card.Content>
</Card.Root>

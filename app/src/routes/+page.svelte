<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import type { PageProps } from "./$types";
  import { Activity, File, Download, Clock } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";

  let { data }: PageProps = $props();

  const runsSorted = data.workflowHistory.sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  const totalRuns = runsSorted.length;
  const lastRanAt = runsSorted[0]
    ? new Date(runsSorted[0].timestamp)
    : undefined;

  const handleDownload = (item: any) => {
    const blob = new Blob([item.attachment.raw], {
      type: item.attachment.mimetype,
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = item.attachment.filename;
    document.body.appendChild(a);

    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
</script>

<div class="p-4 md:p-8">
  <div class="w-full flex flex-col justify-center items-center">
    <h1 class="scroll-m-20 text-balance text-4xl font-extrabold tracking-tight">
      Workflow Dashboard
    </h1>
    <p class="text-muted-foreground leading-7 [&:not(:first-child)]:mt-6">
      Metrics of the Sienna Naturals Stock Level Retrieval Workflow
    </p>

    <div class="flex flex-col md:flex-row gap-4 py-4">
      <Card.Root class="min-w-xs">
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0"
        >
          <Card.Title class="text-sm font-medium">Total Runs</Card.Title>
          <Activity />
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold pb-2">{totalRuns}</div>
          <p class="text-xs text-muted-foreground">
            Workflow executions recorded
          </p>
        </Card.Content>
      </Card.Root>
      <Card.Root class="min-w-xs">
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0"
        >
          <Card.Title class="text-sm font-medium">Last Run</Card.Title>
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
    </div>
  </div>
  <div>
    <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">History</h4>
    <div class="flex flex-col gap-4 py-4">
      {#each runsSorted.reverse() as run, index}
        <Card.Root class="w-full hover:shadow-md transition-shadow">
          <Card.Header>
            <div class="flex justify-between items-start">
              <Card.Title class="text-lg font-semibold">
                Run #{runsSorted.length - index}
              </Card.Title>
              <Badge variant="outline" class="text-xs">
                {new Date(run.timestamp).toLocaleDateString()}
                {new Date(run.timestamp).toLocaleTimeString()}
              </Badge>
            </div>
          </Card.Header>
          <Card.Content class="space-y-4">
            <div>
              <h4 class="font-medium text-sm text-muted-foreground mb-2">
                Output Data
              </h4>
              <div
                class="bg-muted/50 rounded-md p-4 max-h-60 overflow-y-scroll"
              >
                <pre class="text-xs overflow-x-auto">{JSON.stringify(
                    run.output,
                    null,
                    2,
                  ).trim()}
              </pre>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t gap-2">
              <div
                class="flex items-center gap-2 text-sm text-muted-foreground pt-2"
              >
                <File size={16} />
                <span class="text-xs md:text-base"
                  >{run.attachment.filename}</span
                >
                <Badge variant="secondary" class="text-xs hidden md:block">
                  {run.attachment.mimetype}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onclick={() => handleDownload(run)}
                class="inline-flex items-center gap-2"
              >
                <Download size={14} />
                Download
              </Button>
            </div>
          </Card.Content>
        </Card.Root>
      {/each}
    </div>
  </div>
</div>

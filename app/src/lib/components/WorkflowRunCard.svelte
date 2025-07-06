<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Button } from "$lib/components/ui/button";
  import { File, Download } from "@lucide/svelte";
  import { downloadFile } from "$lib/utils/download";
  import type { WorkflowHistoryItem } from "$lib/types";

  interface Props {
    run: WorkflowHistoryItem;
    id: number;
  }

  let { run, id }: Props = $props();
</script>

<Card.Root class="w-full hover:shadow-md transition-shadow">
  <Card.Header>
    <div class="flex justify-between items-start">
      <Card.Title class="text-lg font-semibold">
        Run #{id}
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
      <div class="bg-muted/50 rounded-md p-4 max-h-60 overflow-y-scroll">
        <pre class="text-xs overflow-x-auto">{JSON.stringify(
            run.output,
            null,
            2,
          ).trim()}
        </pre>
      </div>
    </div>

    <div class="flex items-center justify-between pt-2 border-t gap-2">
      <div class="flex items-center gap-2 text-sm text-muted-foreground pt-2">
        <File size={16} />
        <span class="text-xs md:text-base">{run.attachment.filename}</span>
        <Badge variant="secondary" class="text-xs hidden md:block">
          {run.attachment.mimetype}
        </Badge>
      </div>
      <Button
        variant="outline"
        size="sm"
        onclick={() => downloadFile(run)}
        class="inline-flex items-center gap-2"
      >
        <Download size={14} />
        Download
      </Button>
    </div>
  </Card.Content>
</Card.Root>

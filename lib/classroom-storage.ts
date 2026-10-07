export type RecordItem = { id: string; kind: string; [key: string]: any };

async function json(response: Response) {
  const result: any = await response.json();
  if (!response.ok) throw new Error(result.error || 'Could not save. Please retry.');
  return result;
}
export async function listRecords(): Promise<RecordItem[]> {
  return json(await fetch('/api/state'));
}
export async function saveRecord(kind: string, id: string, data: Record<string, unknown>) {
  await json(await fetch('/api/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind, id, data }) }));
  return { ...data, id, kind };
}
export async function removeEvent(id: string) {
  await json(await fetch('/api/state?id=' + encodeURIComponent(id), { method: 'DELETE' }));
}
export async function uploadFile(file: File) {
  const form = new FormData();
  form.set('file', file);
  return json(await fetch('/api/files', { method: 'POST', body: form }));
}
export async function downloadAttachment(id: string, name: string) {
  const response = await fetch('/api/files?id=' + encodeURIComponent(id));
  if (!response.ok) throw new Error('Attachment unavailable. Please retry.');
  saveBlob(await response.blob(), name);
}
export function saveBlob(blob: Blob, name: string) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

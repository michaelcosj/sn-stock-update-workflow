export const downloadFile = (item: any) => {
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

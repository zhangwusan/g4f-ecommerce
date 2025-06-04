export const previewBase64PDF = (base64Data: string) => {
  const byteCharacters = atob(base64Data.split(',')[1] || base64Data);
  const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);

  // Open PDF in new tab for preview only
  window.open(blobUrl, '_blank');

  // Clean up the blob URL after some time (10 seconds here)
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
};
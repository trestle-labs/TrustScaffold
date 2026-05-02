import 'server-only';

export function toPdfFileName(fileName: string) {
  const trimmed = fileName.trim();

  if (!trimmed) {
    return 'trustscaffold-export.pdf';
  }

  return /\.[a-z0-9]+$/i.test(trimmed)
    ? trimmed.replace(/\.[a-z0-9]+$/i, '.pdf')
    : `${trimmed}.pdf`;
}

export function buildQueuedSharePointPdfMetadata(input: {
  fileName: string;
  revisionId: string;
  contentHash: string;
  providerConfig: Record<string, unknown>;
}) {
  const folderPath = typeof input.providerConfig.folderPath === 'string'
    ? input.providerConfig.folderPath
    : null;
  const siteId = typeof input.providerConfig.siteId === 'string'
    ? input.providerConfig.siteId
    : null;
  const driveId = typeof input.providerConfig.driveId === 'string'
    ? input.providerConfig.driveId
    : null;

  return {
    renderer: 'pdf-v1',
    target_file_name: toPdfFileName(input.fileName),
    source_revision_id: input.revisionId,
    source_content_hash: input.contentHash,
    content_type: 'application/pdf',
    sharepoint_target: {
      site_id: siteId,
      drive_id: driveId,
      folder_path: folderPath,
    },
  };
}
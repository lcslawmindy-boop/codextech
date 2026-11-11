import useBriefPackManuscript from '@/hooks/useBriefPackManuscript';
import BriefPackDownloadPanel from '@/components/admin/BriefPackDownloadPanel';
import BriefPackContentGenerator from '@/components/admin/BriefPackContentGenerator';

export default function BriefPackManuscript() {
  const manuscript = useBriefPackManuscript();
  return <div className="space-y-6">
    <BriefPackDownloadPanel busy={manuscript.downloading} loading={manuscript.loading || manuscript.running} pageCount={manuscript.pageCount} error={manuscript.error} onDownload={manuscript.download} />
    <BriefPackContentGenerator manuscript={manuscript} />
  </div>;
}
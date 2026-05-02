import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Download, FileText, BarChart3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DocumentDashboard() {
  const [patentDrafts, setPatentDrafts] = useState([]);
  const [researchDocs, setResearchDocs] = useState([]);
  const [investorDecks, setInvestorDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Simulate fetching user documents - you can replace with actual entity queries
        setPatentDrafts([
          { id: 1, title: 'Scalar Field Generator Patent', date: '2026-04-28', status: 'draft' },
          { id: 2, title: 'Quantum Resonance Device', date: '2026-04-20', status: 'review' },
        ]);
        
        setResearchDocs([
          { id: 1, title: 'EM Field Harmonics Research Brief', date: '2026-04-25', status: 'published' },
          { id: 2, title: 'Free Energy Extraction Study', date: '2026-04-15', status: 'in-progress' },
        ]);
        
        setInvestorDecks([
          { id: 1, title: 'Series A Pitch Deck', date: '2026-04-27', status: 'completed' },
          { id: 2, title: 'Market Analysis Presentation', date: '2026-04-10', status: 'feedback' },
        ]);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDownloadAll = async () => {
    setDownloading(true);
    try {
      const response = await base44.functions.invoke('exportInventionBrochure', {
        title: 'Project Overview',
        documents: {
          patents: patentDrafts,
          research: researchDocs,
          decks: investorDecks,
        },
      });

      // Trigger download
      if (response.data?.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download compiled document');
    } finally {
      setDownloading(false);
    }
  };

  const DocumentCard = ({ icon: Icon, title, docs }) => (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-accent" />
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="secondary" className="ml-auto">{docs.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {docs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents yet</p>
        ) : (
          docs.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-2 rounded bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{doc.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(doc.date).toLocaleDateString()}</p>
              </div>
              <Badge variant="outline" className="text-xs">{doc.status}</Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-foreground mb-2">Document Dashboard</h1>
          <p className="text-muted-foreground">Centralized hub for patent drafts, research, and investor materials</p>
        </div>

        {/* Download All Button */}
        <div className="mb-8">
          <Button
            onClick={handleDownloadAll}
            disabled={downloading || (patentDrafts.length === 0 && researchDocs.length === 0 && investorDecks.length === 0)}
            className="bg-accent hover:bg-accent/90 text-background font-bold gap-2"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Compiling...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download All Documents
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Export all documents as a compiled project overview</p>
        </div>

        {/* Document Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DocumentCard icon={FileText} title="Patent Drafts" docs={patentDrafts} />
            <DocumentCard icon={Zap} title="Research Documents" docs={researchDocs} />
            <DocumentCard icon={BarChart3} title="Investor Decks" docs={investorDecks} />
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="bg-card/50 border-border/30">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Patents</p>
              <p className="text-3xl font-bold text-accent">{patentDrafts.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/30">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Research Docs</p>
              <p className="text-3xl font-bold text-accent">{researchDocs.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/30">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Investor Decks</p>
              <p className="text-3xl font-bold text-accent">{investorDecks.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
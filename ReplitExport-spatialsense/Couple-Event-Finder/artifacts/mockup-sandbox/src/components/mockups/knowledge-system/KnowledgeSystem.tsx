import { useState } from "react";
import { 
  Mic, 
  FileText, 
  Image as ImageIcon, 
  Network, 
  Search, 
  Tags, 
  Brain, 
  MessageSquare,
  Plus,
  Play,
  MoreVertical,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export function KnowledgeSystem() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-lg tracking-tight">Synapse</span>
        </div>

        <div className="p-4 flex-1">
          <Button className="w-full justify-start gap-2 mb-6 shadow-sm" size="lg">
            <Plus className="w-4 h-4" />
            New Capture
          </Button>

          <nav className="space-y-1">
            <NavItem icon={<Mic />} label="Voice Memos" count={12} active />
            <NavItem icon={<FileText />} label="Notes & Transcripts" count={128} />
            <NavItem icon={<ImageIcon />} label="Media & Images" count={45} />
            <div className="my-4 border-t border-neutral-200 dark:border-neutral-800"></div>
            <NavItem icon={<Tags />} label="Vaults & Tags" />
            <NavItem icon={<Network />} label="Graph View" />
          </nav>
        </div>
        
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Jane Doe</p>
              <p className="text-xs text-neutral-500">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header (Retrieval & Reuse) */}
        <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input 
              placeholder="Search across voice, text, images..." 
              className="pl-9 bg-neutral-100 dark:bg-neutral-800 border-none focus-visible:ring-1"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask AI
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-8 pb-12">
            
            {/* Knowledge Capture Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold tracking-tight">Quick Capture</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card 
                  className={`border-dashed border-2 transition-colors cursor-pointer group ${isRecording ? 'border-red-200 bg-red-50/50 dark:bg-red-900/10' : 'bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/50'}`}
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3 h-32">
                    <div className={`p-3 rounded-full transition-colors ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
                      <Mic className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-sm">{isRecording ? 'Recording...' : 'Record Audio'}</p>
                  </CardContent>
                </Card>
                <Card className="border-dashed border-2 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer group">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3 h-32">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-sm">Write Note</p>
                  </CardContent>
                </Card>
                <Card className="border-dashed border-2 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer group">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3 h-32">
                    <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-sm">Upload Media</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Tabs defaultValue="processing">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
                <TabsList>
                  <TabsTrigger value="processing">Processing (1)</TabsTrigger>
                  <TabsTrigger value="organized">Organized</TabsTrigger>
                </TabsList>
              </div>

              {/* Transcription & Enrichment Section */}
              <TabsContent value="processing" className="m-0 space-y-4">
                <Card>
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-full shrink-0 mt-1">
                      <Play className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium truncate">Product Strategy Meeting.m4a</h3>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          Transcribing...
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-500 mb-3">Captured via iPhone Voice Memos • 2 mins ago</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-2/3 animate-pulse rounded-full"></div>
                          </div>
                          <span className="text-xs font-medium text-neutral-500">67%</span>
                        </div>
                        <p className="text-xs text-neutral-500 italic flex items-center gap-1">
                          <Brain className="w-3 h-3" /> AI is extracting entities and summarizing key points...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Knowledge Organization & Semantic Linking Section */}
              <TabsContent value="organized" className="m-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Note Item 1 */}
                <Card className="hover:shadow-md transition-shadow group cursor-pointer">
                  <CardHeader className="p-5 pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-normal">Idea</Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-normal">Evernote Sync</Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">Graph Database Architecture</CardTitle>
                    <CardDescription>Generated from field notes • Yesterday</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-3">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                      To implement semantic linking across our vaults, we should consider using Neo4j. The graph view in Obsidian provides a good localized visualization, but a centralized graph DB will allow us to query connections between ideas, projects, and people much more efficiently at scale.
                    </p>
                  </CardContent>
                  <CardFooter className="p-5 pt-0 flex items-center gap-3">
                    <div className="flex items-center text-xs text-neutral-500 gap-1 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md">
                      <LinkIcon className="w-3 h-3" />
                      <span>3 Linked References</span>
                    </div>
                    <div className="flex -space-x-2">
                      <Avatar className="w-6 h-6 border-2 border-white dark:border-neutral-900">
                        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                      </Avatar>
                      <Avatar className="w-6 h-6 border-2 border-white dark:border-neutral-900">
                        <AvatarImage src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                      </Avatar>
                    </div>
                  </CardFooter>
                </Card>

                {/* Note Item 2 */}
                <Card className="hover:shadow-md transition-shadow group cursor-pointer">
                  <CardHeader className="p-5 pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-normal">Transcript</Badge>
                        <Badge variant="outline" className="bg-neutral-100 text-neutral-700 border-neutral-200 font-normal">Obsidian</Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">Client Discovery Call: Acme Corp</CardTitle>
                    <CardDescription>Processed by Claude AI • Oct 12</CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-3">
                    <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 mb-3">
                      <h4 className="text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wider">AI Summary</h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        Acme is struggling with data silos across 5 different CRM systems. They need a unified knowledge retrieval system. Budget approved for Q1.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">#sales</span>
                      <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">#acme-corp</span>
                      <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">#q1-initiative</span>
                    </div>
                  </CardContent>
                </Card>

              </TabsContent>
            </Tabs>
            
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

function NavItem({ icon, label, count, active = false }: { icon: React.ReactNode, label: string, count?: number, active?: boolean }) {
  return (
    <Button 
      variant={active ? "secondary" : "ghost"} 
      className={`w-full justify-between font-normal ${active ? 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-50' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}
    >
      <div className="flex items-center gap-3">
        <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>
        {label}
      </div>
      {count !== undefined && (
        <span className={`text-xs ${active ? 'text-neutral-600 dark:text-neutral-400' : 'text-neutral-400'}`}>
          {count}
        </span>
      )}
    </Button>
  );
}

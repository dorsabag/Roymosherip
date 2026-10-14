import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetAdminSession, 
  useListAdminMemories, 
  useModerateMemory, 
  useDeleteMemory,
  getListAdminMemoriesQueryKey,
  getListMemoriesQueryKey,
} from "@workspace/api-client-react";
import { memoryPrompts } from "@/data/prompts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ModerationInputStatus } from "@workspace/api-client-react";
import { format } from "date-fns";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: session, isLoading: isSessionLoading, isError: sessionError } = useGetAdminSession();
  const { data: memories = [], isLoading: isMemoriesLoading, isError: memoriesError } = useListAdminMemories({
    query: {
      enabled: session?.authenticated === true,
      queryKey: getListAdminMemoriesQueryKey()
    }
  });
  
  const moderate = useModerateMemory();
  const deleteMem = useDeleteMemory();

  const handleModerate = (id: number, status: ModerationInputStatus) => {
    moderate.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: "עודכן", description: "מצב הפרסום עודכן." });
        queryClient.invalidateQueries({ queryKey: getListAdminMemoriesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListMemoriesQueryKey() });
      },
      onError: () => toast({title:"העדכון לא נשמר", description:"נסו שוב בעוד רגע.",variant:"destructive"})
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("האם אתה בטוח שברצונך למחוק זיכרון זה לצמיתות?")) {
      deleteMem.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "נמחק", description: "הזיכרון נמחק" });
          queryClient.invalidateQueries({ queryKey: getListAdminMemoriesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListMemoriesQueryKey() });
        },
        onError: () => toast({title:"המחיקה לא בוצעה", description:"נסו שוב בעוד רגע.",variant:"destructive"})
      });
    }
  };

  if (isSessionLoading) {
    return <div className="min-h-screen flex items-center justify-center p-4 text-muted-foreground" dir="rtl">טוען...</div>;
  }
  if (sessionError) return <div className="p-12 text-center" role="alert">לא ניתן לבדוק את ההתחברות כרגע. נסו לרענן את הדף.</div>;
  if (session?.authenticated && memoriesError) return <div className="p-12 text-center" role="alert">לא ניתן לטעון זיכרונות כרגע. נסו לרענן את הדף.</div>;

  if (session && !session.configured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20" dir="rtl">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6 space-y-4">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">!</div>
            <h1 className="text-2xl font-bold text-destructive">הגדרת מערכת נדרשת</h1>
            <p className="text-muted-foreground">
              הגישה לניהול אינה זמינה כרגע. יש לפנות למנהל האתר.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session?.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8">
            <div className="text-center mb-8 space-y-2">
              <h1 className="text-3xl font-bold">ניהול זיכרונות</h1>
              <p className="text-muted-foreground">הגישה מיועדת למנהל האתר בלבד</p>
            </div>
            <Button asChild className="w-full h-12">
              <a href="/signin-with-chatgpt?return_to=%2Fadmin" target="_top">התחבר עם ChatGPT</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingMemories = memories.filter(m => m.status === 'pending');
  const approvedMemories = memories.filter(m => m.status === 'approved');
  const rejectedMemories = memories.filter(m => m.status === 'rejected');

  const renderMemoryList = (list: typeof memories, showActions: 'pending' | 'approved' | 'rejected') => {
    if (list.length === 0) {
      return (
        <div className="text-center p-12 bg-background border border-dashed rounded-xl text-muted-foreground">
          אין רשומות.
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {list.map(memory => {
          const prompt = memoryPrompts.find(p => p.key === memory.promptKey)?.label;
          return (
            <Card key={memory.id} className="bg-background shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">{memory.name}</h3>
                    <p className="text-muted-foreground text-sm">{memory.relationship}</p>
                    {memory.email && <p className="text-muted-foreground text-sm ltr font-mono" dir="ltr">{memory.email}</p>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(memory.createdAt), "dd/MM/yyyy HH:mm")}
                  </div>
                </div>
                
                {prompt && <div className="text-primary font-bold mb-2">{prompt}</div>}
                <div className="bg-muted/30 p-4 rounded-lg font-medium whitespace-pre-wrap leading-relaxed">
                  {memory.memoryText}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 px-6 py-4 flex flex-wrap gap-2 border-t">
                {showActions !== 'approved' && (
                  <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleModerate(memory.id, ModerationInputStatus.approved)}>
                    אשר
                  </Button>
                )}
                {showActions !== 'rejected' && (
                  <Button variant="secondary" onClick={() => handleModerate(memory.id, ModerationInputStatus.rejected)}>
                    דחה
                  </Button>
                )}
                <Button variant="destructive" onClick={() => handleDelete(memory.id)}>
                  מחק
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] bg-secondary/10 pb-20" dir="rtl">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-bold text-xl">מערכת ניהול - רועי משה</h1>
          <Button variant="ghost" asChild><a href="/signout-with-chatgpt?return_to=%2F" target="_top">התנתק</a></Button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-8 max-w-4xl">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full mb-8 h-12">
            <TabsTrigger value="pending" className="flex-1 h-full text-base relative">
              ממתין לאישור
              {pendingMemories.length > 0 && (
                <span className="absolute -top-1 -left-1 bg-destructive text-destructive-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {pendingMemories.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex-1 h-full text-base">אושרו ({approvedMemories.length})</TabsTrigger>
            <TabsTrigger value="rejected" className="flex-1 h-full text-base">נדחו ({rejectedMemories.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-0">
            {isMemoriesLoading ? <div className="text-center p-12 text-muted-foreground">טוען...</div> : renderMemoryList(pendingMemories, 'pending')}
          </TabsContent>
          
          <TabsContent value="approved" className="mt-0">
            {isMemoriesLoading ? <div className="text-center p-12 text-muted-foreground">טוען...</div> : renderMemoryList(approvedMemories, 'approved')}
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-0">
            {isMemoriesLoading ? <div className="text-center p-12 text-muted-foreground">טוען...</div> : renderMemoryList(rejectedMemories, 'rejected')}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
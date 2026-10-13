import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitMemory } from "@workspace/api-client-react";
import { memoryPrompts } from "@/data/prompts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MemoryInputPromptKey } from "@workspace/api-client-react";

const formSchema = z.object({
  name: z.string().min(2, "השם חייב להכיל לפחות 2 תווים").max(80, "השם ארוך מדי"),
  relationship: z.string().min(2, "אנא תאר/י את הקשר").max(100, "תיאור קשר ארוך מדי"),
  promptKey: z.nativeEnum(MemoryInputPromptKey, { required_error: "אנא בחר/י פתיח" }),
  memoryText: z.string().min(10, "הזיכרון קצר מדי").max(3000, "הזיכרון ארוך מדי"),
  email: z.string().email("כתובת אימייל לא חוקית").optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "יש לאשר פרסום זיכרון" }) }),
  website: z.string().optional() // honeypot
});

export function MemoryForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const submitMemory = useSubmitMemory();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      relationship: "",
      memoryText: "",
      email: "",
      website: "", // honeypot
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Treat empty email as undefined to match backend type restrictions possibly
    const payload = {
      ...values,
      email: values.email === "" ? undefined : values.email,
    };
    
    submitMemory.mutate(
      { data: payload },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
        onError: () => {
          toast({
            title: "שגיאה",
            description: "משהו השתבש בשליחת הזיכרון. נסו שוב בעוד רגע.",
            variant: "destructive"
          });
        }
      }
    );
  };

  if (isSubmitted) {
    return (
      <div role="status" className="py-12 text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ✓
        </div>
        <h3 className="text-2xl font-bold">תודה ששיתפת זיכרון מרועי ❤️</h3>
        <p className="text-muted-foreground text-lg">הזיכרון נשלח לאישור לפני הפרסום באתר.</p>
        <Button onClick={onSuccess}>סגירה</Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">השם שלך</FormLabel>
                <FormControl>
                  <Input placeholder="לדוגמה: יעל כהן" {...field} className="h-12 bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">איך הכרת את רועי?</FormLabel>
                <FormControl>
                  <Input placeholder="לדוגמה: חברת ילדות, שירתנו יחד" {...field} className="h-12 bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="promptKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">בחרו פתיח לזיכרון (חובה)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                <FormControl>
                  <SelectTrigger className="h-12 bg-background text-right">
                    <SelectValue placeholder="בחר/י פתיח..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" side="bottom" dir="rtl" className="w-full max-h-60 z-[105]">
                  {memoryPrompts.map((prompt) => (
                    <SelectItem key={prompt.key} value={prompt.key} className="text-right">
                      {prompt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memoryText"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">הזיכרון שלך</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="שתפ/י אותנו בזיכרון, סיפור או חוויה עם רועי..." 
                  className="min-h-[150px] resize-y bg-background text-base p-4"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email - optional */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">אימייל (לא יוצג באתר, רק למשפחה)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@gmail.com" {...field} className="h-12 bg-background text-left" dir="ltr" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Honeypot field - hidden from screen readers and visual layout */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem className="hidden absolute opacity-0 pointer-events-none w-0 h-0" aria-hidden="true" tabIndex={-1}>
              <FormControl>
                <Input {...field} tabIndex={-1} autoComplete="off" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-md border p-4 bg-muted/30">
              <FormControl>
                <Checkbox
                  checked={field.value === true}
                  onCheckedChange={(checked) => {
                    field.onChange(checked === true ? true : undefined);
                  }}
                  className="mt-1"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-normal text-base leading-relaxed cursor-pointer text-foreground/90">
                  אני מאשר/ת לפרסם את הזיכרון באתר לאחר אישור המשפחה.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          size="lg" 
          className="w-full h-14 text-lg rounded-xl shadow-md"
          disabled={submitMemory.isPending}
        >
          {submitMemory.isPending ? "שולח..." : "שליחת זיכרון"}
        </Button>
      </form>
    </Form>
  );
}
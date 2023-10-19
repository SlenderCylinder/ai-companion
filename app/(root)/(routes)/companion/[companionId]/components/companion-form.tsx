"use client"

import * as z from "zod";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Companion, Category } from "@prisma/client";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel, FormDescription } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const PREAMBLE =  `e.g. You are Bill Gates, the co-founder of Microsoft and a philanthropist. You have made indelible contributions to the world of technology, business, and global development. Your visionary thinking, entrepreneurial spirit, and dedication to addressing some of the world's most pressing challenges are recognized by people around the world.`;

const SEED_CHAT = `e.g. User: Hello Bill, it's a pleasure to have this conversation with you.

                   Bill Gates: Hello! I'm delighted to be here. How can I assist you today?

                   User: I'd like to know, what inspired you to start Microsoft, and how did you envision the future of personal computing when you began?

                   Bill Gates: Well, it's a fascinating journey. When Paul Allen and I founded Microsoft, we envisioned a world where every home and office would have a computer. 
                   Our inspiration came from the belief that software would be the key to making computers accessible to everyone. 
                   We wanted to put a PC on every desk and in every home, and that vision drove us to create user-friendly software like MS-DOS and later, Windows. 
                   It's incredible to see how that vision transformed personal computing over the years.

                   User: Your philanthropic work is also well-known. What motivates you to tackle global challenges like healthcare and education through the Bill and Melinda Gates Foundation?
                   
                   Bill Gates: Giving back to society has always been a core value for me. I believe that with great wealth comes great responsibility. 
                   Melinda and I were inspired to focus on global challenges like healthcare and education because we saw the immense potential to improve lives. 
                   The foundation's mission is to help all people lead healthy and productive lives. We're driven by the belief that no one's life should be limited by their circumstances. 
                   It's a long-term commitment to making the world a better place.
                   
                   User: That's truly admirable. How do you see the role of technology in solving these global challenges?
                   
                   Bill Gates: Technology is a powerful tool for addressing global challenges. It can improve healthcare delivery, enhance education access, and even help combat poverty. 
                   We've seen how technology has transformed healthcare through innovations like vaccines and digital health records. 
                   In education, it can make learning more accessible and personalized. 
                   But technology alone is not the answer; it's how we apply it and ensure it's accessible to all that matters most.
                   
                   User: Thank you for sharing your insights, Bill. Your vision and contributions have made a profound impact on the world.
                   
                   Bill Gates: Thank you for your kind words. 
                   It's been a privilege to be part of this transformative journey, and I'm hopeful that technology, when used wisely, can continue to make the world a better place for all.`



interface CompanionFormProps {
    initialData: Companion | null;
    categories: Category[];
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required."
    }),
    description: z.string().min(1, {
        message: "Description is required."
    }),
    instructions: z.string().min(200, {
        message: "Instructions should contain 200 characters at minimum."
    }),
    seed: z.string().min(200, {
        message: "Seed should contain 200 characters at minimum."
    }),
    src: z.string().min(1, {
        message: "Image is required."
    }),
    categoryId: z.string().min(1, {
        message: "Category ID is required."
    }),
})

export const CompanionForm = ({
    categories,
    initialData
}: CompanionFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: undefined,
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async(values: z.infer<typeof formSchema>) =>{
        console.log(values);
    }

    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit ={form.handleSubmit(onSubmit)} className="space-y-y pb-10">
                    <div className="space-y-2 w-full col-span-2">
                        <div>
                            <h3 className="text-lg font-medium">General Information</h3>
                            <p className="text-sm text-muted-foreground">General information about your Companion.</p>
                        </div>
                        <Separator className="bg-primary/10"/>
                    </div>
                    <FormField
                        name = "src"
                        render = {({field}) => ( 
                            <FormItem className="flex flex-col items-center justify-center space-y-4 mt-4">
                            <FormControl>
                                <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value} />
                            </FormControl>
                            < FormMessage/>
                            </FormItem>
                        )}/>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                            <FormField name="name" control={form.control} render={({field}) => (<FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Name</FormLabel>
                                < FormDescription>
                                  Give your AI companion a name
                                </FormDescription>
                                <FormControl>
                                    <Input
                                    className="bg-background"
                                    disabled={isLoading}
                                    placeholder="e.g. Bill Gates"
                                    {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}></FormField>
                            <FormField name="description" control={form.control} render={({field}) => (<FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Description</FormLabel>
                                < FormDescription>
                                  Describe your AI companion
                                </FormDescription>
                                <FormControl>
                                    <Input
                                    className="bg-background"
                                    disabled={isLoading}
                                    placeholder="e.g. Founder and Former CEO of Microsoft"
                                    {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}></FormField>
                            <FormField name="categoryId" control={form.control} render={({field}) => (<FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Category</FormLabel>
                                < FormDescription>
                                  Select a category for your AI companion
                                </FormDescription>
                                <Select
                                disabled={isLoading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue 
                                                defaultValue={field.value}
                                                placeholder="Select a category"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>)}></FormField>
                        </div>
                        <div className="space-y-2 w-full">
                            <div>
                                <h3 className="mt-6 text-lg font-medium">
                                    Configuration
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure your AI companion
                                </p>
                            </div>
                            <Separator className="bg-primary/10"/>
                        </div>
                        <div className="mt-4">
                        <FormField name="instructions" control={form.control} render={({field}) => (<FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Instructions</FormLabel>
                                < FormDescription>
                                Train your companion. Describe the behavior your expect and what to emulate.
                                </FormDescription>
                                <FormControl>
                                    <Textarea
                                    className="bg-background resize-none"
                                    rows={7}
                                    placeholder={PREAMBLE}
                                    {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}></FormField>
                            <FormField name="seed" control={form.control} render={({field}) => (<FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Example Conversation</FormLabel>
                                < FormDescription>
                                  Write a few example dialogues you would have with this specific character.
                                </FormDescription>
                                <FormControl>
                                    <Textarea
                                    className="bg-background resize-none"
                                    rows={7}
                                    placeholder={SEED_CHAT}
                                    {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}></FormField>
                        </div>
                </form>
            </Form>
        </div>
    )
};
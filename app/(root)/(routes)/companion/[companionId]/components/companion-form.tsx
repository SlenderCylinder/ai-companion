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
                                  Describe your AI companion
                                </FormDescription>
                                <FormControl>
                                    <Textarea
                                    className="bg-background resize-none"
                                    rows={7}
                                    placeholder="e.g. TODO"
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
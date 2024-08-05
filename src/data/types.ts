import { z } from "zod";

export type HomePageSectionType = z.infer<typeof HomePageSectionSchema>;
export type HomePageDataArray = z.infer<typeof HomePageDataArray>; 

export const HomePageSectionSchema = z.object({
  title: z.string(),
  isExpanded: z.boolean().default(false),
  links: z.array(
    z.object({
      iconUrl: z.string(),
      label: z.string(),
      url: z.string()
    })
  )
})

export const HomePageDataArray = z.array(HomePageSectionSchema)

import { z } from "zod";

/**
 * Home Page types
 */

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

/**
 * Tech Rafar types. See:
 * https://github.com/backstage/community-plugins/blob/main/workspaces/tech-radar/plugins/tech-radar/src/api.ts
 */

export type TechRadarData = z.infer<typeof TechRadarLoaderResponseSchema>; 

const TechRadarRingSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  description: z.string().optional(),
});

// RadarQuadrant Schema
const TechRadarQuadrantSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// RadarEntryLink Schema
const TechRadarEntryLinkSchema = z.object({
  url: z.string(),
  title: z.string(),
});

// MovedState Schema (enum of -1, 0, and 1 for movement states)
const TechRadarMovedStateSchema = z.union([z.literal(-1), z.literal(0), z.literal(1)]);

// RadarEntrySnapshot Schema
const TechRadarEntrySnapshotSchema = z.object({
  date: z.string().transform(s => new Date(s)),
  ringId: z.string(),
  description: z.string().optional(),
  moved: TechRadarMovedStateSchema.optional(),
});

// RadarEntry Schema
const TechRadarEntrySchema = z.object({
  key: z.string(),
  id: z.string(),
  quadrant: z.string(),
  title: z.string(),
  url: z.string().optional(), // Deprecated, can be optional
  timeline: z.array(TechRadarEntrySnapshotSchema),
  description: z.string().optional(),
  links: z.array(TechRadarEntryLinkSchema).optional(),
});

// TechRadarLoaderResponse Schema
export const TechRadarLoaderResponseSchema = z.object({
  quadrants: z.array(TechRadarQuadrantSchema),
  rings: z.array(TechRadarRingSchema),
  entries: z.array(TechRadarEntrySchema),
});

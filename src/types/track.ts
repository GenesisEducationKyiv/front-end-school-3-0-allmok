import { z } from 'zod';

export const MetaSchema = z.object({
  total: z.number().int().min(0),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().min(0),
});


export const TrackSchema = z.object({
  id: z.string(),  

  title: z.string().min(1, { message: "Track name is required" }),
  artist: z.string().min(1, { message: "Artist name is required" }),
  album: z.string().optional(),
  genres: z.array(z.string()),
  slug: z.string().optional(),
  coverImage: z.string().url({ message: "Please enter a valid image URL" }).optional().nullable().or(z.literal('')),
  audioFile: z.string().optional().nullable(),
  createdAt: z.string().datetime({ message: "Invalid creation date format" }),
  updatedAt: z.string().datetime({ message: "Invalid update date format" }),
  duration: z.number().int().positive().optional(),
});


export const TracksApiResponseSchema = z.object({
  data: z.array(TrackSchema),
  meta: MetaSchema,
});


export const BulkDeleteResponseSchema = z.object({
  success: z.array(z.string()), 
  failed: z.array(z.string()),
});


export const NewTrackDataSchema = z.object({
  title: TrackSchema.shape.title,
  artist: TrackSchema.shape.artist,
  album: TrackSchema.shape.album.optional(), 
  genres: TrackSchema.shape.genres.min(1, { message: "Choose at least one genre" }), 
  coverImage: TrackSchema.shape.coverImage,
});


export const UpdateTrackDataSchema = NewTrackDataSchema.partial();


export type Meta = z.infer<typeof MetaSchema>;
export type Track = z.infer<typeof TrackSchema>;
export type TracksApiResponse = z.infer<typeof TracksApiResponseSchema>;
export type BulkDeleteResponse = z.infer<typeof BulkDeleteResponseSchema>;
export type NewTrackData = z.infer<typeof NewTrackDataSchema>;
export type UpdateTrackData = z.infer<typeof UpdateTrackDataSchema>;


export const GetTracksResponseSchema = z.object({
    tracks: z.array(TrackSchema),
    meta: MetaSchema,
});
export type GetTracksResponse = z.infer<typeof GetTracksResponseSchema>;

export const GenresSchema = z.array(z.string());
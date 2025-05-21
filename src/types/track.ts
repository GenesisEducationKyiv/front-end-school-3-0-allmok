export interface Meta {
    totalItems: number;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  

  export interface TracksApiResponse { 
  data: Track[];
  meta: Meta;
}

export interface BulkDeleteResponse {
  success: string[];
  failed: string[];
}



export interface GetTracksResponse {
  tracks: Track[]; 
  meta: Meta;
}

  export interface Track {
    id: string;
    title: string;
    artist: string;
    album?: string;
    genres: string[];
    slug?: string; 
    coverImage?: string; 
    audioFile?: string; 
    createdAt: string;
    updatedAt: string;
    duration?: number; 
  }
  

  export interface TracksApiResponse {
    data: Track[]; 
    meta: Meta;  
  }
  

  export interface GenreObject { 
     id: string; 
     name: string;
  }


export interface Meta {}
export interface Track {}
export interface TracksApiResponse { data: Track[]; meta: Meta; }
export interface GenreObject {} 

export interface NewTrackData {
    title: string;
    artist: string;
    album?: string;
    genres: string[];
    coverImage?: string;
  }

  export type UpdateTrackData = Partial<NewTrackData>;
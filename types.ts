
export interface CarouselCard {
  id: number;
  text: string;
  image: string | null;
  isGenerating: boolean;
  error: string | null;
}

export enum AppState {
  START,
  EDITING,
  PREVIEW,
}

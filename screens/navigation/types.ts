export type RootStackParamList = {
  ModeSelector: undefined;
  FlashCard: undefined;
  SavedFolders: undefined;
  SavedSets: { folder: string };
  SetDetails: { setId?: string } | undefined;
};

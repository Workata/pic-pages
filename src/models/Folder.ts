export interface Folder {
  id: string;
  name: string;
}

export interface ChainedFolder {
  // folder for creating a path navigation
  id: string;
  name: string;
  level: number;
}

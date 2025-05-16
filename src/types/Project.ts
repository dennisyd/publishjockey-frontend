export type Project = {
  id: string;
  title: string;
  author?: string;
  subtitle?: string;
  sections: Section[];
  isbn?: string;
  // ... existing code ...
}

export type Section = {
  id: string;
  title: string;
  content: string;
  level: number;
  matter?: string;
}; 
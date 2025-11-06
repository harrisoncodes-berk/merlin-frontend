export const queryKeys = {
  characters: {
    all: ["characters"] as const,
    list: ["characters", "list"] as const,
    detail: (id: string) => ["characters", "detail", id] as const,
  },
  creator: {
    races: ["creator", "races"] as const,
    classes: ["creator", "classes"] as const,
    backgrounds: ["creator", "backgrounds"] as const,
  },
} as const;



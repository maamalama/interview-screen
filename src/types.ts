export type Component = { id: string } & (
  | {
      type: "text";
      text: string;
    }
  | { type: "image"; src: string }
);

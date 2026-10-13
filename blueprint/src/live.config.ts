import { defineLiveCollection } from "astro:content";
import { emdashLoader } from "emdash/runtime";

export const collections = {
  emdash: defineLiveCollection({ loader: emdashLoader() }),
};

import { searchClient } from "@algolia/client-search";

const client = searchClient(
  process.env.ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_API as string
);

export { client };

import { LRUCache } from "lru-cache";

const options = {
  max: 500,

//   // for use with tracking overall storage size
//   maxSize: 5000,

//   size: 1,
//   // how long to live in ms
//   ttl: 1000 * 60 * 5,

//   // return stale items before removing from cache?
//   allowStale: false,

//   updateAgeOnGet: false,
//   updateAgeOnHas: false,
};

const cache = new LRUCache(options);
export default cache;

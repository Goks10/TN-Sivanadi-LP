const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_DATASET_ID   = process.env.META_DATASET_ID;

if (!META_ACCESS_TOKEN) {
  throw new Error('[Meta CAPI] Missing environment variable: META_ACCESS_TOKEN');
}
if (!META_DATASET_ID) {
  throw new Error('[Meta CAPI] Missing environment variable: META_DATASET_ID');
}

module.exports = { META_ACCESS_TOKEN, META_DATASET_ID };

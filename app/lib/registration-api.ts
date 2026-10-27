const productionApi = "https://api.exodiacec.in";
const configuredApi =
  process.env.NEXT_PUBLIC_REGISTRATION_API_URL ?? productionApi;
const configuredUrl = new URL(configuredApi);
const localHost = ["localhost", "127.0.0.1", "[::1]"].includes(
  configuredUrl.hostname,
);
export const registrationApiUrl = (
  process.env.NODE_ENV === "production" &&
  (configuredUrl.protocol !== "https:" || localHost)
    ? productionApi
    : configuredApi
).replace(/\/$/, "");

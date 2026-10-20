// tgcloud/endpoints/ping.js
// Quick health check / latency test endpoint

export default async function (input, ctx) {
  return {
    pong: true,
    serverTime: Date.now(),
    authenticatedUser: ctx?.initData?.user?.id ?? null,
    echo: input,
  };
}
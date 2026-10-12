export default {
  async fetch(request, env, ctx) {
    return new Response("Collecting Rent Worker is Running Successfully!", {
      headers: { "content-type": "text/plain" },
    });
  },
};

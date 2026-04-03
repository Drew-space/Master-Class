import { api } from "./_generated/api";
import { Webhook } from "./../node_modules/svix/src/webhook";
import { WebhookEvent } from "./../node_modules/@clerk/backend/dist/api/resources/Webhooks.d";
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import stripe from "../lib/stripe";

const http = httpRouter();

const clerkwebhook = httpAction(async (ctx, request) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable ");
  }

  const svix_id = request.headers.get("svix-id");
  const svix_signature = request.headers.get("svix-signature");
  const svix_timestamp = request.headers.get("svix-timestamp");
  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("Error occured --- no svix headers", { status: 400 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timestamp,
    }) as WebhookEvent;
  } catch (error) {
    console.log("error verifying the webhook", error);
    return new Response("error occured", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { email_addresses, first_name, id, last_name, username } = evt.data;
    // const eventData = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { clerkId: id, username: username },
      });

      await ctx.runMutation(api.users.createUser, {
        email,
        name,
        clerkId: id,
        username: username || email.split("@")[0],
        stripeCustomerId: customer.id,
      });

      // TODO: SEND A WELCOME EMAIL AS WELL
    } catch (error) {
      console.log("error creating user in convex", error);
      return new Response("error occured", { status: 500 });
    }
  }

  // if (eventType === "user.deleted") {
  //   const { id } = evt.data;
  //   try {
  //     await ctx.runMutation(api.users.deleteUserAndPosts, {
  //       clerkId: id as string,
  //     });
  //   } catch (error) {
  //     console.log("error deleting user in convex", error);
  //     return new Response("error occured", { status: 500 });
  //   }
  // }

  return new Response("Webhook processed successfully", { status: 200 });
});

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: clerkwebhook,
});

export default http;

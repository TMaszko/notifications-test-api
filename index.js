require("dotenv").config();
const admin = require("firebase-admin");
const fastify = require("fastify")({ logger: true });
// Initialize Firebase

admin.initializeApp({ credential: admin.credential.applicationDefault() });

const token = "XXX";

async function sendMessage(token) {
  return admin.messaging().send({
    token,
    notification: {
      body: "Hello world alarm",
      title: "Maybe",
    },
    data: {
      notifee: JSON.stringify({
        body: "This message was sent via FCM!",
        android: {
          channelId: "default",
          actions: [
            {
              title: "Mark as Read",
              pressAction: {
                id: "read",
              },
            },
          ],
        },
      }),
    },
  });
}

// Declare a route
fastify.post("/notifications", async (request, reply) => {
  await sendMessage(token);
  return "OK";
});

fastify.post("/alarm", async (request, reply) => {
  setTimeout(async () => {
    await sendMessage(token);
    reply.send("OK");
  }, 20000);
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

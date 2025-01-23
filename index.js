import admin from "firebase-admin";
import express from "express";
const app = express();
app.use(express.json());
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
// app.use(cors(corsoptions));
const FIRE_BASE_MSG_OPTION = {
  priority: "high",
  timeToLive: 60 * 10,
  // urgency: 'high',
  // visibility: 'public' //private
};
app.get("/ping", (req, res) => {
  res.send("pong");
});
app.post("/test", sendNotificationToUser);

export async function firebaseConnection() {
  let fb_client;
  try {
    console.log("Connecting to firebase...");
    fb_client = admin.initializeApp({
      credential: admin.credential.cert("./firebaseConfig.json"),
    });
    // fb_client = await admin.initializeApp({ credential: admin.credential.cert(<admin.ServiceAccount>FIRE_ACCOUNT_CONFIG) })
    console.log("Connected to firebase successfully...");
    return fb_client;
  } catch (err) {
    console.log("Firebase staring error", err);
    try {
      fb_client = await admin.initializeApp(
        {
          credential: admin.credential.cert("./firebaseConfig.json"),
        },
        "notification-b3c91"
      );
      return fb_client;
    } catch (error) {
      console.log("Firebase staring error", error);
      return null;
    }
  }
}
// firebaseConnection();

async function sendNotificationToUser(req, res) {
  const fcm_token = req?.body?.fcm_token;
  console.log(fcm_token);
  let firebaseRes = await firebaseConnection();
  if (firebaseRes == null) {
    console.log("Error in connection firebase, Reconnectiong.. ");
    await firebaseConnection();
    if (firebaseRes == null) {
      console.log("Error in connection firebase, Reconnectiong.. ");
      //   res.status(404).send("Error in connecting");
    }
  }
  // let fcmToken = "fYN5vMbeQYiGa003ROEfD9:APA91bF0gmnYk37yU3wb1TeHSh6zRaWEmmwOzDLdeo2F-BcsmMtYZpQmsk18Hs1T0DD1fJE4YyPFCdaCvA9M2d4QWany9D6Hx3_KJBuXz7SgiIsX-qwVOxO_jMetr5aVsq7t9zvZvReQ"
  // let payload = {
  //     notification: {
  //         title: "Notify Alert",
  //         body: "work startedat G-shop"
  //     },
  //     data: {
  //         title: "Notify Alert",
  //         body: "work startedat G-shop"
  //     },
  // }
  // Get the messaging service
  const messaging = admin.messaging();

  // Define the notification message content
  const message = {
    notification: {
      title: "Notify Alert",
      body: "work started at G-shop",
    },
    android: {
      priority: "high", // Optional: Set notification priority (high or normal)
    },
    token: fcm_token, // Replace with the recipient's device token
  };
  // Send the notification
  messaging
    .send(message)
    .then((response) => {
      let r = response.split("/");
      let resp = r[r.length - 1];
      console.log("Successfully sent message:", response, resp);
      res.status(200).send({ message: "Notification sent successfully..." });
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      res.status(500).send({ message: error.message });
    });
}

app.listen(5000, () => {
  console.log("server is lstening ");
});

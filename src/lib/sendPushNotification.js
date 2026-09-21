const sendPushNotification = async (
  pushToken,
  title,
  body
) => {
  if (!pushToken) {
    console.log(
      "No push token. Push notification not sent."
    );

    return;
  }

  const message = {
    to: pushToken,

    sound: "default",

    title: title,

    body: body,

    data: {
      screen: "Notifications",
    },
  };

  try {
    const response = await fetch(
      "https://exp.host/--/api/v2/push/send",
      {
        method: "POST",

        headers: {
          Accept: "application/json",

          "Accept-encoding": "gzip, deflate",

          "Content-Type": "application/json",
        },

        body: JSON.stringify(message),
      }
    );

    const data = await response.json();

    console.log(
      "Push notification response:",
      data
    );

  } catch (error) {
    console.log(
      "Push notification error:",
      error
    );
  }
};

export default sendPushNotification;
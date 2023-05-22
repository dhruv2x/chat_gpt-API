import { config } from "dotenv";
config();

import { Configuration, OpenAIApi } from "openai";
import readline from "readline";

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const eventDetails = {};

const getEventDetails = () => {
  userInterface.question("Event Name: ", (eventName) => {
    eventDetails.eventName = eventName;
    userInterface.question("Event Date: ", (eventDate) => {
      eventDetails.eventDate = eventDate;
      userInterface.question("Event Time: ", (eventTime) => {
        eventDetails.eventTime = eventTime;
        userInterface.question("Event Location: ", (eventLocation) => {
          eventDetails.eventLocation = eventLocation;
          userInterface.question("Ticket Pricing: ", (ticketPricing) => {
            eventDetails.ticketPricing = ticketPricing;
            userInterface.question("Event Category: ", (eventCategory) => {
              eventDetails.eventCategory = eventCategory;
              userInterface.question(
                "Speakers/Performers (comma-separated list): ",
                (speakersPerformers) => {
                  eventDetails.speakersPerformers = speakersPerformers.split(
                    ","
                  );
                  userInterface.question("Agenda: ", (agenda) => {
                    eventDetails.agenda = agenda;
                    userInterface.question(
                      "Additional Details: ",
                      (additionalDetails) => {
                        eventDetails.additionalDetails = additionalDetails;
                        generateEventDescription();
                      }
                    );
                  });
                }
              );
            });
          });
        });
      });
    });
  });
};

const generateEventDescription = async () => {
  let eventDescription = `Event Name: ${eventDetails.eventName}\n`;
  eventDescription += `Event Date: ${eventDetails.eventDate}\n`;
  eventDescription += `Event Time: ${eventDetails.eventTime}\n`;
  eventDescription += `Event Location: ${eventDetails.eventLocation}\n`;
  eventDescription += `Ticket Pricing: ${eventDetails.ticketPricing}\n`;
  eventDescription += `Event Category: ${eventDetails.eventCategory}\n`;
  eventDescription += `Speakers/Performers: ${eventDetails.speakersPerformers.join(
    ", "
  )}\n`;
  eventDescription += `Agenda: ${eventDetails.agenda}\n`;
  eventDescription += `Additional Details: ${eventDetails.additionalDetails}\n`;

  const response = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an event organizer creating a description for an upcoming event." },
      { role: "user", content: eventDescription },
    ],
  });

  const generatedDescription = response.data.choices[0].message.content;
  console.log("Generated Event Description:\n");
  console.log(generatedDescription);

  userInterface.close();
};

getEventDetails();

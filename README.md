# This project

Typebot is an open-source chatbot builder. It allows you to create advanced chatbots visually, embed them anywhere on your web/mobile apps, and collect results in real-time

This project is a fork of Tyebot that allows you to create workflows integrated with the Milvus ecosystem

Source repository: https://github.com/baptisteArno/typebot.io 

## Milvus

Milvus is a ticket management and helpdesk system with several integrations

Check out the company's website: https://milvus.com.br/

## Features

Typebot makes it easy to create advanced chatbots. It provides the building block that are adaptable to any business use case. I improve Typebot regularly with bug fixes, new features, and performance improvements regularly.

**Chat builder** with 34+ building blocks such as:

- 💬 Bubbles: Text, Image / GIF, video, audio, embed.
- 🔤 Inputs: Text, email, phone number, buttons, picture choice, date picker, payment (Stripe), file picker... inputs
- 🧠 Logic: Conditional branching, URL redirections, scripting (Javascript), A/B testing
- 🔌 Integrations: Webhook / HTTP requests, OpenAI, Google Sheets, Google Analytics, Meta Pixel, Zapier, Make.com, Chatwoot, More to come...

**Theme** your chatbot to match your brand identity:

- 🎨 Customize the fonts, background, colors, roundness, shadows, and more
- 💪 Advanced theming with custom CSS.
- 💾 Reusable theme templates

**Share** your typebot anywhere:

- 🔗 Custom domain
- 👨‍💻 Embed as a container, popup, or chat bubble easily with the native JS library.
- ⚡ Blazing fast embed lib. No iframe, no external dependencies, no performance impact.
- 💻 Executable with HTTP requests

Collect your **Results** and get insights:

- 📊 In-depth analytics with drop-off rates, completion rates, and more
- 📥 Export results to CSV

Built for **developers**:

- 🔓 No vendor-locking. Features built with flexibility in mind.
- 💻 Easy-to-use [APIs](https://docs.typebot.io/api-reference).

---

## Support & Community

You'll find a lot of resources to help you get started with Typebot in the [documentation](https://docs.typebot.io/).

- Have a question? Join the [Discord server](https://typebot.io/discord) and get instant help.
- Found a bug? [Create an issue](https://github.com/baptisteArno/typebot.io/issues/new)

## License

Typebot is open-source under the GNU Affero General Public License Version 3 (AGPLv3). You will find more information about the license and how to comply with it [here](https://docs.typebot.io/self-hosting#license-requirements).

## Run

      nvm use 18.17.0 

      ensure docker is running

      Set the .env file

      pnpm i

      pnpm dev

      You can access:

            Builder                     http://localhost:3000
            Viewer                      http://localhost:3001
            Database inspector          http://localhost:5555

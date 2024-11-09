import axios from "axios";

export async function POST(req: Request) {
  const { base64Image } = await req.json();

  try {
    const response = await axios.post("http://localhost:11434/api/chat", {
      model: "llava-llama3", // llava | llava-llama3
      messages: [
        {
          role: "assistant",
          content: `You are a content maker, you are given a photo or image and a request to review this photo and give a short description.
            This description has to be short and information, so it can be used as an alternative text for image for the people, who use screen reader or assistive technology.
            Respond with five alternative texts. Alway write the variant as short as possible, but informative and use
            numbers to separate the variants. For example: 1. "A photo of a cat" 2. "A cat" 3. "A cute cat" 4. "A cat on a table" 5. "A cat looking at the camera". You have to separate the variants with '\n'`,
        },
        {
          role: "user",
          content: "Please describe this image, but as short as possible. With a couple of words. I want to use the description for alternative text by images on my website. Give me at least five variants of the short texts, so I can choose the best one.",
          images: [base64Image],
        },
      ],
      stream: false,
    });

    console.log('response', response);

    return Response.json({
      description: response.data.message.content,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch description");
  }
}

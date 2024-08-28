import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: true,
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = new IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ message: "Error processing form" });
      return;
    }

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description;
    const address = Array.isArray(fields.address)
      ? fields.address[0]
      : fields.address;
    const image = files.image ? files.image[0] : null;

    if (!name || !description || !address || !image) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
  });
}

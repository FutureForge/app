import { NextApiRequest, NextApiResponse } from "next";
import Collection from "../../../utils/models/index";
import { dbConnect } from "@/utils/lib";
// import dbConnect from "../../../utils/lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    if (req.method === "GET") {
      try {
        const collections = await Collection.find({});
        res.status(200).json({ success: true, data: collections });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to get collections",
          error,
        });
      }
    } else if (req.method === "POST") {
      const { collectionContractAddress, name, description } = req.body;

      try {
        const newCollection = new Collection({
          collectionContractAddress,
          name,
          description,
        });

        await newCollection.save();
        res.status(201).json({ success: true, data: newCollection });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Failed to add collection", error });
      }
    } else {
      res.status(405).json({ success: false, message: "Method not allowed" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

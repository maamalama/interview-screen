// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { readFile, writeFile } from "fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import { Component } from "../../src/types";
import { randomUUID } from 'crypto';
import { IncomingForm } from "formidable";
import path from 'path';

//TODO: Separate HTTP methods to different functions and use them in handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      const components = await getComponents();
      return res.status(200).json(components);
    case 'POST':
      //TODO: Fix type
      const data: any = await new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.parse(req, (err, fields, files) => {
          if (err) {
            reject(err);
            throw err;
          }
          resolve({ fields, files });
        });
      });

      //TODO: Validate component
      const component: Component = {
        id: randomUUID(),
        type: data.fields.type,
        ...(data.fields.type === 'text' ?
          { text: data.fields.text }
          :
          { src: await uploadFiles(data.files.image) }),
      }

      await storeComponent(component);

      return res.status(201).json({ message: 'Component created' });
    default:
      return res.status(404).json({ message: "Not found" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const getComponents = async (): Promise<Component[]> => {
  const file = path.join(process.cwd(), 'database.json');
  const components = await readFile(file, 'utf8');
  return JSON.parse(components);
}

const storeComponent = async (component: Component): Promise<void> => {
  const json = JSON.parse(await readFile(`${process.cwd()}/database.json`, 'utf8'));
  json.push(component);
  //TODO: Check components with same id
  await writeFile(`${process.cwd()}/database.json`, JSON.stringify(json), 'utf8');
}

//TODO: add type to file
const uploadFiles = async (file: any): Promise<string> => {
  const imagePath = file.filepath;
  const pathToWriteImage = `images/${randomUUID()}-${file.originalFilename}`; // include name and .extention, you can get the name from data.files.image object
  const image = await readFile(imagePath);
  await writeFile(`public/${pathToWriteImage}`, image);
  //TODO: Probably get hostname from process
  return `${process.env.HOSTNAME}${pathToWriteImage}`;
}
import { ObjectId } from "mongodb";

export interface Message {
  _id?: ObjectId;
  roomId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: Date;
}
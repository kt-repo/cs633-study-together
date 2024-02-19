import {Meetup} from "./Meetup";

export interface User {
  _id: string;
  username: string,
  firstname: string,
  lastname: string,
  favorites: [Meetup],
  address: string,
  school: string
}

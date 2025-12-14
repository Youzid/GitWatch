import { Generated } from 'kysely';



export interface UserTable {
  id: Generated<number>;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
}









// export type Trip = Selectable<TripTable>;
// export type NewTrip = Insertable<TripTable>;
// export type TripUpdate = Updateable<TripTable>;
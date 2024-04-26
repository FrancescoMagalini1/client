export type user = {
  token: string;
  name: string;
  surname: string;
  id: number;
};

export type patient = {
  id: number;
  name: string;
  surname: string;
  dateOfBirth: string;
  gender: "M" | "F" | "O";
  description: string;
  photo: string;
};

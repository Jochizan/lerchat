interface TypeUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

interface TypeSession {
  email: string;
  password: string;
}

export type { TypeUser, TypeSession };

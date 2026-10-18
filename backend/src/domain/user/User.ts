import { type EntityProps, Entity } from '../shared/Entity';

interface UserProps extends EntityProps {
  email: string;
  password: string;
  name: string;
  surname: string;
  username: string;
  bio?: string | null;
}

export class User extends Entity {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly surname: string;
  readonly username: string;
  readonly bio: string | null;

  constructor(props: UserProps) {
    super(props);

    this.email = props.email;
    this.password = props.password;
    this.name = props.name;
    this.surname = props.surname;
    this.username = props.username;
    this.bio = props.bio ?? null;
    
  }
}

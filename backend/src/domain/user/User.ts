import { type EntityProps, Entity } from "../shared/Entity.js";
import { Article } from "../article/Article.js";

interface UserProps extends EntityProps {
  email: string;
  password: string;
  name: string;
  surname: string;
  articles: Article[];
}

export class User extends Entity {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly surname: string;
  readonly username: string;

  constructor(props: UserProps) {
    super(props);

    this.email = props.email;
    this.password = props.password;
    this.name = props.name;
    this.surname = props.surname;
    this.username = props.surname;
  }
}

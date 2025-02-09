import {Collection, Entity, ManyToMany, ManyToOne, OptionalProps, Property, t} from '@mikro-orm/core';
import {BaseEntity} from '../common/base.entity.js';
import {User} from '../user/user.entity.js';
import {Tag} from "./tag.entity.js";

function convertToSlug(text: string) {
  return text.toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

type OptionalProps = 'slug' | 'description';

@Entity()
export class Article extends BaseEntity<OptionalProps> {

  @Property({unique: true})
  slug!: string;

  @Property({index: true})
  title!: string;

  @Property({length: 1000})
  description!: string;

  @Property({type: t.text, lazy: true})
  text!: string;

  @ManyToOne()
  author!: User;

  @ManyToMany()
  tags = new Collection<Tag>(this);

  constructor(title: string, text: string, author: User) {
    super();
    this.title = title;
    this.text = text;
    this.author = author;
    this.slug = convertToSlug(title);
    this.description = this.text.substring(0, 999) + '…';
  }

}

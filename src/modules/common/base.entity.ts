import {OptionalProps, PrimaryKey, Property} from '@mikro-orm/core';
import {randomUUID} from "node:crypto";

export abstract class BaseEntity<Optional = never> {

  [OptionalProps]?: 'createdAt' | 'updatedAt' | Optional;

  @PrimaryKey({type: 'uuid'})
  id = randomUUID();

  @Property()
  createdAt = new Date();

  @Property({onUpdate: () => new Date()})
  updatedAt = new Date();

}

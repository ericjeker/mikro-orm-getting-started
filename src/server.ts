import {User} from "./modules/user/user.entity.js";
import {MikroORM} from "@mikro-orm/sqlite";
import {Article} from "./modules/article/article.entity.js";
import {Tag} from "./modules/article/tag.entity.js";

const orm = await MikroORM.init();

// recreate the database schema
await orm.schema.refreshDatabase();

// fork first to have a separate context
const em = orm.em.fork();

// create new user entity instance
const user = new User(
  'Foo Bar',
  'foo@bar.com',
  '123456',
);

console.log(user);

// first mark the entity with `persist()`, then `flush()`
await em.persist(user).flush();

console.log(user);

// clear the context to simulate fresh request
em.clear();

// create the article instance
const article = em.create(Article, {
  title: 'foo',
  text: 'Lorem impsum dolor sit amet',
  author: user.id,
});

// and persist it to the database
await em.persist(article).flush();

// after the entity is flushed, it becomes managed, and has the PK available
em.clear();

// find a user and populate manually the articles
const userWithArticles = await em.findOneOrFail(User, user.id, {populate: ['articles']});

// or you could lazy load the collection later via `init()` method
if (!userWithArticles.articles.isInitialized()) {
  await userWithArticles.articles.init();
}

// to ensure collection is loaded (but do nothing if it already is), use `loadItems()` method
await userWithArticles.articles.loadItems();

console.log(userWithArticles);

for (const article of userWithArticles.articles) {
  // create some tags and assign them to the first article
  const newTag = em.create(Tag, { name: 'new' });
  const oldTag = em.create(Tag, { name: 'old' });
  article.tags.add(newTag, oldTag);
  await em.flush();

  console.log(article.tags);
}

// close the connection
await orm.close();

import 'dotenv/config';
import { Sequelize } from 'sequelize';
import { Users } from './models/Users.js';
import { Sessions } from './models/Sessions.js';

export const db = new Sequelize(process.env.DATABASE_URL ?? '', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: { timestamps: false },
  logging: false
});

await db.authenticate();
Users.initialize(db);
Sessions.initialize(db);
await db.sync({ alter: true });

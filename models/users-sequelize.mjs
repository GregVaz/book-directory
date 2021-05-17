import { User, AbstractUsersStore } from './user.mjs';
import { SQBook } from './books-sequelize.mjs';
import Sequelize from 'sequelize';
import {
  connectDB as connectSequlz,
  close as closeSequlz
} from './index.mjs';
import DBG from 'debug';
const debug = DBG('users:users-sequelize');
const dberror = DBG('users:error-sequelize');

var sequelize;
export class SQUser extends Sequelize.Model {}

async function connectDB() {
  if (sequelize) return;
  sequelize = await connectSequlz();
  SQUser.init({
    email: { type: Sequelize.DataTypes.STRING, primaryKey: true },
    password: Sequelize.DataTypes.STRING,
    username: Sequelize.DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
    timestamps: false
  });
  // SQUser.hasMany(SQBook);
  await SQUser.sync();
}

export default class SequelizeUserStore extends AbstractUsersStore {

  async close() {
    closeSequlz();
    sequelize = undefined;
  }

  async update(email, password, username) {
    await connectDB();
    const User = await SQUser.findOne({ where: { email: email } }) 
    if (!User) { 
      throw new Error(`No User found for ${email}`); 
    } else {
      await SQUser.update({ 
        email: email, 
        password: password,
        username: username
      }, {
        where: { email: email }
      });
      return this.read(email);
    } 
  }

  async create(email, password, username) {
    await connectDB();
    const newUser = await SQUser.create({ 
      email: email, 
      password: password,
      username: username
    });
    return new User(newUser.email, newUser.password, newUser.username);
  }

  async read(email) {
    await connectDB();
    const newUser = await SQUser.findOne({ where: { email: email } });
    if (!newUser) { 
      throw new Error(`No User found for ${email}`); 
    } else { 
      return new User(newUser.email, newUser.password, newUser.username); 
    } 
  }

  async verify(email) {
    await connectDB();
    const newUser = await SQUser.findOne({ where: { email: email } });
    if (!newUser) { 
      return null
    } else { 
      return new User(newUser.email, newUser.password, newUser.username); 
    } 
  }

  async destroy(email) {
    await connectDB();
    await SQUser.destroy({ where: { email: email } });
    debug(`DESTROY ${email}`);
  }
}